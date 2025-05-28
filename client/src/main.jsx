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
import ProtectedRoutes from "./Guards/ProtectedRoutes.jsx";
import App from "./App.jsx";
import Home from "./Components/Home.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import RegisterPage from "./Components/RegisterPage.jsx";
import Profile from "./Components/Profile.jsx";
import SolveProblem from "./Components/SolveProblem.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    // **All** routes are children of ProtectedRoutes
    <Route element={<ProtectedRoutes />}>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        {/* these will still render when NOT signed-in because your guard whitelists them */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<RegisterPage />} />

        {/* everything else is fully protected */}
        {/* <Route index element={<Home />} /> */}
        <Route path="home" element={<Home />} />
        <Route path="user/:userID" element={<Profile />} />
        <Route path="problem/:problemID" element={<SolveProblem />} />
      </Route>
    </Route>
  )
);

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//     <Route element={ProtectedRoutes />}>
//           <Route path="/" element={<App />}>
//                 <Route path="login" element={<LoginPage />} />
//       <Route path="signup" element={<RegisterPage />} />
//       <Route path="home" element={<Home />} />
//             <Route path="user/:userID" element={<Profile />} />
//       <Route path="problem/:problemID" element={<SolveProblem />} />
//           </Route>
//     </Route>
//     </>

// //  <><Route path="login" element={<LoginPage />} />
// // // Public Routes

// //     <Route path="/" element={<App />}>
// //       {/* <Route path="" element={<Home />} /> */}
// //       <Route path="home" element={<Home />} />
// //       <Route path="login" element={<LoginPage />} />
// //       <Route path="signup" element={<RegisterPage />} />
// //       <Route path="user/:userID" element={<Profile />} />
// //       <Route path="problem/:problemID" element={<SolveProblem />} />
// //       {/* <Route path="problem/" element={<User />} />  CHECK WHAT HAPPENS WITH postman call*/}
// //     </Route>
// //     </>
//   )
// );

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>

  // {/* </StrictMode> */}
);
