import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { loginAuth } from "../Services/auth";

export default function LoginPage() {
  console.log("Login Pge component");
  const navigate = useNavigate();
  const { setIsSigned, setUserId } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState({
    userID: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputValChange = (event) => {
    const { name, value } = event.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleShowPass = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    // console.log(inputValue);
    try {
      // Validate user input
      if (!(inputValue.userID && inputValue.password)) {
        setError("Please enter user crdentials");
        return;
      }
      // As we have set required in forms it might be unnecesaary but just might be a case

      const response = await loginAuth(inputValue);
      if (response.success) {
        setIsSigned(true);
        setUserId(response.user_id);
        setError("");
        return;
      }
      setIsSigned(false);
      setUserId("");
      setError(response.error);
    } catch (err) {
      // Error sending data to loginAPI
      console.log(`${err.message}`);
      setError("Login attempt failed");
    } finally {
      setInputValue({
        ...inputValue,
        userID: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmission}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login to Your Account
        </h2>

        <div>
          <label
            htmlFor="userID"
            className="block text-sm font-medium text-gray-700"
          >
            User ID
          </label>
          <input
            type="text"
            id="userID"
            name="userID"
            placeholder="john_doe"
            value={inputValue.userID}
            onChange={handleInputValChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={inputValue.password}
            onChange={handleInputValChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPass"
            checked={showPassword}
            onChange={handleShowPass}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="showPass"
            className="ml-2 block text-sm text-gray-600"
          >
            Show Password
          </label>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 font-semibold">❌ {error}</p>
        )}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Login
        </button>
        <div className="flex justify-center">
          <p className="px-2">Sign up for a new account</p>
          <button
            type="button"
            className="px-2 bg-purple-400 font-medium rounded-md text-sm text-white"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
