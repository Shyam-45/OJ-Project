import { useState, useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { loginAuth } from "../Services/auth";

export default function LoginPage() {
  const { setIsSigned } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
    console.log(inputValue);
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
    try {
      const response = await loginAuth(inputValue);
      if (response.success) {
        setIsSigned(true);
      }
    } catch (err) {
      console.log(`Error sending data to loginAPI, ${err.message}`);
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
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
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

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}
