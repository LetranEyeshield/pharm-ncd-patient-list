import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Step 1: Define the TypeScript interface
export interface VitaminsCardType extends Document {
  _id: Types.ObjectId;
  cardName: string;
  cardDate: Date;
  initialStock?: string;
  qtyIn?: string;
  lotNoIn?: string;
  expiryIn?: string;
  qtyOut?: string;
  lotNoOut?: string;
  expiryOut?: string;
  balance?: string;
}

// Step 2: Define the schema with stricter validation
const VitaminsCardSchema = new Schema<VitaminsCardType>({
  cardName: { type: String, required: true, trim: true },
  cardDate: { type: Date },
  initialStock: { type: String },
  qtyIn: { type: String },
  lotNoIn: { type: String },
  expiryIn: { type: String },
  qtyOut: { type: String },
  lotNoOut: { type: String },
  expiryOut: { type: String },
  balance: { type: String },
});

// Step 3: Export the typed model
export const Vitaminscard: Model<VitaminsCardType> =
  mongoose.models.Vitaminscards ||
  mongoose.model<VitaminsCardType>("Vitaminscards", VitaminsCardSchema);
