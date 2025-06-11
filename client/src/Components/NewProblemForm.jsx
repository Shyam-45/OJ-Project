import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { sendNewProblem } from "../services/problem";

export default function NewProblemForm() {
  console.log("Profile component");
  const { userID } = useParams();
  const [userInfo, setUserInfo] = useState({
    name: "",
    userID: "",
    email: "",
  });
  console.log(userID);

  useEffect(() => {
    async function userInfoFunc() {
      const res = await getUserInfo(userID);
      console.log(res);
      if (res.success) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          name: res.name,
          userID: res.userID,
          email: res.email,
        }));
      }
      return;
    }
    userInfoFunc();
  }, []);

  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    tags: "easy",
    inputInfo: "",
    outputInfo: "",
  });

  const [sampleInputOutputValue, setSmapleInputOutputValue] = useState({
    input: "",
    output: "",
  });

  const [sampleFile, setSampleFile] = useState({
    sampleInputFile: "",
    sampleOutputFile: "",
  });

  const [file, setFile] = useState({
    inputFile: "",
    outputFile: "",
  });

  const handleInputValChange = (event) => {
    const { name, value } = event.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSampleInputValChange = (event) => {
    const { name, value } = event.target;
    setSmapleInputOutputValue({
      ...sampleInputOutputValue,
      [name]: value,
    });
  };

  const handleSampleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setSampleFile((prevSampleFile) => ({
      ...prevSampleFile,
      [event.target.name]: selectedFile,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile((prevFile) => ({
      ...prevFile,
      [event.target.name]: selectedFile,
    }));
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    console.log(inputValue);
    console.log(sampleInputOutputValue);
    console.log(sampleFile);
    console.log(file);
    try {
      const data = new FormData();
      Object.entries(inputValue).forEach(([key, val]) => {
        data.append(key, val);
      });
      data.append("createdBy", userID);
      data.append("sampleInputOutput", JSON.stringify(sampleInputOutputValue));

      if (sampleFile.sampleInputFile) {
        data.append(
          "sampleInputFile",
          sampleFile.sampleInputFile,
          sampleFile.sampleInputFile.name
        );
      }
      if (sampleFile.sampleOutputFile) {
        data.append(
          "sampleOutputFile",
          sampleFile.sampleOutputFile,
          sampleFile.sampleOutputFile.name
        );
      }
      if (file.inputFile) {
        data.append("inputFile", file.inputFile, file.inputFile.name);
      }
      if (file.outputFile) {
        data.append("outputFile", file.outputFile, file.outputFile.name);
      }

      console.log("New Problem data to be send to api");
      const response = await sendNewProblem(data);
      // const response = await loginAuth(inputValue);
      // if (response.success) {
      //   setIsSigned(true);
      //   console.log("setting userid");
      //   setUserId(inputValue.userID);
      // }
    } catch (err) {
      console.log("Issue encountered while interacting with createProblem api");
    }
  };

  return (
    <>
      <p>{userInfo.name}</p>
      <p>{userInfo.email}</p>
      <p>{userInfo.userID}</p>
      <div className="p-6 space-y-4 max-w-3xl mx-auto bg-white mt-8 rounded shadow">
        <div className="space-y-2">
          <span className="block font-medium text-gray-700">
            Upload sample input txt file:
          </span>
          <input
            type="file"
            name="sampleInputFile"
            accept=".txt"
            onChange={handleSampleFileChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <span className="block font-medium text-gray-700">
            Upload sample output txt file:
          </span>
          <input
            type="file"
            name="sampleOutputFile"
            accept=".txt"
            onChange={handleSampleFileChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <span className="block font-medium text-gray-700">
            Upload input file:
          </span>
          <input
            type="file"
            name="inputFile"
            accept=".txt"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500">
            The first line of the input file should be the number of test cases.
            The following lines contain each test case’s input.
          </p>
        </div>
        <div className="space-y-2">
          <span className="block font-medium text-gray-700">
            Upload output file:
          </span>
          <input
            type="file"
            name="outputFile"
            accept=".txt"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleSubmission}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Create a problem
          </h2>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <textarea
              id="title"
              name="title"
              placeholder="Sum of numbers"
              value={inputValue.title}
              onChange={handleInputValChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={inputValue.description}
              onChange={handleInputValChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="inputInfo"
              className="block text-sm font-medium text-gray-700"
            >
              Input Information
            </label>
            <textarea
              id="inputInfo"
              name="inputInfo"
              value={inputValue.inputInfo}
              onChange={handleInputValChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="outputInfo"
              className="block text-sm font-medium text-gray-700"
            >
              Output Information
            </label>
            <textarea
              id="outputInfo"
              name="outputInfo"
              value={inputValue.outputInfo}
              onChange={handleInputValChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="input"
              className="block text-sm font-medium text-gray-700"
            >
              Sample Input
            </label>
            <textarea
              id="input"
              name="input"
              value={sampleInputOutputValue.input}
              onChange={handleSampleInputValChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="output"
              className="block text-sm font-medium text-gray-700"
            >
              Sample Output
            </label>
            <textarea
              id="output"
              name="output"
              value={sampleInputOutputValue.output}
              onChange={handleSampleInputValChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSubmission}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
