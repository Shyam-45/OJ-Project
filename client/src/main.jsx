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
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoutes from "./guards/ProtectedRoutes.jsx";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SolveProblemPage from "./pages/SolveProblemPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import CompilerPage from "./pages/CompilerPage.jsx";
import AddProblem from "./pages/AddProblem.jsx";
import ViewProblemPage from "./pages/ViewProblemPage.jsx";
import ScrollToTop from "./utils/scrollToTop.jsx";
import BookmarkedProblems from "./pages/BookmarkedProblems.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ScrollToTop />}>
        <Route element={<ProtectedRoutes />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="problems/:problemID" element={<SolveProblemPage />} />
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
            <Route path="compiler" element={<CompilerPage />} />
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
