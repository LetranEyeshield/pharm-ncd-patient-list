// app/api/patients/[id]/route.ts
import { connectDB } from "@/app/lib/mongodb";
import Patients from "@/app/models/Patient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = context.params.id;
    const body = await req.json();

    const updated = await Patients.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = context.params.id;
    const deleted = await Patients.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Patient deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const data = await req.json();
//     const updated = await Patients.findByIdAndUpdate(params.id, data, {
//       new: true,
//     });
//     return NextResponse.json(updated);
//   } catch (err) {
//     return NextResponse.json({ error: "Failed to update" }, { status: 500 });
//   }
// }
