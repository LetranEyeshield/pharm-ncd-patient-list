import PatientList from "./components/PatientList";

export default function Home() {
  return (
    <div className="w-full">
      <main className="flex flex-col">
        <PatientList />
      </main>
    </div>
  );
}
