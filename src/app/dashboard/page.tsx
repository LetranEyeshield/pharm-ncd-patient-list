import Link from "next/link";
import LogoutButton from "../components/Logout";
import PatientList from "../components/PatientList";

export default async function Dashboard() {
  return (
    <div>
      <h1>THIS IS THE DASHBOARD</h1>
      <PatientList />
      <LogoutButton />
    </div>
  );
}
