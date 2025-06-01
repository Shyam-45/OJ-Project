import SolveProblem from "../Components/SolveProblem.jsx";
import Navbar from "../Components/Navbar.jsx";

export default function SolveProblemPage() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-600">
      <Navbar />
      <main className="flex-grow pt-16">
        <SolveProblem />
      </main>
    </div>
  );
}
