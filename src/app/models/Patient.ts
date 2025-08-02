import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  birthday: { type: Date, required: true },
  age: { type: Number }, // This will be computed before saving
  address: { type: String, required: true },
  medicines: [{ type: String }], // Will store array of selected medicines
});

// patientSchema.pre("save", function (next) {
//   const today = new Date();
//   const birthDate = new Date(this.birthday);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   this.age = age;
//   next();
// });

export default mongoose.model("Patients", patientSchema);
