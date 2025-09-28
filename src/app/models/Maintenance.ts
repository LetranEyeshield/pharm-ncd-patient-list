import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Step 1: Define the TypeScript interface
export interface MaintenanceCardType extends Document {
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
const MaintenanceCardSchema = new Schema<MaintenanceCardType>({
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
export const Maintenancecard: Model<MaintenanceCardType> =
  mongoose.models.Maintenancecards ||
  mongoose.model<MaintenanceCardType>(
    "Maintenancecards",
    MaintenanceCardSchema
  );
