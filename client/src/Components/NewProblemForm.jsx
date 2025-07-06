import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { sendNewProblem } from "../Services/problem";

export default function NewProblemForm() {
  const { userID } = useParams();

  const initialInput = {
    title: "",
    description: "",
    tags: "easy",
    inputInfo: "",
    outputInfo: "",
  };
  const initialSampleIO = { input: "", output: "" };
  const initialSampleFile = { sampleInputFile: null, sampleOutputFile: null };
  const initialFiles = { inputFile: null, outputFile: null };

  const [inputValue, setInputValue] = useState(initialInput);
  const [sampleIO, setSampleIO] = useState(initialSampleIO);
  const [sampleFile, setSampleFile] = useState(initialSampleFile);
  const [files, setFiles] = useState(initialFiles);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status.text) {
      const t = setTimeout(() => setStatus({ type: "", text: "" }), 5000);
      return () => clearTimeout(t);
    }
  }, [status.text]);

  const refSampleIn = useRef();
  const refSampleOut = useRef();
  const refTestIn = useRef();
  const refTestOut = useRef();

  const handleInputValChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };
  const handleSampleIOChange = (e) => {
    const { name, value } = e.target;
    setSampleIO((prev) => ({ ...prev, [name]: value }));
  };
  const handleSampleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setSampleFile((prev) => ({ ...prev, [e.target.name]: f }));
  };
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFiles((prev) => ({ ...prev, [e.target.name]: f }));
  };

  const resetForm = () => {
    setInputValue(initialInput);
    setSampleIO(initialSampleIO);
    setSampleFile(initialSampleFile);
    setFiles(initialFiles);
    [refSampleIn, refSampleOut, refTestIn, refTestOut].forEach((r) => {
      if (r.current) r.current.value = "";
    });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    try {
      const data = new FormData();
      Object.entries(inputValue).forEach(([k, v]) => data.append(k, v));
      data.append("createdBy", userID);
      data.append("sampleInputOutput", JSON.stringify(sampleIO));
      if (sampleFile.sampleInputFile)
        data.append("sampleInputFile", sampleFile.sampleInputFile);
      if (sampleFile.sampleOutputFile)
        data.append("sampleOutputFile", sampleFile.sampleOutputFile);
      if (files.inputFile) data.append("inputFile", files.inputFile);
      if (files.outputFile) data.append("outputFile", files.outputFile);

      const res = await sendNewProblem(data);
      if (res.success) {
        setStatus({ type: "success", text: "✅ Problem added successfully!" });
        resetForm();
      } else {
        setStatus({ type: "error", text: "❌ Failed to add problem." });
      }
    } catch {
      setStatus({ type: "error", text: "❌ Failed to add problem." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-indigo-600 dark:border-indigo-400 rounded px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Coding Problem
          </h1>
        </div>

        {status.text && (
          <div
            className={`p-4 rounded ${
              status.type === "success"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-gray-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-gray-200"
            }`}
          >
            {status.text}
          </div>
        )}

        <form
          onSubmit={handleSubmission}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:w-2/3 p-6 space-y-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Problem Detail
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={inputValue.title}
                  onChange={handleInputValChange}
                  required
                  placeholder="Enter problem title"
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={inputValue.description}
                  onChange={handleInputValChange}
                  required
                  placeholder="Describe the problem"
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Input Format <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="inputInfo"
                    rows={3}
                    value={inputValue.inputInfo}
                    onChange={handleInputValChange}
                    required
                    placeholder="Describe input format"
                    className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Output Format <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="outputInfo"
                    rows={3}
                    value={inputValue.outputInfo}
                    onChange={handleInputValChange}
                    required
                    placeholder="Describe output format"
                    className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sample Input <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="input"
                    rows={3}
                    value={sampleIO.input}
                    onChange={handleSampleIOChange}
                    required
                    placeholder="Enter sample input"
                    className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sample Output <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="output"
                    rows={3}
                    value={sampleIO.output}
                    onChange={handleSampleIOChange}
                    required
                    placeholder="Enter sample output"
                    className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="tags"
                  value={inputValue.tags}
                  onChange={handleInputValChange}
                  required
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Create Problem
              </button>
            </div>

            <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Test Case Files
              </h2>
              {[
                {
                  label: "Sample Input File",
                  name: "sampleInputFile",
                  ref: refSampleIn,
                  fileName: sampleFile.sampleInputFile?.name,
                },
                {
                  label: "Sample Output File",
                  name: "sampleOutputFile",
                  ref: refSampleOut,
                  fileName: sampleFile.sampleOutputFile?.name,
                },
                {
                  label: "Test Input File",
                  name: "inputFile",
                  ref: refTestIn,
                  fileName: files.inputFile?.name,
                  note: "First line: number of test cases; following lines: each test.",
                },
                {
                  label: "Test Output File",
                  name: "outputFile",
                  ref: refTestOut,
                  fileName: files.outputFile?.name,
                },
              ].map(({ label, name, ref, fileName, note }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition">
                    <input
                      ref={ref}
                      type="file"
                      name={name}
                      accept=".txt"
                      onChange={
                        name.startsWith("sample")
                          ? handleSampleFileChange
                          : handleFileChange
                      }
                      className="hidden"
                      required
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fileName || "Click to upload"}
                    </p>
                  </label>
                  {note && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
