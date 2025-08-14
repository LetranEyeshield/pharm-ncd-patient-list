import { connectDB } from "@/app/lib/mongodb";
import { Card } from "@/app/models/Card";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await request.json();
  const user = await Card.findByIdAndUpdate((await params).id, body, {
    new: true,
  });
  return NextResponse.json(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  await Card.findByIdAndDelete((await params).id);
  return NextResponse.json({ message: "Card deleted" });
}
