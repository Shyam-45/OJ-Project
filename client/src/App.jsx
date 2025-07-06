import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-600">
      <Navbar />
      <main className="flex-grow bg">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
