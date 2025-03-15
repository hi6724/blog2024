import { getYearMonthDifference } from "@/lib/date";
import { NextResponse } from "next/server";

export async function GET() {
  const startDate = new Date(2023, 7, 1);
  const endDate = new Date();
  const startKbDate = new Date(2024, 11, 1);
  const diff = getYearMonthDifference(startDate, endDate);
  const kbDiff = getYearMonthDifference(startKbDate, endDate);
  const tmaxDiff = getYearMonthDifference(new Date(2023, 7, 1), new Date(2024, 10, 18));

  return NextResponse.json({ total: diff, kb: kbDiff, tmax: tmaxDiff });
}
