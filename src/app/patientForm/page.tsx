"use client";

import Link from "next/link";
import { savePatient } from "@/app/lib/api";
import { useState } from "react";
import { addressList, medicinesList } from "../constants/lists";

export default function PatientForm() {
  // const [form, setForm] = useState({
  //   firstName: "",
  //   middleName: "",
  //   lastName: "",
  //   birthday: "",
  //   age: "",
  //   address: "",
  //   medicines: [],
  // });

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    age: 0,
    address: "",
    medicines: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await savePatient(form);
      if (res.success) {
        alert(res.message); // or use toast if you're using shadcn/ui
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Error Saving Patient " + err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "birthday") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setForm((prev) => ({ ...prev, age, birthday: value }));
    }
  };

  const handleMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const newMedicines = checked
        ? [...prev.medicines, value]
        : prev.medicines.filter((m) => m !== value);
      return { ...prev, medicines: newMedicines };
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow bg-green-200 mt-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="middleName"
          value={form.middleName}
          onChange={handleChange}
          placeholder="Middle Name (optional)"
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="border p-2 w-full"
        />

        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="age"
          value={form.age}
          readOnly
          placeholder="Age"
          className="border p-2 w-full bg-gray-100 cursor-not-allowed"
        />

        <select
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="">Select Address</option>
          {addressList.map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </select>
        <div className="space-y-2">
          <label className="font-semibold block">Medicines:</label>
          {medicinesList.map((medicine) => (
            <label key={medicine} className="block">
              <input
                type="checkbox"
                value={medicine}
                checked={form.medicines.includes(medicine)}
                onChange={handleMedicineChange}
                className="mr-2"
              />
              {medicine}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Patient
        </button>
      </form>

      <Link href={"/"}>Back</Link>
    </div>
  );
}
