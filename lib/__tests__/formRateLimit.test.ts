import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The hire/partner/intake forms verify reCAPTCHA but had no rate limit, so a
 * single source with a valid token could drive unbounded Mongo writes, Inbox
 * POSTs, and outbound email. These tests pin the limit boundaries and the
 * fail-open behavior (a DB blip must not close the only way a client can reach
 * BAM, since reCAPTCHA still stands in front).
 */

const counts = { hourlyByIp: 0, dailyByIp: 0, dailyByEmail: 0 };
let shouldThrow = false;

const countDocuments = vi.fn(async (query: Record<string, unknown>) => {
  if (shouldThrow) throw new Error("mongo down");
  if ("payload.email" in query) return counts.dailyByEmail;
  // IP queries differ only by window; the hourly check runs first.
  return countDocuments.mock.calls.length === 1 ? counts.hourlyByIp : counts.dailyByIp;
});

vi.mock("@/lib/db/mongodb", () => ({
  default: Promise.resolve({
    db: () => ({ collection: () => ({ countDocuments }) }),
  }),
}));

const { checkFormRateLimit, HOUR_LIMIT_PER_IP, DAY_LIMIT_PER_IP, DAY_LIMIT_PER_EMAIL } =
  await import("../inbox/formRateLimit");

beforeEach(() => {
  counts.hourlyByIp = 0;
  counts.dailyByIp = 0;
  counts.dailyByEmail = 0;
  shouldThrow = false;
  countDocuments.mockClear();
});

describe("checkFormRateLimit", () => {
  it("allows a first submission", async () => {
    const result = await checkFormRateLimit("1.2.3.4", "a@example.com");
    expect(result.isLimited).toBe(false);
  });

  it("allows right up to the hourly limit", async () => {
    counts.hourlyByIp = HOUR_LIMIT_PER_IP - 1;
    expect((await checkFormRateLimit("1.2.3.4")).isLimited).toBe(false);
  });

  it("blocks at the hourly IP limit", async () => {
    counts.hourlyByIp = HOUR_LIMIT_PER_IP;
    const result = await checkFormRateLimit("1.2.3.4");
    expect(result.isLimited).toBe(true);
    expect(result.reason).toContain("hourly");
    expect(result.nextAllowedTime).toBeInstanceOf(Date);
  });

  it("blocks at the daily IP limit", async () => {
    counts.dailyByIp = DAY_LIMIT_PER_IP;
    const result = await checkFormRateLimit("1.2.3.4");
    expect(result.isLimited).toBe(true);
    expect(result.reason).toContain("daily");
  });

  it("blocks at the daily per-email limit even from a fresh IP", async () => {
    counts.dailyByEmail = DAY_LIMIT_PER_EMAIL;
    const result = await checkFormRateLimit("9.9.9.9", "spammer@example.com");
    expect(result.isLimited).toBe(true);
    expect(result.reason).toContain("email");
  });

  it("skips the email check when no email is supplied", async () => {
    counts.dailyByEmail = DAY_LIMIT_PER_EMAIL;
    expect((await checkFormRateLimit("1.2.3.4")).isLimited).toBe(false);
  });

  it("fails open when Mongo is unavailable", async () => {
    shouldThrow = true;
    expect((await checkFormRateLimit("1.2.3.4", "a@example.com")).isLimited).toBe(false);
  });
});
