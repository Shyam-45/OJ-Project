import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { registerAuth } from "../services/user";
import { useNavigate } from "react-router-dom";

export default function SingupForm() {
  const navigate = useNavigate();
  console.log("Register page component");
  const { setIsSigned, setUserId } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState({
    name: "",
    userID: "",
    email: "",
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

  useEffect(() => {
    async function errorCheck() {
      if (!error) return;
      setTimeout(() => setError(""), 4000);
    }
    errorCheck();
  }, [error]);

  const handleShowPass = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmission = async (event) => {
    event.preventDefault();

    try {
      if (
        !(
          inputValue.name &&
          inputValue.userID &&
          inputValue.email &&
          inputValue.password
        )
      ) {
        setError("Please enter user crdentials");
        return;
      }

      const response = await registerAuth(inputValue);
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
      console.log(err);
      setError("Registration attempt failed");
    } finally {
      setInputValue({
        ...inputValue,
        name: "",
        userID: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-gray-700">
      {error && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 bg-red-50 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg shadow-lg text-nowrap"
          role="alert"
        >
          <span className="font-medium">{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-xl hover:text-red-600 dark:hover:text-red-200"
          >
            ❌
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmission}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6 dark:bg-gray-900"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          Create Your Account
        </h2>

        <div>
          <label
            htmlFor="userName"
            className="block text-lg font-medium text-gray-700 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="userName"
            name="name"
            placeholder="John Doe"
            value={inputValue.name}
            onChange={handleInputValChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 "
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@gmail.com"
            value={inputValue.email}
            onChange={handleInputValChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label
            htmlFor="userID"
            className="block text-lg font-medium text-gray-700 dark:text-white"
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
            className="mt-1 block w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700 dark:text-white"
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
            className="mt-1 block w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
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
            className="ml-2 block text-base text-gray-600 dark:text-white"
          >
            Show Password
          </label>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 text-xl border border-transparent rounded-full shadow-sm text-white bg-green-600 dark:text-white hover:bg-green-700 "
        >
          Register
        </button>
        <div className="flex justify-center">
          <p className="px-2 text-lg text-nowrap dark:text-white">
            Already have an account
          </p>
          <button
            type="button"
            className="px-2 bg-purple-400 font-medium rounded-md text-lg text-white"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
