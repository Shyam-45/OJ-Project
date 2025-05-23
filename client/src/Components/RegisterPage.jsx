import { useState, useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { registerAuth } from "../Services/auth";

export default function RegisterPage() {
  const { setIsSigned } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState({
    name: "",
    userID: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputValChange = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;

    setInputValue({
      ...inputValue,
      [fieldName]: fieldValue,
    });
  };

  const handleShowPass = (event) => {
    setShowPassword(event.target.checked);
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    setInputValue({
      ...inputValue,
      name: "",
      userID: "",
      email: "",
      password: "",
    });
    try {
      const response = await registerAuth(inputValue);
      if (response.success) {
        setIsSigned(true);
      }
    } catch (err) {
      console.log(`Error sending data to register API, ${err.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmission}>
        <label htmlFor="userName">Name: </label>
        &nbsp;
        <input
          placeholder="John Doe"
          value={inputValue.userName}
          onChange={handleInputValChange}
          id="userName"
          name="name"
          required
        ></input>
        <br></br> <br></br>
        <label htmlFor="userID">User ID: </label>
        &nbsp;
        <input
          placeholder="john_doe"
          value={inputValue.userID}
          onChange={handleInputValChange}
          id="userID"
          name="userID"
          required
        ></input>
        <br></br> <br></br>
        <label htmlFor="email">Email: </label>
        &nbsp;
        <input
          placeholder="johndoe@gmail.com"
          value={inputValue.email}
          onChange={handleInputValChange}
          id="email"
          name="email"
          required
        ></input>
        <br></br> <br></br>
        <label htmlFor="password">Password: </label>
        &nbsp;
        <input
          value={inputValue.password}
          onChange={handleInputValChange}
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
        ></input>
        <br></br>
        <input type="checkbox" id="showPass" onClick={handleShowPass}></input>
        &nbsp;
        <label htmlFor="showPass">Show Password</label>
        <br></br> <br></br>
        <button>Register</button>
      </form>
    </div>
  );
}
