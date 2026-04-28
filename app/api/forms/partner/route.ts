import { NextRequest, NextResponse } from "next/server";
import { handleIntakeSubmission } from "@/lib/inbox/handleIntakeSubmission";

export async function POST(request: NextRequest) {
  return handleIntakeSubmission(request, "partner", "partner_submit");
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
