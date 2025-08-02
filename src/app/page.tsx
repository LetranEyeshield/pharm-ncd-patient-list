import LogoutButton from "./components/Logout";
import PatientList from "./components/PatientList";

export default function Home() {
  return (
    <div className="w-full">
      <main className="flex flex-col">
        <h1>PHARM NCD PATIENT LIST</h1>
        <LogoutButton />
        <PatientList />
      </main>
    </div>
  );
}
