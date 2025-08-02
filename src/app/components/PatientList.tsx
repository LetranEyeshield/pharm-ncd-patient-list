// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { getAllPatients, Patient } from "@/app/lib/api";
// import debounce from "lodash.debounce";

// export default function PatientsPage() {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     getAllPatients()
//       .then((data) => {
//         setPatients(data);
//         setFilteredPatients(data); // initially show all
//       })
//       .catch((err) => console.error("Fetch error:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   // Debounced search function
//   const handleSearch = useMemo(
//     () =>
//       debounce((query: string) => {
//         if (!query) {
//           setFilteredPatients(patients);
//         } else {
//           const lower = query.toLowerCase();
//           const filtered = patients.filter((p) =>
//             `${p.firstName} ${p.lastName}`.toLowerCase().includes(lower)
//           );
//           setFilteredPatients(filtered);
//         }
//       }, 300),
//     [patients]
//   );

//   // On input change
//   function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const value = e.target.value;
//     setSearchQuery(value);
//     handleSearch(value);
//   }

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">All Patients</h1>

//       <input
//         type="text"
//         placeholder="Search by name..."
//         value={searchQuery}
//         onChange={onSearchChange}
//         className="mb-4 px-4 py-2 border rounded w-full"
//       />

//       <ul className="space-y-3">
//         {filteredPatients.length === 0 ? (
//           <li className="text-gray-500">No matching patients found.</li>
//         ) : (
//           filteredPatients.map((p) => (
//             <li key={p._id} className="border p-3 rounded shadow">
//               <p>
//                 <strong>
//                   {p.firstName}
//                   {p.middleName} {p.lastName}
//                 </strong>
//               </p>
//               <p>Birthday: {p.birthday}</p>
//               <p>Age: {p.age}</p>
//               <p>Address: {p.address}</p>
//               <p>Medicines: {p.medicines.join(", ")}</p>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllPatients, Patient, updatePatient } from "@/app/lib/api";
import debounce from "lodash.debounce";
import { addressList, medicinesList } from "../patientForm/page";
import toast from "react-hot-toast";
import axios from "axios";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  useEffect(() => {
    getAllPatients()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
        setPatients(sorted);
        setFilteredPatients(sorted);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (!query) {
          setFilteredPatients(patients);
        } else {
          const lower = query.toLowerCase();
          const filtered = patients.filter((p) =>
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(lower)
          );
          setFilteredPatients(filtered);
        }
      }, 300),
    [patients]
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditForm({ ...patient });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "birthday") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setEditForm((prev) => ({ ...prev, birthday: value, age }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setEditForm((prev) => {
      const current = prev.medicines || [];
      const updatedMedicines = checked
        ? [...current, value]
        : current.filter((m) => m !== value);
      return { ...prev, medicines: updatedMedicines };
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !editForm) return;

    try {
      const updated = await updatePatient(selectedPatient._id, editForm);
      toast.success("Patient updated successfully!");
      const updatedList = patients.map((p) =>
        p._id === updated._id ? updated : p
      );
      setPatients(updatedList);
      setFilteredPatients(updatedList);
      setSelectedPatient(null);
    } catch (error) {
      toast.error("Failed to update patient.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (!confirm) return;

    const toastId = toast.loading("Deleting patient...");

    try {
      await axios.delete(`/api/patients/${id}`);
      toast.success("Patient deleted successfully!", { id: toastId });

      // Refresh patient list
      const updated = await getAllPatients();
      setPatients(updated);
      setFilteredPatients(updated);
    } catch (err) {
      toast.error("Failed to delete patient", { id: toastId });
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={onSearchChange}
        className="mb-4 px-4 py-2 border rounded w-full"
      />

      <ul className="space-y-3">
        {filteredPatients.length === 0 ? (
          <li className="text-gray-500">No matching patients found.</li>
        ) : (
          filteredPatients.map((p) => (
            <li key={p._id} className="border p-3 rounded shadow">
              <p>
                <strong>
                  {p.firstName} {p.middleName} {p.lastName}
                </strong>
              </p>
              <p>Birthday: {new Date(p.birthday).toLocaleDateString()}</p>
              <p>Age: {p.age}</p>
              <p>Address: {p.address}</p>
              <p>Medicines: {p.medicines.join(", ")}</p>
              <button
                className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded"
                onClick={() => handleEditClick(p)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold">Edit Patient</h2>

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={editForm.firstName || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={editForm.middleName || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={editForm.lastName || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="date"
              name="birthday"
              value={
                editForm.birthday
                  ? new Date(editForm.birthday).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <select
              name="address"
              value={editForm.address || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Address</option>
              {addressList.map((addr) => (
                <option key={addr} value={addr}>
                  {addr}
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <label className="font-semibold block">Medicines:</label>
              {medicinesList.map((med) => (
                <label key={med} className="block">
                  <input
                    type="checkbox"
                    value={med}
                    checked={editForm.medicines?.includes(med) || false}
                    onChange={handleMedicineChange}
                    className="mr-2"
                  />
                  {med}
                </label>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
