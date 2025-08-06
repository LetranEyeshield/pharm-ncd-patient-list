import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Patient from "@/app/models/Patient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      middleName,
      lastName,
      birthday,
      age,
      address,
      medicines,
    } = body;

    if (!firstName || !lastName || !birthday || !address || !age) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing." },
        { status: 400 }
      );
    }

    if (!medicines || medicines.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please select at least one medicine." },
        { status: 400 }
      );
    }

    await connectDB();
    const newPatient = new Patient({
      firstName,
      middleName,
      lastName,
      birthday,
      age,
      address,
      medicines,
    });

    await newPatient.save();

    return NextResponse.json(
      { success: true, message: "Patient saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     await connectDB();
//     const patients = await Patient.find();
//     return NextResponse.json(patients);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch patients" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    await connectDB();
    const allPatients = await Patient.find().sort({ firstName: 1 });
    // const allPatients = await Patient.find({ age: 0 }).sort({
    //   firstName: 1,
    // });
    return NextResponse.json(allPatients);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

// export async function getPatientCount(): Promise<number> {
//   await connectDB();
//   return await Patient.countDocuments();
// }
