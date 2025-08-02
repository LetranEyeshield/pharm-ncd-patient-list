"use client";

import { useState } from "react";
import { savePatient } from "../actions/patient";
import Link from "next/link";

export const medicinesList: string[] = [
  "AMLODIPINE",
  "ASPIRIN",
  "ATORVASTATIN",
  "CAPTOPRIL",
  "CARVEDILOL",
  "CLONIDINE",
  "CLOPIDOGREL",
  "DIGOXIN",
  "FELODIPINE",
  "FUROSEMIDE",
  "GLICLAZIDE",
  "IRBESARTAN",
  "LOSARTAN",
  "LOSARTAN + HCTZ",
  "METFORMIN",
  "METHYLDOPA",
  "METOPROLOL",
  "ROSUVASTATIN",
  "TRIMETAZIDINE",
  "SIMVASTATIN",
  "SPIRONOLACTONE",
];

export const addressList: string[] = [
  "BABASIT",
  "BAGUINAY",
  "BARITAO",
  "BISAL",
  "BUCAO",
  "CABANBANAN",
  "CALAOCAN",
  "INAMOTAN",
  "LELEMAAN",
  "LICSI",
  "LIPIT NORTE",
  "LIPIT SUR",
  "MATULONG",
  "MERMER",
  "NALSIAN",
  "ORAAN EAST",
  "ORAAN WEST",
  "PANTAL",
  "PAO",
  "PARIAN",
  "POBLACION",
  "PUGARO",
  "SAN RAMON",
  "SAPANG",
  "STA. INES",
  "TEBUEL",
];

export default function PatientForm() {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    age: "",
    address: "",
    medicines: [],
  });

  const handleSubmit = async (formData: FormData) => {
    const result = await savePatient(formData);
    if (result.success) {
      alert("✅ Patient saved successfully!");
    } else {
      alert("❌ Failed to save patient.");
    }
  };

  function handleBirthdayChange(e: React.ChangeEvent<HTMLInputElement>) {
    const birthday = e.target.value;
    const age = calculateAge(birthday);
    setForm((prev) => ({
      ...prev,
      birthday,
      age: age.toString(),
    }));
  }

  function calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }
    return age;
  }

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow bg-green-200 mt-8">
      <form action={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-l md:text-3xl font-bold">ADD PATIENT RECORD</h2>

        <input
          name="firstName"
          placeholder="First Name"
          required
          className="w-full p-2 border rounded mt-2"
        />
        <input
          name="middleName"
          placeholder="Middle Name"
          className="w-full p-2 border rounded mt-2"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          required
          className="w-full p-2 border rounded mt-2"
        />
        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleBirthdayChange}
        />

        {/* <input
          type="number"
          name="age"
          value={form.age}
          readOnly
          className="bg-gray-100"
        /> */}
        <input
          type="number"
          value={form.age}
          readOnly
          className="bg-gray-100"
        />
        <input type="hidden" name="age" value={form.age} />

        {/* <input
          name="address"
          placeholder="Address"
          required
          className="w-full p-2 border rounded mt-2"
        /> */}

        <select
          name="address"
          value={form.address}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address: e.target.value }))
          }
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Select Address --</option>
          {addressList.map((add) => (
            <option key={add} value={add}>
              {add}
            </option>
          ))}
        </select>

        <fieldset className="w-full p-2 border rounded mt-2 bg-gray-100">
          <legend className="font-semibold">Medicines</legend>
          {medicinesList.map((med) => (
            <label key={med} className="flex items-center gap-2 p-1">
              <input type="checkbox" name="medicines" value={med} />
              <span>{med}</span>
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-xl text-white rounded hover:bg-blue-600"
        >
          Add Patient
        </button>
      </form>
      <Link href={"/"}>Back</Link>
    </div>
  );
}
