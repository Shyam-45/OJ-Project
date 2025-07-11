import Navbar from "../Components/Navbar.jsx";
import Compiler from "../Components/Compiler.jsx";

export default function CompilerPage() {
  return (
    <div className="flex flex-col dark:bg-gray-600">
      <Navbar />
      <main className="mt-12 lg:mt-16 dark:bg-gray-600">
        <Compiler />
      </main>
    </div>
  );
}
