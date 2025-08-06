"use client";

import Link from "next/link";
import { savePatient } from "@/app/lib/api";
import { useState } from "react";
import { addressList, medicinesList } from "../constants/lists";
import Banner from "../components/Banner";
import toast from "react-hot-toast";

type Patient = {
  firstName: string;
  middleName?: string;
  lastName: string;
  birthday: string;
  age: number;
  address: string;
  medicines: string[];
};

export default function PatientForm() {
  const [form, setForm] = useState<Patient>({
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    age: 0,
    address: "",
    medicines: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await savePatient(form);
      if (res.success) {
        //alert(res.message); // or use toast if you're using shadcn/ui
        toast.success("Saving Patient Successful!", {
          duration: 3000,
          style: {
            background: "lightgreen",
            //color: "white", // white text
            //fontFamily: "Arial, sans-serif",
            fontSize: "21px",
          },
        });
      } else {
        //alert(res.message);
        toast("Error Saving Patient!", {
          duration: 3000,
          style: {
            background: "red",
            color: "white", // white text
            //fontFamily: "Arial, sans-serif",
            fontSize: "21px",
          },
        });
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
    <div className="patient-form-div w-full pb-10">
      <Banner />
      <div className="p-4 max-w-lg mx-auto border rounded shadow bg-green-50 mt-8">
        <h2 className="font-bold text-xl sm:text-3xl mx-auto text-center mb-8">
          ADD NEW PATIENT
        </h2>
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer mr-6"
          >
            Save Patient
          </button>
          <Link
            href={"/"}
            className="logout-btn bg-green-500 text-white px-4 py-3 rounded hover:bg-green-700 cursor-pointer"
          >
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}
