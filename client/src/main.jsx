import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import App from "./App.jsx";
import Home from "./Components/Home.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import RegisterPage from "./Components/RegisterPage.jsx";
import User from "./Components/User.jsx";
import SolveProblem from "./Components/SolveProblem.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<RegisterPage />} />
      {/* <Route path="profile/" element={<User />} />
      <Route path="user/:userID" element={<User />} /> */}
      <Route path="problem/:problemID" element={<SolveProblem />} />
      {/* <Route path="problem/" element={<User />} />  CHECK WHAT HAPPENS WITH psotman call*/}
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>

  // {/* </StrictMode> */}
);
