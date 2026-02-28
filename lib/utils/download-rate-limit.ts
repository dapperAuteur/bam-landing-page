import { Db } from 'mongodb'

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Check if a download is allowed based on the gallery's downloadsPerSession setting.
 * Tracks downloads per IP + galleryId in the gallery_access collection.
 * Returns { allowed: true } or { allowed: false, remaining: 0 }.
 */
export async function checkDownloadRateLimit(
  db: Db,
  galleryId: string,
  ipAddress: string,
  limit?: number
): Promise<{ allowed: boolean; remaining: number }> {
  // No limit configured — always allow
  if (!limit || limit <= 0) {
    return { allowed: true, remaining: Infinity }
  }

  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)

  const access = await db.collection('gallery_access').findOne({
    galleryId,
    ipAddress,
    lastDownloadAt: { $gte: windowStart }
  })

  const currentCount = access?.downloadsCount || 0

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining: limit - currentCount }
}

/**
 * Record a download event for rate-limiting tracking.
 */
export async function recordDownload(
  db: Db,
  galleryId: string,
  ipAddress: string
): Promise<void> {
  await db.collection('gallery_access').updateOne(
    { galleryId, ipAddress },
    {
      $inc: { downloadsCount: 1 },
      $set: { lastDownloadAt: new Date() },
      $setOnInsert: {
        galleryId,
        ipAddress,
        accessedAt: new Date()
      }
    },
    { upsert: true }
  )
}
