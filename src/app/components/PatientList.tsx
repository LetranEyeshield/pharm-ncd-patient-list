"use client";

import Link from "next/link";
import {
  deletePatient,
  getAllPatients,
  searchPatientsByName,
} from "../actions/patient";
import { PatientType } from "../types/Patient";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { DeleteButton } from "./DeleteButton";

export default function PatientList() {
  //const patients = await getAllPatients();
  //const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<PatientType[]>([]);
  //const [debouncedSearch, setDebouncedSearch] = useState(search);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setDebouncedSearch(search);
  //   }, 500); // debounce time in ms

  //   return () => clearTimeout(timeout);
  // }, [search]);

  useEffect(() => {
    const fetchPatients = async () => {
      const result = await getAllPatients();
      setPatients(result);
    };
    fetchPatients();
  }, []);

  // useEffect(() => {
  //   if (!debouncedSearch) return; // don't search on empty
  //   async function fetchPatients() {
  //     const results = await searchPatientsByName(query);
  //     setPatients(results);
  //   }
  //   fetchPatients();
  // }, [debouncedSearch]);

  // const handleSearch = async () => {
  //   const results = await searchPatientsByName(query);
  //   setPatients(results);
  // };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim() === "") {
        const all = await getAllPatients();
        setPatients(all);
        return;
      }

      const results = await searchPatientsByName(query);
      setPatients(results);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  return (
    <div>
      <h1>THIS IS THE DASHBOARD</h1>
      <Link href={"/patientForm"}>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Add New Patient
        </button>
      </Link>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 mb-4 w-full"
      />

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
              <td className="border px-4 py-2">
                {new Date(patient.birthday).toLocaleDateString()}
              </td>
              {/* <td className="border px-4 py-2">
                {new Date(patient.birthday).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td> */}
              <td className="border px-4 py-2">{patient.age}</td>
              <td className="border px-4 py-2">{patient.address}</td>
              <td className="border px-4 py-2 whitespace-pre-wrap">
                {patient.medicines.join("\n")}
              </td>
              <td className="border px-4 py-2">
                <Link href={`/edit-patient/${patient._id}`}>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                </Link>
                {/* <DeleteButton id={patient._id} /> */}
                <button
                  onClick={async () => {
                    const result = await deletePatient(patient._id);
                    if (result.success) {
                      alert(result.message);
                    } else {
                      alert(result.message);
                    }
                    setPatients((prev) =>
                      prev.filter((patient) => patient._id !== patient._id)
                    );
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
