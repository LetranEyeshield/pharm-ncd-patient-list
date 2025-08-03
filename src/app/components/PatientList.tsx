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
import toast from "react-hot-toast";
import axios from "axios";
import { addressList, medicinesList } from "../constants/lists";

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
      //toast.success("Patient updated successfully!");
      toast.success("Patient updated successfully!", {
        duration: 5000,
        style: {
          background: "lightgreen",
          //color: "white", // white text
          //fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });
      const updatedList = patients.map((p) =>
        p._id === updated._id ? updated : p
      );
      setPatients(updatedList);
      setFilteredPatients(updatedList);
      setSelectedPatient(null);
    } catch (error) {
      //toast.error("Failed to update patient.");
      toast.error("Failed to update patient!", {
        duration: 3000,
        style: {
          background: "red",
          color: "white", // white text
          //fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });

      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (!confirm) return;

    //const toastId = toast.loading("Deleting patient...");
    const toastId = toast.loading("Deleting patient...", {
      style: {
        background: "#f78b90ff",
        //color: "white",
        //fontFamily: "Arial, sans-serif",
        fontSize: "21px",
      },
    });

    try {
      await axios.delete(`/api/patients/${id}`);
      //toast.success("Patient deleted successfully!", { id: toastId });
      toast.success("Patient deleted successfully!", {
        id: toastId,
        style: {
          background: "lightgreen",
          // color: "white",
          // fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });

      // Refresh patient list
      const updated = await getAllPatients();
      setPatients(updated);
      setFilteredPatients(updated);
    } catch (err) {
      //toast.error("Failed to delete patient", { id: toastId });
      toast.error("Failed to delete patient!", {
        id: toastId,
        style: {
          background: "#f78b90ff",
          // color: "white",
          // fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });

      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="py-8 px-15 w-10/12 mx-auto rounded-lg bg-green-50">
      <h2 className="font-bold text-xl sm:text-3xl mx-auto text-center mb-8">
        PATIENT LIST
      </h2>
      <hr className="mb-8" />
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={onSearchChange}
        className="search-field mb-5 px-4 py-2 border rounded"
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
              <p>
                <strong>Birthday: </strong>
                {new Date(p.birthday).toLocaleDateString()}
              </p>
              <p>
                <strong>Age: </strong> {p.age}
              </p>
              <p>
                <strong>Address: </strong> {p.address}
              </p>
              <p>
                <strong>Medicines: </strong> {p.medicines.join(", ")}
              </p>
              <button
                className="mt-2 mr-4 px-3 py-1 bg-blue-500 hover:bg-blue-300 cursor-pointer text-white rounded"
                onClick={() => handleEditClick(p)}
              >
                Edit
              </button>
              <button
                className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-300 cursor-pointer text-white rounded"
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
            <h2 className="font-bold text-xl sm:text-3xl mx-auto text-center mb-8">
              EDIT PATIENT
            </h2>

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
            <input
              type="number"
              name="age"
              onChange={handleFormChange}
              value={editForm.age}
              placeholder="Age"
              className="w-full border px-3 py-2 rounded"
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
                className="px-4 py-2 bg-gray-400 hover:bg-gray-600 cursor-pointer text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-400 cursor-pointer text-white rounded"
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
