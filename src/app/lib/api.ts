import axios from "axios";
// import { connectDB } from "./mongodb";
// import { connectDB } from "@/app/lib/mongodb";
// import Patient from "../models/Patient";
import Patient from "@/app/models/Patient";
// import { NextResponse } from "next/server";
import { CardType } from "@/app/models/Card";
import { MaintenanceCardType } from "@/app/models/Maintenance";
import { VitaminsCardType } from "@/app/models/Vitamins";

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

// export async function savePatient(patient: {
//   firstName: string;
//   middleName?: string;
//   lastName: string;
//   birthday: string;
//   age: number;
//   address: string;
//   medicines: string[];
// }) {
//   try {
//     const response = await axios.post("/api/patients", patient);
//   } catch (error: any) {
//     console.error(error.response?.data || error.message);
//   }

//   // const response = await axios.post("/api/patients", patient);
//   // return response.data;
// }

export async function savePatient(patient: {
  firstName: string;
  middleName?: string;
  lastName: string;
  birthday: string;
  age: number;
  address: string;
  medicines: string[];
}) {
  try {
    const response = await axios.post("/api/patients", patient);
    return response.data as { success: boolean; message: string };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }
    throw error; // rethrow so frontend can handle it
  }
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

// Delete card
export const deleteCard = async (id: string) => {
  const res = await axios.delete(`/api/cards/${id}`);
  return res.data;
};

//MAINTENANCE CARDS
//
export async function saveMaintanance(maintenance: {
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
  const response = await axios.post("/api/maintenance", maintenance);
  return response.data;
}

// export async function updateCard(
//   id: string,
//   data: Partial<CardType>
// ): Promise<CardType> {
//   const res = await axios.put(`/api/cards/${id}`, data);
//   return res.data;
// }

export const updateMaintenance = async (
  id: string,
  updates: Partial<MaintenanceCardType>
) => {
  const res = await axios.patch(`/api/maintenance/${id}`, updates);
  return res.data;
};

// Delete maintenance
export const deleteMaintenance = async (id: string) => {
  const res = await axios.delete(`/api/maintenance/${id}`);
  return res.data;
};

//VITAMINS CARDS
//
export async function saveVitamins(vitamins: {
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
  const response = await axios.post("/api/vitamins", vitamins);
  return response.data;
}

// export async function updateCard(
//   id: string,
//   data: Partial<CardType>
// ): Promise<CardType> {
//   const res = await axios.put(`/api/cards/${id}`, data);
//   return res.data;
// }

export const updateVitamins = async (
  id: string,
  updates: Partial<VitaminsCardType>
) => {
  const res = await axios.patch(`/api/vitamins/${id}`, updates);
  return res.data;
};

// Delete maintenance
export const deleteVitamins = async (id: string) => {
  const res = await axios.delete(`/api/vitamins/${id}`);
  return res.data;
};
