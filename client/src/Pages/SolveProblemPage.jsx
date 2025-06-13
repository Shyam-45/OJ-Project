import SolveProblem from "../components/SolveProblem.jsx";
import Navbar from "../components/Navbar.jsx";

export default function SolveProblemPage() {
  return (
    <>
      <div className="flex flex-col dark:bg-gray-600">
        <Navbar />
        <main className="mt-12 lg:mt-16 dark:bg-gray-600">
          <SolveProblem />
        </main>
      </div>
    </>
  );
}
