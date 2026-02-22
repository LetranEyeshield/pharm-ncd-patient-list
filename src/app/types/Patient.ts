export type PatientType = {
  _id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  birthday: Date;
  age?: number | null;
  address: string;
  medicines: string[];
};

