import SolveProblem from "../components/SolveProblem.jsx";
import Navbar from "../components/Navbar.jsx";

export default function SolveProblemPage() {
  return (
    <div className="flex flex-col dark:bg-gray-600">
      <Navbar />
      <main className="mt-12 lg:mt-16 dark:bg-gray-600">
        <SolveProblem />
      </main>
    </div>
  );
}

// /* Make scrollbars thin everywhere */
// * {
//   scrollbar-width: thin;               /* Firefox */
//   scrollbar-color: #4a5568 #2d3748;    /* thumb track */
// }

// /* WebKit browsers */
// *::-webkit-scrollbar {
//   width: 6px;
//   height: 6px;       /* horizontal bar if ever needed */
// }
// *::-webkit-scrollbar-track {
//   background: #2d3748;  /* dark gray track */
// }
// *::-webkit-scrollbar-thumb {
//   background-color: #4a5568; /* slightly lighter thumb */
//   border-radius: 3px;
//   border: 2px solid #2d3748; gives it a little padding inside
// }
