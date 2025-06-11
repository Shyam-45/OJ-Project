// import { useState, useEffect, useRef } from 'react';
// // import * as echarts from 'echarts';
// import * as monaco from 'monaco-editor';

// export default function SolveProblem() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState('python');
//   const [showCustomInput, setShowCustomInput] = useState(true);
//   const [customInput, setCustomInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [showResults, setShowResults] = useState(false);
//   const [code, setCode] = useState('# Write your code here\n\ndef solution():\n    # Your solution here\n    pass\n\nif __name__ == "__main__":\n    solution()');
//   const [showAIReview, setShowAIReview] = useState(false);
//   const [expandedTestCase, setExpandedTestCase] = useState<number | null>(null);

//   const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
//   const editorContainerRef = useRef<HTMLDivElement>(null);

//   const sampleProblem = {
//     title: "Two Sum",
//     description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
//     inputFormat: "First line contains an integer n, the size of the array.\nSecond line contains n space-separated integers representing the array elements.\nThird line contains a single integer target.",
//     outputFormat: "Two space-separated integers representing the indices of the two numbers such that they add up to target.",
//     sampleInput: "4\n2 7 11 15\n9",
//     sampleOutput: "0 1",
//     constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
//     memoryLimit: "256 MB",
//     timeLimit: "1 second"
//   };

//   const testResults = {
//     passed: 3,
//     failed: 1,
//     totalTests: 4,
//     testCases: [
//       { id: 1, input: "4\n2 7 11 15\n9", expectedOutput: "0 1", actualOutput: "0 1", status: "passed" },
//       { id: 2, input: "3\n3 2 4\n6", expectedOutput: "1 2", actualOutput: "1 2", status: "passed" },
//       { id: 3, input: "2\n3 3\n6", expectedOutput: "0 1", actualOutput: "0 1", status: "passed" },
//       { id: 4, input: "5\n1 3 5 7 9\n10", expectedOutput: "1 3", actualOutput: "0 4", status: "failed" }
//     ],
//     error: null
//   };

//   useEffect(() => {
//     if (editorContainerRef.current && !editorRef.current) {
//       editorRef.current = monaco.editor.create(editorContainerRef.current, {
//         value: code,
//         language: selectedLanguage,
//         theme: darkMode ? 'vs-dark' : 'vs',
//         automaticLayout: true,
//         minimap: { enabled: false },
//         scrollBeyondLastLine: false,
//         lineNumbers: 'on',
//         fontSize: 14,
//         fontFamily: 'Consolas, "Courier New", monospace',
//       });

//       editorRef.current.onDidChangeModelContent(() => {
//         if (editorRef.current) {
//           setCode(editorRef.current.getValue());
//         }
//       });
//     }

//     return () => {
//       editorRef.current?.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     if (editorRef.current) {
//       monaco.editor.setTheme(darkMode ? 'vs-dark' : 'vs');
//     }
//   }, [darkMode]);

//   useEffect(() => {
//     if (editorRef.current) {
//       monaco.editor.setModelLanguage(editorRef.current?.getModel(), selectedLanguage);
//     }
//   }, [selectedLanguage]);

//   const handleRun = () => {
//     // Simulate running code
//     setOutput("Running code...\nExecution complete!");
//     setShowResults(false);
//     setShowAIReview(false);
//   };

//   const handleSubmit = () => {
//     // Simulate submitting code
//     setOutput(`Submitting solution...\nSubmission complete!\nPassed: ${testResults.passed}/${testResults.totalTests} test cases`);
//     setShowResults(true);
//     setShowAIReview(false);
//   };

//   const handleAIReview = () => {
//     // Simulate AI review
//     setShowAIReview(true);
//   };

//   const handleCancelAIReview = () => {
//     setShowAIReview(false);
//   };

//   const handleCustomRun = () => {
//     // Simulate running with custom input
//     setOutput(`Running with custom input:\n${customInput}\n\nOutput:\n0 1`);
//     setShowAIReview(false);
//   };

//   const handleBackToProblem = () => {
//     setShowResults(false);
//   };

//   const toggleTestCase = (id) => {
//     if (expandedTestCase === id) {
//       setExpandedTestCase(null);
//     } else {
//       setExpandedTestCase(id);
//     }
//   };

//   const languages = [
//     { value: 'c', label: 'C' },
//     { value: 'cpp', label: 'C++' },
//     { value: 'python', label: 'Python' },
//     { value: 'java', label: 'Java' },
//     { value: 'javascript', label: 'JavaScript' }
//   ];

import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
// import * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";
import { AuthContext } from "../contexts/AuthContext";
import { getProblemInfo } from "../services/problem";
import {
  cSample,
  pySample,
  javaSample,
  jsSample,
  cppSample,
} from "../utils/sampleCode";

export default function SolveProblem() {
  const { problemID } = useParams();
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    tags: "",
    inputInfo: "",
    outputInfo: "",
    sampleInputOutput: [],
  });
  const [problemErr, setProblemErr] = useState("");
  const { darkMode } = useContext(AuthContext);
  // const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(cppSample);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);
  const [expandedTestCase, setExpandedTestCase] = useState(null);
  const [disableRun, setDisableRun] = useState(false);

  // const editorRef = useRef(null);
  // const editorContainerRef = useRef(null);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await getProblemInfo(problemID);
        if (!response.success) {
          setProblemErr(response.error);
          setProblem("");
          return;
        }
        setProblem(response.problemInfo);
        setProblemErr("");
      } catch (err) {
        setProblemErr("An error occurred");
        setProblem("");
      }
    }
    fetchProblem();
  }, [problemID]);

  const testResults = {
    passed: 3,
    failed: 1,
    totalTests: 4,
    testCases: [
      {
        id: 1,
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
        actualOutput: "0 1",
        status: "passed",
      },
      {
        id: 2,
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
        actualOutput: "1 2",
        status: "passed",
      },
      {
        id: 3,
        input: "2\n3 3\n6",
        expectedOutput: "0 1",
        actualOutput: "0 1",
        status: "passed",
      },
      {
        id: 4,
        input: "5\n1 3 5 7 9\n10",
        expectedOutput: "1 3",
        actualOutput: "0 4",
        status: "failed",
      },
    ],
    error: null,
  };

  // const languageMap = {
  //   c: "c",
  //   cpp: "clike",
  //   js: "javascript",
  //   java: "java",
  //   py: "python",
  // };

  const sampleCodeMap = {
    c: cSample,
    cpp: cppSample,
    py: pySample,
    js: jsSample,
    java: javaSample,
  };

  const selectLanguage = (event) => {
    const selected = event.target.value;
    if (!selected) return;
    setLanguage(selected);
    setCode(sampleCodeMap[selected]);
    // setAiReview(false);
    // setOutputMessage("");
    // setOutputErr("");
    // setVerdict("");
  };

  // const handleRun = () => {
  //   setOutput("Running code...\nDone.");
  //   setShowResults(false);
  //   setShowAIReview(false);
  // };

  const handleRun = async () => {
    const payload = { language, code };
    console.log(payload);
    setDisableRun(true);
    if (code.trim() === "") {
      setOutput("Please enter the code");
      console.log("please enter the code");
      return;
    }
    return;
    // setDisableRun(true);
    // if (code.trim() === "") {
    //   setOutputErr("Please enter the code");
    // }
    // try {
    //   const response = await getOutput(problemID, payload);
    //   if (!response.success) {
    //     setOutputErr(response.error);
    //     return;
    //   }
    //   const { count, total } = response;
    //   let message = `All sample test cases passed`;
    //   if (count != total) {
    //     message = `${count} out of ${total} sample test case passed`;
    //   }
    //   setOutputMessage(message);
    //   setOutputErr("");
    // } catch (error) {
    //   console.log("Problem in receiving req from run {language, code}");
    //   setOutputErr("Something went wrong");
    //   return;
    // } finally {
    //   setAiReview(false);
    //   setVerdict("");
    //   setCustomOutput("");
    //   setDisableRun(false);
    // }
  };

  const handleSubmit = () => {
    setOutput(
      `Submitting...\nPassed: ${testResults.passed}/${testResults.totalTests}`
    );
    setShowResults(true);
    setShowAIReview(false);
  };

  const handleAIReview = () => setShowAIReview(true);
  const handleCancelAIReview = () => setShowAIReview(false);

  const handleCustomRun = () => {
    setOutput(`Input:\n${customInput}\nOutput:\n0 1`);
    setShowAIReview(false);
  };

  const handleBackToProblem = () => setShowResults(false);

  const toggleTestCase = (id) =>
    setExpandedTestCase(expandedTestCase === id ? null : id);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-4">
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
          {/* Left panel - Problem details or Results */}
          <div className="w-full lg:w-2/5 lg:overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6">
            {!showResults ? (
              // Problem details view
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{problem.title}</h2>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {problem.tags}
                    </span>
                  </div>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      /* Handle bookmark */
                    }}
                  >
                    <i className="far fa-bookmark text-xl hover:text-blue-600 dark:hover:text-blue-400"></i>
                  </button>
                </div>
                <div className="mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="mb-4 p-3 rounded bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
                      {problem.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Input Format</h3>
                    <pre className="p-3 rounded bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
                      {problem.inputInfo}
                    </pre>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Output Format
                    </h3>
                    <pre className="p-3 rounded bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
                      {problem.outputInfo}
                    </pre>
                  </div>
                  {problem.sampleInputOutput.map((item) => (
                    <div
                      key={item.sioID}
                      className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Sample Input
                        </h3>
                        <pre className="p-3 rounded bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
                          {item.input}
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Sample Output
                        </h3>
                        <pre className="p-3 rounded bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
                          {item.output}
                        </pre>
                      </div>
                    </div>
                  ))}
                  {/* <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Constraints</h3>
                    <pre className="p-3 rounded bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
                      {problem.constraints}
                    </pre>
                  </div> */}

                  <div className="flex flex-col rounded px-2 mt-4 bg-gray-100 dark:bg-gray-700">
                    <span className="font-medium text-base pt-2 dark:text-gray-300">
                      More Info
                    </span>
                    <span className="text-base font-semibold pt-1">
                      Time limit: 1 sec
                    </span>
                    <span className="text-base font-semibold pt-1">
                      Memory limit: 1.5 GB
                    </span>
                    <span className="text-base font-semibold py-1">
                      Source Limit: 50 KB
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Results view
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Test Results</h2>
                  <button
                    onClick={handleBackToProblem}
                    className="px-3 py-1 !rounded-button bg-gray-600 text-white hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Back to Problem
                  </button>
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          testResults.passed === testResults.totalTests
                            ? "bg-green-500"
                            : "bg-red-500"
                        } mr-2`}
                      ></div>
                      <span className="font-semibold">
                        {testResults.passed} / {testResults.totalTests} test
                        cases passed
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Passed: {testResults.passed}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Failed: {testResults.failed}
                      </span>
                    </div>
                  </div>

                  {testResults.testCases.map((testCase) => (
                    <div
                      key={testCase.id}
                      className={`mb-4 rounded-lg border ${
                        testCase.status === "passed"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-red-500 bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <div
                        className="flex justify-between p-4 cursor-pointer"
                        onClick={() => toggleTestCase(testCase.id)}
                      >
                        <h3 className="font-semibold">
                          Test Case #{testCase.id}
                        </h3>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                              testCase.status === "passed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {testCase.status.toUpperCase()}
                          </span>
                          <i
                            className={`fas ${
                              expandedTestCase === testCase.id
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            }`}
                          ></i>
                        </div>
                      </div>

                      {expandedTestCase === testCase.id && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-0">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Input</h4>
                            <pre className="p-2 rounded text-xs bg-gray-100 dark:bg-gray-700whitespace-pre-wrap">
                              {testCase.input}
                            </pre>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Expected
                            </h4>
                            <pre className="p-2 rounded text-xs bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
                              {testCase.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Your Output
                            </h4>
                            <pre
                              className={`p-2 rounded text-xs ${
                                testCase.status === "passed"
                                  ? "bg-green-100 dark:bg-green-900/30"
                                  : "bg-red-100 dark:bg-red-900/30"
                              } whitespace-pre-wrap`}
                            >
                              {testCase.actualOutput}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {testResults.error && (
                    <div className="mt-6 p-4 rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Error
                      </h3>
                      <pre className="p-3 rounded bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 text-sm whitespace-pre-wrap">
                        {testResults.error}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right panel - Code editor and compiler */}
          <div className="w-full lg:w-3/5 lg:overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col">
            {/* Language selector and action buttons */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="relative px-4 py-1 whitespace-nowrap">
                  <select
                    name="language"
                    value={language}
                    onChange={selectLanguage}
                    className="mb-4 px-2 h-8 text-base border-2 border-gray-300 rounded-full dark:bg-gray-400"
                  >
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="py">Python</option>
                    <option value="js">Javascript</option>
                    <option value="java">Java</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleRun}
                    className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="fas fa-play mr-2"></i> Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="fas fa-check mr-2"></i> Submit
                  </button>
                  <button
                    onClick={handleAIReview}
                    className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="fas fa-robot mr-2"></i> AI Review
                  </button>
                  <button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className={`px-4 py-2 rounded-full ${
                      showCustomInput
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-gray-600 hover:bg-gray-700"
                    } text-white transition-colors cursor-pointer whitespace-nowrap`}
                  >
                    <i
                      className={`fas ${
                        showCustomInput ? "fa-chevron-up" : "fa-chevron-down"
                      } mr-2`}
                    ></i>{" "}
                    Custom Input
                  </button>
                </div>
              </div>
            </div>
            {/* Code editor */}
            <Editor
              height="400px"
              className="flex-shrink-0"
              // className="flex-grow"
              language={language}
              value={code}
              theme={darkMode ? "vs-dark" : "vs-light"}
              onChange={(code) => setCode(code)}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                fontSize: 20,
              }}
            />
            {/* Custom input section (collapsible) */}
            {showCustomInput && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2">
                    Custom Input
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className={`w-full h-24 p-3 rounded font-mono text-sm resize-none ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    } border`}
                    placeholder="Enter your test input here..."
                  ></textarea>
                </div>
                <button
                  onClick={handleCustomRun}
                  className="px-4 py-2 !rounded-button bg-yellow-600 text-white hover:bg-yellow-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="fas fa-play-circle mr-2"></i> Run with Custom
                  Input
                </button>
              </div>
            )}
            {/* Output section */}
            <div
              className={`border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } p-4`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Output</h3>
                {showAIReview && (
                  <button
                    onClick={handleCancelAIReview}
                    className="px-2 py-1 !rounded-button bg-gray-500 text-white hover:bg-gray-600 text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="fas fa-times mr-1"></i> Close AI Review
                  </button>
                )}
              </div>

              {showAIReview ? (
                <div
                  className={`w-full h-32 p-3 rounded font-mono text-sm overflow-auto ${
                    darkMode
                      ? "bg-purple-900/20 text-purple-100 border border-purple-700"
                      : "bg-purple-50 text-purple-900 border border-purple-200"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <i className="fas fa-robot text-purple-500 mr-2"></i>
                    <span className="font-semibold">AI Code Review</span>
                  </div>
                  <div className="pl-6">
                    <p className="mb-1">
                      • Consider using a hash map for O(n) time complexity
                    </p>
                    <p className="mb-1">
                      • Add input validation to handle edge cases
                    </p>
                    <p className="mb-1">
                      • Your solution is correct but could be optimized
                    </p>
                    <p className="mb-1">
                      • The approach for test case #4 needs revision
                    </p>
                  </div>
                </div>
              ) : (
                <pre
                  className={`w-full h-32 p-3 rounded font-mono text-sm overflow-auto ${
                    darkMode
                      ? "bg-gray-700 text-gray-100"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  {output || "Run your code to see output here..."}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Editor from "react-simple-code-editor";
// import Prism, { highlight } from "prismjs";
// import "prismjs/components/prism-c";
// import "prismjs/components/prism-clike";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-java";
// import "prismjs/components/prism-python";
// import "prismjs/themes/prism.css";
// import {
//   cSample,
//   pySample,
//   javaSample,
//   jsSample,
//   cppSample,
// } from "../utils/sampleCode.js";
// import {
//   getProblemInfo,
//   getOutput,
//   getVerdict,
//   getCustomOutput,
// } from "../services/problem.js";

// export default function SolveProblem() {
//   const { problemID } = useParams();
//   const [problem, setProblem] = useState({
//     title: "",
//     description: "",
//     tags: "",
//     inputInfo: "",
//     outputInfo: "",
//     sampleInputOutput: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [language, setLanguage] = useState("cpp");
//   const [code, setCode] = useState(cppSample);
//   const [outputMessage, setOutputMessage] = useState("");
//   const [customInput, setCustomInput] = useState("");
//   const [verdict, setVerdict] = useState("");
//   const [customOutput, setCustomOutput] = useState("Output will appear here.");
//   const [problemErr, setProblemErr] = useState("");
//   const [outputErr, setOutputErr] = useState("");
//   const [aiReview, setAiReview] = useState(false);
//   const [disableRun, setDisableRun] = useState(false);
//   const [disableSubmit, setDisableSubmit] = useState(false);
//   const [disableCustomRun, setDisableCustomRun] = useState(false);

//   useEffect(() => {
//     async function fetchProblem() {
//       try {
//         const response = await getProblemInfo(problemID);
//         if (!response.success) {
//           setProblemErr(response.error);
//           setProblem("");
//           return;
//         }
//         setProblem(response.problemInfo);
//         setProblemErr("");
//       } catch (err) {
//         // console.log("Error while getting problem info from api");
//         setProblemErr("An error occurred");
//         setProblem("");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProblem();
//   }, [problemID]);

//   const languageMap = {
//     c: "c",
//     cpp: "clike",
//     js: "javascript",
//     java: "java",
//     py: "python",
//   };

//   const sampleCodeMap = {
//     c: cSample,
//     cpp: cppSample,
//     py: pySample,
//     js: jsSample,
//     java: javaSample,
//   };

//   const highlightCode = (code) =>
//     highlight(
//       code,
//       Prism.languages[languageMap[language]],
//       languageMap[language]
//     );

//   const selectLanguage = (event) => {
//     const selected = event.target.value;
//     if (!selected) return;
//     setLanguage(selected);
//     setCode(sampleCodeMap[selected]);
//     setAiReview(false);
//     setOutputMessage("");
//     setOutputErr("");
//     setVerdict("");
//   };

//   const handleCustomInput = (event) => {
//     setCustomInput(event.target.value);
//   };

//   const handleCustomRun = async () => {
//     const inputValue = customInput || " ";
//     const payload = { language, code, inputValue };
//     setDisableCustomRun(true);
//     if (code.trim() === "") {
//       setOutputErr("Please enter the code");
//     }
//     try {
//       const response = await getCustomOutput(payload);
//       if (!response.success) {
//         setOutputErr(response.error);
//         return;
//       }
//       if (response.message === "") {
//         setCustomOutput("Programme didn't print anything");
//         return;
//       }
//       setCustomOutput(response.message);
//       setOutputErr("");
//     } catch (error) {
//       console.log(
//         "Problem in receiving req from custom run {language, code, inputValue}"
//       );
//       setOutputErr("Something went wrong");
//       return;
//     } finally {
//       setAiReview(false);
//       setOutputMessage("");
//       setVerdict("");
//       setDisableCustomRun(false);
//     }
//   };

//   const handleRun = async () => {
//     const payload = { language, code };
//     console.log("disable run");
//     setDisableRun(true);
//     if (code.trim() === "") {
//       setOutputErr("Please enter the code");
//     }
//     try {
//       const response = await getOutput(problemID, payload);
//       if (!response.success) {
//         setOutputErr(response.error);
//         return;
//       }
//       const { count, total } = response;
//       let message = `All sample test cases passed`;
//       if (count != total) {
//         message = `${count} out of ${total} sample test case passed`;
//       }
//       setOutputMessage(message);
//       setOutputErr("");
//     } catch (error) {
//       console.log("Problem in receiving req from run {language, code}");
//       setOutputErr("Something went wrong");
//       return;
//     } finally {
//       setAiReview(false);
//       setVerdict("");
//       setCustomOutput("");
//       setDisableRun(false);
//     }
//   };

//   const handleSubmit = async () => {
//     const payload = { language, code };
//     setDisableSubmit(true);
//     if (code.trim() === "") {
//       setOutputErr("Please enter the code");
//     }
//     try {
//       setAiReview(false);
//       const response = await getVerdict(problemID, payload);
//       if (!response.success) {
//         setOutputErr(response.error);
//         return;
//       }
//       const { count, total } = response;
//       let message = `All test cases passed`;
//       let verdictMessage = "ACCEPTED";
//       if (count != total) {
//         message = `${count} out of ${total} test case passed`;
//         verdictMessage = "FAIL";
//       }
//       setVerdict(verdictMessage);
//       setOutputMessage(message);
//       setOutputErr("");
//       if (verdictMessage === "ACCEPTED") {
//         setAiReview(true);
//       }
//     } catch (error) {
//       console.log("Problem in receiving req from submit {language, code}");
//       setOutputErr("Something went wrong");
//       return;
//     } finally {
//       setCustomOutput("");
//       setDisableSubmit(false);
//     }
//   };

//   return (
//     <>
//       {loading && <p className="text-center py-4">Loading your problem...</p>}
//       {problemErr ? (
//         <div>{problemErr}</div>
//       ) : (
//         <div className="flex flex-col lg:flex-row justify-between m-2 h-screen">
//           <div className="lg:w-2/5 flex flex-col pr-4 overflow-visible lg:overflow-y-auto dark">
//             <div className="flex justify-between items-center py-2 mt-6 lg:mt-0  bg-gray-100 dark:bg-gray-800">
//               <div className="text-xl font-bold w-4/5 px-2 dark:text-gray-300">
//                 {problem.title}
//               </div>
//               <span className="inline-flex items-center justify-center text-xl mx-2 dark:text-gray-300 px-4 lg:bg-gray-200 lg:dark:bg-gray-700">
//                 {problem.tags}
//               </span>
//             </div>
//             <div className="px-2 mt-4 bg-gray-100 dark:bg-gray-800">
//               <h3 className="font-medium text-base pt-2 dark:text-gray-300">
//                 Description
//               </h3>
//               <p className="text-lg py-2 dark:text-gray-300">
//                 {problem.description}
//               </p>
//             </div>
//             <div className="px-2 mt-4 bg-gray-100 dark:bg-gray-800">
//               <h3 className="text-base pt-2 font-medium dark:text-gray-300">
//                 Input Format
//               </h3>
//               <p className="text-lg py-2 dark:text-gray-300">
//                 {problem.inputInfo}
//               </p>
//             </div>
//             <div className="px-2 mt-4 bg-gray-100 dark:bg-gray-800">
//               <h3 className="text-base pt-2 font-medium dark:text-gray-300">
//                 Output Format
//               </h3>
//               <p className="text-lg py-2 dark:text-gray-300">
//                 {problem.outputInfo}
//               </p>
//             </div>
//             <div className="w-full mt-4 bg-gray-100 dark:bg-gray-800">
//               <div className="flex justify-between items-center px-2 pt-2">
//                 <div className="text-lg font-medium w-1/2 dark:text-gray-300 ">
//                   Input
//                 </div>
//                 <div className="text-lg font-medium w-1/2 dark:text-gray-300">
//                   Output
//                 </div>
//               </div>
//               {problem.sampleInputOutput.map((item) => (
//                 <div key={item.sioID} className="flex justify-between">
//                   <div className="w-1/2 px-2 my-2 text-base dark:text-gray-300">
//                     <pre>{item.input}</pre>
//                   </div>
//                   <div className="w-1/2 px-2 my-2 text-base dark:text-gray-300">
//                     <pre>{item.output}</pre>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col px-2 mt-4 bg-gray-100 dark:bg-gray-800">
//               <span className="font-medium text-base pt-2 dark:text-gray-300">
//                 More Info
//               </span>
//               <span className="text-base pt-1 dark:text-gray-300">
//                 Time limit: 1 sec
//               </span>
//               <span className="text-base pt-1 dark:text-gray-300">
//                 Memory limit: 1.5 GB
//               </span>
//               <span className="text-base py-1 dark:text-gray-300">
//                 Source Limit: 50 KB
//               </span>
//             </div>
//           </div>
//           <div className="lg:w-3/5 flex flex-col overflow-visible px-4 lg:overflow-y-auto dark:bg-gray-600">
//             <div className="flex flex-col bg-slate-100 mt-6 lg:mt-0 rounded dark:bg-gray-800">
//               <div className="grid grid-cols-2 lg:grid-cols-5 px-4">
//                 <button
//                   type="button"
//                   className="w-1/5 my-2 border-2 h-8 text-base bg-blue-600 text-white rounded-full pl-8 pr-16 disabled:bg-gray-300"
//                   disabled={disableRun}
//                   onClick={handleRun}
//                 >
//                   Run
//                 </button>
//                 <button
//                   type="button"
//                   className="w-1/5 my-2 border-2 h-8 text-base bg-green-700 text-white rounded-full pl-4 pr-20 disabled:bg-gray-300"
//                   disabled={disableSubmit}
//                   onClick={handleSubmit}
//                 >
//                   Submit
//                 </button>
//                 <button
//                   type="button"
//                   className="w-1/5 my-2 text-nowrap text-base border-2 h-[30px] bg-purple-500 text-white rounded-full pl-4 pr-24 disabled:bg-gray-300"
//                   disabled={!aiReview}
//                 >
//                   AI Review
//                 </button>
//                 <div className="w-1/5 my-2 h-8">
//                   <select
//                     name="language"
//                     value={language}
//                     onChange={selectLanguage}
//                     className="mb-4 px-2 h-8 text-base border-2 border-gray-300 rounded-full dark:bg-gray-400"
//                   >
//                     <option value="c">C</option>
//                     <option value="cpp">C++</option>
//                     <option value="py">Python</option>
//                     <option value="js">Javascript</option>
//                     <option value="java">Java</option>
//                   </select>
//                 </div>
//                 <button
//                   type="button"
//                   className="my-2 border-2 h-8 text-base bg-amber-700 text-white rounded-full w-full disabled:bg-gray-300"
//                   disabled={disableCustomRun}
//                   onClick={handleCustomRun}
//                 >
//                   <span className="text-nowrap">Run Custom Input</span>
//                 </button>
//               </div>
//               <div className="w-full mt-2 h-[400px] overflow-auto border-gray-500 border-4">
//                 <Editor
//                   value={code}
//                   onValueChange={(code) => setCode(code)}
//                   highlight={highlightCode}
//                   padding={10}
//                   className="code-editor text-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-300 w-full min-h-full"
//                 />
//               </div>
//             </div>
//             <div className="mt-4 mr-4 bg-gray-100 dark:bg-gray-800">
//               {verdict && (
//                 <p
//                   className={`ml-4 mt-4 text-xl font-bold break-words whitespace-normal ${
//                     verdict === "FAIL"
//                       ? "text-red-500"
//                       : "text-green-800 dark:text-green-400"
//                   }`}
//                 >
//                   {verdict}
//                 </p>
//               )}
//               {outputMessage && (
//                 <pre className="my-2 p-2 text-lg rounded dark:text-gray-300 break-words whitespace-normal">
//                   {outputMessage}
//                 </pre>
//               )}
//               {outputErr && (
//                 <p className="my-2 p-2 text-base h-[100px] overflow-y-auto text-red-600 font-medium break-words whitespace-normal">
//                   {outputErr}
//                 </p>
//               )}
//             </div>
//             <div className="flex flex-col lg:flex-row lg:justify-between pr-4 my-2">
//               <div className="lg:w-2/5 border-4 bg-slate-100 dark:bg-slate-700 dark:border-slate-500">
//                 <h3 className="text-base font-medium p-2 dark:text-gray-300">
//                   Custom Input
//                 </h3>
//                 <textarea
//                   rows={5}
//                   placeholder="Type your input here..."
//                   onChange={handleCustomInput}
//                   className="text-lg w-full resize-none flex-grow pl-2 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
//                 />
//               </div>
//               <div className="h-4 lg:hidden"></div>
//               <div className="lg:w-1/2 border-4 bg-slate-100 dark:bg-slate-700 dark:border-slate-500">
//                 <h3 className="text-base font-medium p-2 dark:text-gray-300">
//                   Output
//                 </h3>
//                 <pre className="px-4 pt-2 text-lg h-[150px] flex-grow overflow-y-auto break-words bg-white dark:bg-gray-800 dark:text-gray-300">
//                   {customOutput}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

{
  /* <button
                    className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
                    onClick={() =>
                      document
                        .getElementById("languageDropdown")
                        ?.classList.toggle("hidden")
                    }
                  >
                    <i className="fas fa-code mr-2"></i>
                    {languages.find((lang) => lang.value === selectedLanguage)
                      ?.label || "Select Language"}
                    <i className="fas fa-chevron-down ml-2"></i>
                  </button>
                  <div
                    id="languageDropdown"
                    className={`absolute z-10 mt-1 w-48 rounded-md shadow-lg ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    } ring-1 ring-black ring-opacity-5 hidden`}
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {languages.map((language) => (
                        <button
                          key={language.value}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode
                              ? "hover:bg-gray-600 text-gray-200"
                              : "hover:bg-gray-100 text-gray-700"
                          } cursor-pointer whitespace-nowrap`}
                          onClick={() => {
                            setSelectedLanguage(language.value);
                            document
                              .getElementById("languageDropdown")
                              ?.classList.add("hidden");
                          }}
                        >
                          {language.label}
                        </button>
                      ))}
                    </div>
                  </div> */
}
// const sampleProblem = {
//   title: "Two Sum",
//   description:
//     "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
//   inputFormat:
//     "First line contains n. Second line contains n space-separated integers. Third line contains target.",
//   outputFormat: "Two space-separated indices.",
//   sampleInput: "4\n2 7 11 15\n9",
//   sampleOutput: "0 1",
//   constraints:
//     "2 <= n <= 10^4; -10^9 <= nums[i], target <= 10^9; exactly one solution.",
//   memoryLimit: "256 MB",
//   timeLimit: "1 second",
// };

// useEffect(() => {
//   if (editorContainerRef.current && !editorRef.current) {
//     editorRef.current = monaco.editor.create(editorContainerRef.current, {
//       value: code,
//       language: language,
//       theme: darkMode ? "vs-dark" : "vs-light",
//       automaticLayout: true,
//       minimap: { enabled: false },
//       scrollBeyondLastLine: false,
//       lineNumbers: "on",
//       fontSize: 20,
//     });

//     editorRef.current.onDidChangeModelContent(() => {
//       setCode(editorRef.current.getValue());
//     });
//   }
//   return () => editorRef.current?.dispose();
// }, []);

// useEffect(() => {
//   if (editorRef.current) {
//     monaco.editor.setTheme(darkMode ? "vs-dark" : "vs-light");
//   }
// }, [darkMode]);

// useEffect(() => {
//   if (!editorRef.current) return;

//   // update the language
//   const model = editorRef.current.getModel();
//   if (model) {
//     monaco.editor.setModelLanguage(model, language);
//   }

//   // update the text
//   editorRef.current.setValue(code);
// }, [language]);
