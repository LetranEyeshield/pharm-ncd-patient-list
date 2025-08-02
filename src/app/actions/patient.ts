"use server";

import { connectDB } from "@/app//lib/mongodb";
import Patient from "@/app/models/Patient";
import { PatientType } from "../types/Patient";

export async function savePatient(data: FormData) {
  const firstName = data.get("firstName")?.toString();
  const middleName = data.get("middleName")?.toString();
  const lastName = data.get("lastName")?.toString();
  const birthday = data.get("birthday")?.toString();
  const age = data.get("age")?.toString();
  const address = data.get("address")?.toString();
  //const address = data.getAll("address").map((a) => a.toString()); // ✅ array
  const medicines = data.getAll("medicines").map((m) => m.toString()); // ✅ array

  if (!firstName || !lastName || !birthday || !address || !age) {
    return { success: false, message: "Required fields are missing." };
  }

  if (medicines.length === 0) {
    return { success: false, message: "Please select at least one medicine." };
  }

  try {
    await connectDB();
    const newPatient = new Patient({
      firstName,
      middleName,
      lastName,
      birthday,
      age: Number(age),
      address,
      medicines,
    });
    await newPatient.save();
    return { success: true };
  } catch (error) {
    console.error("Error saving patient:", error);
    return { success: false };
  }
}

// export async function getAllPatients() {
//   await connectDB();
//   return await Patient.find().sort({ firstName: 1 });
// }

export async function getAllPatients() {
  await connectDB();
  const patients = await Patient.find().sort({ firstName: 1 }).lean(); // ✅ lean returns plain JS objects
  return patients.map((p) => ({
    ...p,
    _id: p._id.toString(), // ✅ convert ObjectId to string
  }));
}

// export async function searchPatientsByName(name: string) {
//   await connectDB();
//   return await Patient.find({
//     fullName: { $regex: new RegExp(name, "i") },
//   });
// }

// export async function searchPatientsByName(name: string) {
//   await connectDB();
//   return await Patient.find({
//     $or: [
//       { fullName: { $regex: new RegExp(name, "i") } },
//       { middleName: { $regex: new RegExp(name, "i") } },
//       { lastName: { $regex: new RegExp(name, "i") } },
//     ],
//   });
// }

export async function searchPatientsByName(name: string) {
  await connectDB();

  const patients = await Patient.find({
    $or: [
      { fullName: { $regex: new RegExp(name, "i") } },
      { middleName: { $regex: new RegExp(name, "i") } },
      { lastName: { $regex: new RegExp(name, "i") } },
    ],
  });

  return patients.map((p) => ({
    _id: p._id.toString(),
    firstName: p.firstName,
    middleName: p.middleName ?? "",
    lastName: p.lastName,
    // birthday: p.birthday.toISOString(),
    birthday: p.birthday,
    address: p.address,
    medicines: p.medicines,
    age: p.age ?? null,
  }));
}

export async function getPatientById(id: string): Promise<PatientType> {
  await connectDB();
  const p = await Patient.findById(id).lean(); // important: use .lean() to get plain JS object

  if (!p) throw new Error("Patient not found");

  return {
    _id: p._id.toString(),
    firstName: p.firstName,
    middleName: p.middleName ?? "",
    lastName: p.lastName,
    birthday: p.birthday,
    address: p.address,
    medicines: p.medicines,
    age: p.age ?? null,
  };
}

export async function updatePatient(id: string, data: FormData) {
  const firstName = data.get("firstName")?.toString();
  const middleName = data.get("middleName")?.toString();
  const lastName = data.get("lastName")?.toString();
  const birthday = data.get("birthday")?.toString();
  const age = data.get("age")?.toString();
  const address = data.get("address")?.toString();
  //const address = data.getAll("address").map((a) => a.toString()); // ✅ array
  const medicines = data.getAll("medicines").map((m) => m.toString()); // ✅ array

  if (!firstName || !lastName || !birthday || !address || !age) {
    return { success: false, message: "Required fields are missing." };
  }

  if (medicines.length === 0) {
    return { success: false, message: "Please select at least one medicine." };
  }

  try {
    await connectDB();
    await Patient.findByIdAndUpdate(id, {
      firstName,
      middleName,
      lastName,
      birthday,
      address,
      medicines,
    });
    return { success: true, message: "Successfully Updated Patient!" };
  } catch (error) {
    return { success: false, message: "Error Updating Patient!" };
  }
}

export async function deletePatient(id: string) {
  try {
    await connectDB();
    await Patient.findByIdAndDelete(id);
    return { success: true, message: "Successfully Deleted Patient!" };
  } catch (error) {
    console.error("Error deleting patient:", error);
    return { success: false, message: "Error Deleting Patient!" };
  }
}
