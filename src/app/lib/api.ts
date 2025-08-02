import axios from "axios";
// import { connectDB } from "./mongodb";
import { connectDB } from "@/app/lib/mongodb";
// import Patient from "../models/Patient";
import Patient from "@/app/models/Patient";
import { NextResponse } from "next/server";

//needed by getAllPatients(0)
export interface Patient {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  birthday: string; // ISO string
  age: number;
  address: string;
  medicines: string[];
}

export async function savePatient(patient: {
  firstName: string;
  middleName?: string;
  lastName: string;
  birthday: string;
  age: number;
  address: string;
  medicines: string[];
}) {
  const response = await axios.post("/api/patients", patient);
  return response.data;
}

export async function getAllPatients(): Promise<Patient[]> {
  const res = await axios.get("/api/patients");
  return res.data;
}

export async function updatePatient(
  id: string,
  data: Partial<Patient>
): Promise<Patient> {
  const res = await axios.put(`/api/patients/${id}`, data);
  return res.data;
}
