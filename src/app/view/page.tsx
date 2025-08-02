"use client";

import Link from "next/link";
import { getAllPatients } from "../actions/patient";
import { PatientType } from "../types/Patient";
import { useEffect, useState } from "react";

export default function PatientList() {
  //const patients = await getAllPatients();
  //const [patients, setPatients] = useState([]);

  const [patients, setPatients] = useState<PatientType[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const result = await getAllPatients();
      setPatients(result);
    };
    fetchPatients();
  }, []);
  return (
    <div>
      <h1>THIS IS THE DASHBOARD</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Birthday</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Medicines</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* {patients.map((patient: any) => (
            <tr key={patient._id}>
              <td className="border px-4 py-2">
                {patient.firstName} {patient.middleName} {patient.lastName}
              </td>
              <td className="border px-4 py-2">{patient.birthday}</td>
              <td className="border px-4 py-2">{patient.age}</td>
              <td className="border px-4 py-2">{patient.address}</td>
              <td className="border px-4 py-2 whitespace-pre-wrap">
                {Array.isArray(patient.medicines)
                  ? patient.medicines.join("\n")
                  : ""}
              </td>
            </tr>
          ))} */}
          {patients.map((patient: PatientType) => (
            <tr key={patient._id}>
              <td className="border px-4 py-2">
                {patient.firstName} {patient.middleName} {patient.lastName}
              </td>
              {/* <td className="border px-4 py-2">{patient.birthday}</td> */}
              {/* <td>{new Date(patient.birthday).toLocaleDateString()}</td> */}
              <td className="border px-4 py-2">
                {new Date(patient.birthday).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="border px-4 py-2">{patient.age}</td>
              <td className="border px-4 py-2">{patient.address}</td>
              <td className="border px-4 py-2 whitespace-pre-wrap">
                {patient.medicines.join("\n")}
              </td>
              <td className="border px-4 py-2">
                <Link href={"/"}>Update</Link>
                <Link href={"/"}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
