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
import LoginPage from "./Pages/LoginPage.jsx";
import SolveProblemPage from "./Pages/SolveProblemPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import ProblemPage from "./Pages/ProblemPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ProtectedRoutes />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="problem/:problemID" element={<SolveProblemPage />} />
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
                    <Route path="problem" element={<ProblemPage />} />
          <Route path="user/:userID" element={<ProfilePage />} />
        </Route>
      </Route>
    </>
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
