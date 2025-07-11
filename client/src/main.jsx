import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import ProtectedRoutes from "./Guards/ProtectedRoutes.jsx";
import App from "./App.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SolveProblemPage from "./Pages/SolveProblemPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import ProblemPage from "./Pages/ProblemPage.jsx";
import CompilerPage from "./Pages/CompilerPage.jsx";
import AddProblem from "./Pages/AddProblem.jsx";
import ViewProblemPage from "./Pages/ViewProblemPage.jsx";
import ScrollToTop from "./Utils/scrollToTop.jsx";
import BookmarkedProblems from "./Pages/BookmarkedProblems.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ScrollToTop />}>
        <Route element={<ProtectedRoutes />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="problems/:problemID" element={<SolveProblemPage />} />
          <Route path="compiler" element={<CompilerPage />} />
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="problems" element={<ProblemPage />} />
            <Route path=":userID/addproblem" element={<AddProblem />} />
            <Route
              path=":userID/:problemID/view"
              element={<ViewProblemPage />}
            />
            <Route path=":userID" element={<ProfilePage />} />
            <Route path="bookmarks" element={<BookmarkedProblems />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  // {/* </StrictMode> */}
);
