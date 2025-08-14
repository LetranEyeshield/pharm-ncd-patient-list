import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { Card, CardType } from "@/app/models/Card";
import { FilterQuery } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cardName,
      cardDate,
      initialStock,
      qtyIn,
      lotNoIn,
      expiryIn,
      qtyOut,
      lotNoOut,
      expiryOut,
      balance,
    } = body;

    if (!cardDate) {
      return NextResponse.json(
        { success: false, message: "Date is missing." },
        { status: 400 }
      );
    }

    await connectDB();
    const newCard = new Card({
      cardName,
      cardDate,
      initialStock,
      qtyIn,
      lotNoIn,
      expiryIn,
      qtyOut,
      lotNoOut,
      expiryOut,
      balance,
    });

    await newCard.save();

    return NextResponse.json(
      { success: true, message: "Card saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}

//FOR Using Dropdown Search
export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const medsCard = searchParams.get("medsCard"); // from dropdown

  const query: FilterQuery<CardType> = {};

  if (medsCard && medsCard !== "All") {
    query.cardName = medsCard;
  }

  const card = await Card.find(query).lean();

  const formatted = card.map((c) => ({
    ...c,
    _id: c._id.toString(),
  }));

  return Response.json(formatted);
}
