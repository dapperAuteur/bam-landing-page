import { NextRequest, NextResponse } from "next/server";
import { handleSurveySubmission } from "@/lib/inbox/handleSurveySubmission";

export async function POST(request: NextRequest) {
  return handleSurveySubmission(request, "intake_submit");
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
