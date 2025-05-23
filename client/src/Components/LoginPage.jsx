import { useState, useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { loginAuth } from "../Services/auth";

export default function LoginPage() {
  const {setIsSigned} = useContext(AuthContext);

  const [inputValue, setInputValue] = useState({
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
    console.log(inputValue);
    setInputValue({
      ...inputValue,
      email: "",
      password: ""
    })
    try {    
        const response = await loginAuth(inputValue);
        if(response.success) {
          setIsSigned(true);
        }
    } catch (err) {
        console.log(`Error sending data to loginAPI, ${err.message}`);
    }

  };

  return (
    <div>
      <form onSubmit={handleSubmission}>
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
        <button>Login</button>
      </form>
    </div>
  );
}
