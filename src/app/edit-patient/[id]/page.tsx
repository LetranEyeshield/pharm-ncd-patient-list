// app/edit-patient/[id]/page.tsx

import { getPatientById } from "@/app/actions/patient";
import { updatePatient } from "@/app/actions/patient";
import Link from "next/link";

export default async function EditPatientPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = await getPatientById(params.id);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Patient</h1>

      <form
        action={async (formData) => {
          "use server";
          const result = await updatePatient(params.id, formData);
        }}
        className="space-y-4"
      >
        <input
          name="firstName"
          defaultValue={patient.firstName}
          required
          className="w-full border p-2"
          placeholder="First Name"
        />
        <input
          name="middleName"
          defaultValue={patient.middleName ?? ""}
          className="w-full border p-2"
          placeholder="Middle Name"
        />
        <input
          name="lastName"
          defaultValue={patient.lastName}
          required
          className="w-full border p-2"
          placeholder="Last Name"
        />
        <input
          type="date"
          name="birthday"
          //   defaultValue={patient.birthday.slice(0, 10)}
          defaultValue={patient.birthday.toString()}
          required
          className="w-full border p-2"
        />
        <input
          type="number"
          name="age"
          defaultValue={patient.age ?? ""}
          required
          className="w-full border p-2"
          placeholder="Age"
        />
        <input
          name="address"
          defaultValue={patient.address}
          required
          className="w-full border p-2"
          placeholder="Address"
        />

        <label className="block font-semibold mt-2">Medicines:</label>
        <div className="space-y-1">
          {["Paracetamol", "Ibuprofen", "Amoxicillin", "Vitamin C"].map(
            (med) => (
              <label key={med} className="block">
                <input
                  type="checkbox"
                  name="medicines"
                  value={med}
                  defaultChecked={patient.medicines.includes(med)}
                  className="mr-2"
                />
                {med}
              </label>
            )
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Update
        </button>
      </form>
      <Link href={"/"}>Back</Link>
    </div>
  );
}
