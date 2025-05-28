import Navbar from "./Components/Navbar.jsx"
import Footer from "./Components/Footer.jsx"
import { Outlet } from "react-router-dom";

function App() {
  console.log("inside grp");
  return (
    <>
    <Navbar />
    <Outlet></Outlet>
    <Footer />
    </>
  );
}

export default App;
