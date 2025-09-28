import { connectDB } from "@/app/lib/mongodb";
import { Maintenancecard } from "@/app/models/Maintenance";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await request.json();
  const user = await Maintenancecard.findByIdAndUpdate(
    (
      await params
    ).id,
    body,
    {
      new: true,
    }
  );
  return NextResponse.json(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  await Maintenancecard.findByIdAndDelete((await params).id);
  return NextResponse.json({ message: "Card deleted" });
}
