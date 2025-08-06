"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllPatients, Patient } from "@/app/lib/api";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { addressList } from "../constants/lists";
import Banner from "../components/Banner";
import Link from "next/link";
//
//
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
//
//

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  //FILE SAVER
  //   const handleExportExcel = () => {
  //     if (filteredPatients.length === 0) {
  //       alert("No data to export!");
  //       return;
  //     }

  //     // Convert JSON to worksheet
  //     const worksheet = XLSX.utils.json_to_sheet(filteredPatients);

  //     // Create workbook
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

  //     // Export
  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });

  //     const fileData = new Blob([excelBuffer], {
  //       type: "application/octet-stream",
  //     });
  //     saveAs(fileData, "filtered-patients.xlsx");
  //   };

  function exportPatientsToExcel(patients: Patient[]) {
    // Map only the fields you want
    const exportData = patients.map((p) => ({
      "First Name": p.firstName,
      "Middle Name": p.middleName || "",
      "Last Name": p.lastName,
      //   Birthday: p.birthday,
      Birthday: new Date(p.birthday).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      Age: p.age,
      Address: p.address,
      Medicines: p.medicines?.join(", ") || "",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patients");

    // Write to binary array
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Save file
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Reports.xlsx");
  }

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

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPatients]);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getAllPatients();
        setPatients(data);
        setTotalCount(data.length); // Store the full count separately
      } catch (error) {
        toast.error("Failed to fetch patients");
      }
    }

    fetchPatients();
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

  //   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     setSearchQuery(value);
  //     handleSearch(value);
  //   };

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value === "") {
      setFilteredPatients(patients); // show all if no filter
    } else {
      setFilteredPatients(patients.filter((p) => p.address === value));
    }
  };

  if (loading) return <p className="text-2xl text-center">Loading...</p>;

  return (
    <>
      <Banner />
      <div className="py-8 px-15 w-10/12 mx-auto rounded-lg bg-green-50">
        <h2 className="font-bold text-xl sm:text-3xl mx-auto text-center mb-8">
          REPORTS
        </h2>
        {/* <h3 className="font-bold text-2xl text-right mb-4">
        Total Patients: {filteredPatients.length}
      </h3> */}
        <h3 className="font-bold text-2xl text-right mb-4">
          Total Patients: {totalCount}
        </h3>

        <hr className="mb-8" />

        <select
          name="address"
          value={searchQuery}
          onChange={handleAddressChange}
          required
          className="border p-2 mb-8"
        >
          <option value="">Select Address</option>
          {addressList.map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </select>

        <button
          //onClick={handleExportExcel}
          onClick={() => exportPatientsToExcel(filteredPatients)}
          className="px-4 py-2 ml-6 bg-blue-300 text-white rounded hover:bg-blue-600"
        >
          Export to Excel
        </button>

        <ul className="space-y-3">
          {filteredPatients.length === 0 ? (
            <li className="text-gray-500">No matching patients found.</li>
          ) : (
            // filteredPatients.map((p) => (
            currentPatients.map((p) => (
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
              </li>
            ))
          )}
        </ul>
        <div className="pagination-div flex justify-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            First
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pageNum) => {
              const start = Math.max(1, currentPage - 2);
              const end = Math.min(totalPages, currentPage + 2);
              return pageNum >= start && pageNum <= end;
            })
            .map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 border rounded cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-green-500 text-white"
                    : "bg-white"
                }`}
              >
                {pageNum}
              </button>
            ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
}
