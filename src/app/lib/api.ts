import axios from "axios";
// import { connectDB } from "./mongodb";
// import { connectDB } from "@/app/lib/mongodb";
// import Patient from "../models/Patient";
import Patient from "@/app/models/Patient";
// import { NextResponse } from "next/server";
import { CardType } from "@/app/models/Card";

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
//
//
//
//CARDS
//
export async function saveCard(card: {
  cardName: string;
  cardDate: Date;
  initialStock?: string;
  qtyIn?: string;
  lotNoIn?: string;
  expiryIn?: string;
  qtyOut?: string;
  lotNoOut?: string;
  expiryOut?: string;
  balance?: string;
}) {
  const response = await axios.post("/api/cards", card);
  return response.data;
}

// export async function updateCard(
//   id: string,
//   data: Partial<CardType>
// ): Promise<CardType> {
//   const res = await axios.put(`/api/cards/${id}`, data);
//   return res.data;
// }

export const updateCard = async (id: string, updates: Partial<CardType>) => {
  const res = await axios.patch(`/api/cards/${id}`, updates);
  return res.data;
};

// Delete employee
export const deleteCard = async (id: string) => {
  const res = await axios.delete(`/api/cards/${id}`);
  return res.data;
};
