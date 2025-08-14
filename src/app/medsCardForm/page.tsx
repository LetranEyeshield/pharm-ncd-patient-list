"use client";

import Link from "next/link";
import { saveCard } from "@/app/lib/api";
import { useState } from "react";
import { medsCardList } from "../constants/lists";
import { CardType } from "../types/Cards";
import Banner from "../components/Banner";
import toast from "react-hot-toast";

export default function MedsCardForm() {
  const [form, setForm] = useState<CardType>({
    _id: "",
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
    try {
      const res = await saveCard(form);
      if (res.success) {
        //alert(res.message);
        toast.success("Saving Card Record Successful!", {
          duration: 3000,
          style: {
            background: "lightgreen",
            //color: "white", // white text
            //fontFamily: "Arial, sans-serif",
            fontSize: "21px",
          },
        });
      } else {
        alert(res.message);
      }
    } catch (err) {
      toast("Error Saving Card!", {
        duration: 3000,
        style: {
          background: "red",
          color: "white", // white text
          //fontFamily: "Arial, sans-serif",
          fontSize: "21px",
        },
      });
      //alert("Error Saving Card " + err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value, // updates the correct key
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value, // updates the correct key
    }));
  };

  return (
    <div className="meds-card-form-div w-full pb-10">
      <Banner />
      <div className="p-4 max-w-lg mx-auto border rounded shadow bg-green-50 mt-8">
        <h2 className="font-bold text-xl sm:text-3xl mx-auto text-center mb-8">
          ADD CARD RECORD
        </h2>
        <form onSubmit={handleSubmit} className="w-full px-4">
          <select
            name="cardName"
            value={form.cardName}
            onChange={handleSelectChange}
            required
            className="border p-2 w-full mb-4"
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
          <label htmlFor="date">DATE:</label>
          <input
            type="date"
            name="cardDate"
            value={form.cardDate.toISOString().split("T")[0]} // format to YYYY-MM-DD
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                cardDate: new Date(e.target.value), // parse back to Date
              }))
            }
            required
            className="border p-2 w-full"
          />
          <label htmlFor="initialStock"></label>
          <input
            type="text"
            name="initialStock"
            value={form.initialStock}
            onChange={handleChange}
            placeholder="Initial Stock"
            className="border p-2 w-full mt-3 mb-4"
          />
          <div className="card-in w-full">
            <h3 className="text-center font-bold text-xl sm:text-4xl my-3 bg-green-300">
              Card In
            </h3>
            <label htmlFor="qtyIn"></label>
            <input
              type="text"
              name="qtyIn"
              value={form.qtyIn}
              onChange={handleChange}
              placeholder="Qty"
              className="border p-2 w-full mt-3"
            />
            <label htmlFor="lotNoIN"></label>
            <input
              type="text"
              name="lotNoIn"
              value={form.lotNoIn}
              onChange={handleChange}
              placeholder="Lot No"
              className="border p-2 w-full mt-3 mb-2"
            />
            <label htmlFor="expiryIn">EXPIRY DATE:</label>
            <input
              type="date"
              name="expiryIn"
              value={form.expiryIn ? form.expiryIn.toString() : ""}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
            />
          </div>

          <div className="card-in div w-full">
            <h3 className="text-center font-bold text-xl sm:text-4xl my-3 bg-green-300">
              Card OUT
            </h3>
            <label htmlFor="qtyOut"></label>
            <input
              type="text"
              name="qtyOut"
              value={form.qtyOut}
              onChange={handleChange}
              placeholder="Qty"
              className="border p-2 w-full"
            />
            <label htmlFor="lotNoOut"></label>
            <input
              type="text"
              name="lotNoOut"
              value={form.lotNoOut}
              onChange={handleChange}
              placeholder="Lot No"
              className="border p-2 w-full mb-2 mt-3"
            />
            <label htmlFor="expiryOut">EXPIRY DATE:</label>
            <input
              type="date"
              name="expiryOut"
              // value={
              //   form.expiryOut ? form.expiryOut.toISOString().split("T")[0] : ""
              // }
              value={form.expiryOut ? form.expiryOut.toString() : ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <label htmlFor="balance"></label>
          <input
            type="text"
            name="balance"
            value={form.balance}
            onChange={handleChange}
            placeholder="Balance"
            className="border p-2 w-full mt-3"
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 cursor-pointer mr-6"
          >
            Save Card Record
          </button>
          <Link
            href={"/cards"}
            className="back-btn mt-4 bg-green-500 text-white px-4 py-3 rounded hover:bg-green-700 cursor-pointer"
          >
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}
