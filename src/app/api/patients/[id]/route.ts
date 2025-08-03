import { connectDB } from "@/app/lib/mongodb";
import Patients from "@/app/models/Patient";
import { NextRequest, NextResponse } from "next/server";

// // Type from Next.js for route context
// interface RouteContext {
//   params: {
//     id: string;
//   };
// }

// export async function PUT(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const id = context.params.id;
//     const body = await req.json();

//     const updated = await Patients.findByIdAndUpdate(id, body, { new: true });

//     if (!updated) {
//       return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//     }

//     return NextResponse.json(updated);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update patient" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const id = context.params.id;
//     const deleted = await Patients.findByIdAndDelete(id);
//     if (!deleted) {
//       return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//     }
//     return NextResponse.json({ message: "Patient deleted" });
//   } catch (err) {
//     return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
//   }
// }

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

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const body = await req.json();

//     const updated = await Patients.findByIdAndUpdate(id, body, { new: true });

//     if (!updated) {
//       return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//     }

//     return NextResponse.json(updated);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update patient" },
//       { status: 500 }
//     );
//   }
// }

// app/api/patients/[id]/route.ts
// import { NextResponse } from "next/server";
// import { connectDB } from "@/app/lib/mongodb";
// import Patients from "@/app/models/Patient";

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   await connectDB();
//   const body = await request.json();

//   const updatedPatient = await Patients.findByIdAndUpdate(params.id, body, {
//     new: true,
//   });

//   if (!updatedPatient) {
//     return new NextResponse(JSON.stringify({ message: "Patient not found" }), {
//       status: 404,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   return new NextResponse(JSON.stringify(updatedPatient), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await request.json();
  const user = await Patients.findByIdAndUpdate((await params).id, body, {
    new: true,
  });
  return NextResponse.json(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  await Patients.findByIdAndDelete((await params).id);
  return NextResponse.json({ message: "User deleted" });
}
