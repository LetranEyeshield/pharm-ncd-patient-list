"use client";
import { useState } from "react";
import { medsCardList } from "@/app/constants/lists";
import Link from "next/link";
import Banner from "../components/Banner";
import toast from "react-hot-toast";
import { deleteCard, updateCard } from "../lib/api";
import { CardType } from "../models/Card";

export default function Cards() {
  const [medsCard, setMedsCard] = useState("All");
  const [results, setResults] = useState<CardType[]>([]);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [editForm, setEditForm] = useState<Partial<CardType>>({
    cardName: "",
    cardDate: new Date(),
    initialStock: "",
    qtyIn: "",
    lotNoIn: "",
    expiryIn: "",
    qtyOut: "",
    lotNoOut: "",
    expiryOut: "",
    balance: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `/api/cards?medsCard=${encodeURIComponent(medsCard)}`
    );
    const data = await res.json();
    setResults(data);
  };

  const handleEdit = (card: CardType) => {
    setEditingCard(card);
    setEditForm({
      cardName: card.cardName,
      cardDate: new Date(card.cardDate),
      initialStock: card.initialStock,
      qtyIn: card.qtyIn,
      lotNoIn: card.lotNoIn,
      expiryIn: card.expiryIn,
      qtyOut: card.qtyOut,
      lotNoOut: card.lotNoOut,
      expiryOut: card.expiryOut,
      balance: card.balance,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: e.target.type === "date" ? new Date(value) : value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingCard) return;
    try {
      await updateCard(editingCard._id.toString(), editForm);
      toast.success("Updated Successfully!", {
        duration: 3000,
        style: {
          background: "lightgreen",
          //color: "white", // white text
          //fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });
      setEditingCard(null);
      handleSubmit(new Event("submit") as unknown as React.FormEvent); // refresh list
    } catch (err) {
      toast("Error Updating Record!", {
        duration: 3000,
        style: {
          background: "red",
          color: "white", // white text
          //fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });
      console.error("Error: ", err);
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirm) return;
    try {
      await deleteCard(id);
      toast.success("Deleted Successfully!", {
        duration: 3000,
        style: {
          background: "lightgreen",
          //color: "white", // white text
          //fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });
    } catch (err) {
      toast("Error Deleting Record!", {
        duration: 3000,
        style: {
          background: "red",
          color: "white", // white text
          //fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });
      console.log("Error: ", err);
    }
  };

  return (
    <div className="w-full">
      <Banner />
      <div className="flex w-full justify-center mt-10">
        <Link
          href={"/medsCardForm"}
          className="bg-green-500 text-white px-4 py-3 rounded hover:bg-green-700 cursor-pointer"
        >
          Add Meds Card Record
        </Link>
        <Link
          href={"/"}
          className="ml-6 bg-green-500 text-white px-4 py-3 rounded hover:bg-green-700 cursor-pointer"
        >
          Back To Dashboard
        </Link>
      </div>
      <hr className="mt-8 mb-10" />

      <form onSubmit={handleSubmit} className="flex mb-10">
        <select
          value={medsCard}
          onChange={(e) => setMedsCard(e.target.value)}
          className="border rounded mr-4 ml-6"
        >
          <option value="All">All</option>
          {medsCardList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer mr-6"
        >
          Search
        </button>
      </form>

      <table className="list-table w-full border border-gray-300 border-collapse text-sm mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th className="bg-green-300"></th>
            <th className="bg-green-300 text-center">IN</th>
            <th className="bg-green-300"></th>
            <th className="bg-yellow-300"></th>
            <th className="bg-yellow-300 text-center">OUT</th>
            <th className="bg-yellow-300"></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th className="border text-center">Card Name</th>
            <th className="border text-center">Date</th>
            <th className="border text-center">Initial Stock</th>
            <th className="bg-green-300 border text-center">Qty In</th>
            <th className="bg-green-300 border text-center">Lot No. In</th>
            <th className="bg-green-300 border text-center">Expiry In</th>
            <th className="bg-yellow-300 border text-center">Qty Out</th>
            <th className="bg-yellow-300 border text-center">Lot No. Out</th>
            <th className="bg-yellow-300 border text-center">Expiry Out</th>
            <th className="border text-center">Balance</th>
            <th className="border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-4">
                No records found.
              </td>
            </tr>
          ) : (
            results.map((item) => (
              <tr
                key={item._id.toString()}
                className="hover:bg-blue-50 even:bg-gray-100"
              >
                <td className="border px-2 py-1">{item.cardName}</td>
                <td className="border px-2 py-1 text-center">
                  {new Date(item.cardDate).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.initialStock ?? ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.qtyIn ?? ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.lotNoIn ?? ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.expiryIn
                    ? new Date(item.expiryIn).toLocaleDateString()
                    : ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.qtyOut ?? ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.lotNoOut ?? ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.expiryOut
                    ? new Date(item.expiryOut).toLocaleDateString()
                    : ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.balance ?? ""}
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    className="px-5 py-1 bg-blue-500 hover:bg-blue-300 cursor-pointer text-white rounded"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id.toString())}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Edit Card</h2>

            <select
              name="cardName"
              value={editForm.cardName || ""}
              onChange={handleSelectChange}
              required
              className="border p-2 w-full mb-3"
            >
              <option value="" disabled>
                Select Card Name
              </option>
              {medsCardList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <label htmlFor="date">Date:</label>
            <input
              type="date"
              name="cardDate"
              value={
                editForm.cardDate
                  ? editForm.cardDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              required
              className="border p-2 w-full mb-3"
            />

            <label htmlFor="initialStock">Initial Stock</label>
            <input
              type="text"
              name="initialStock"
              value={editForm.initialStock || ""}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
            />

            <h3 className="font-semibold">Card In</h3>
            <input
              type="text"
              name="qtyIn"
              value={editForm.qtyIn || ""}
              onChange={handleChange}
              placeholder="Qty"
              className="border p-2 w-full mb-3"
            />
            <input
              type="text"
              name="lotNoIn"
              value={editForm.lotNoIn || ""}
              onChange={handleChange}
              placeholder="Lot No"
              className="border p-2 w-full mb-3"
            />
            <label htmlFor="expiryIn">EXPIRY DATE:</label>
            <input
              type="date"
              name="expiryIn"
              value={
                editForm.expiryIn
                  ? new Date(editForm.expiryIn).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <h3 className="font-semibold">Card Out</h3>
            <input
              type="text"
              name="qtyOut"
              value={editForm.qtyOut || ""}
              onChange={handleChange}
              placeholder="Qty"
              className="border p-2 w-full mb-3"
            />
            <input
              type="text"
              name="lotNoOut"
              value={editForm.lotNoOut || ""}
              onChange={handleChange}
              placeholder="Lot No"
              className="border p-2 w-full mb-3"
            />
            <label htmlFor="expiryOut">EXPIRY DATE:</label>
            <input
              type="date"
              name="expiryOut"
              value={
                editForm.expiryOut
                  ? new Date(editForm.expiryOut).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <label>Balance:</label>
            <input
              type="text"
              name="balance"
              value={editForm.balance || ""}
              onChange={handleChange}
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingCard(null)}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-800 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
