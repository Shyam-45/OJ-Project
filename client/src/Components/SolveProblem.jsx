import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { AuthContext } from "../contexts/AuthContext";
import {
  getProblemInfo,
  getOutput,
  getVerdict,
  getCustomOutput,
} from "../services/problem";
import { toggleBookmark, isProblemBookmarked } from "../services/bookmark";

import {
  cSample,
  pySample,
  javaSample,
  jsSample,
  cppSample,
} from "../utils/sampleCode";

export default function SolveProblem() {
  const { problemID } = useParams();
  const { darkMode } = useContext(AuthContext);
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    tags: "",
    inputInfo: "",
    outputInfo: "",
    sampleInputOutput: [],
  });
  const [problemErr, setProblemErr] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(cppSample);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputError, setOutputError] = useState();
  const [toggleTest, setToggleTest] = useState(false);
  const [testResult, setTestResult] = useState();
  const [showResults, setShowResults] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);
  const [expandTestCase, setExpandTestCase] = useState(null);
  const [disableRun, setDisableRun] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [disableCustomRun, setDisableCustomRun] = useState(false);
  const [aiReview, setAiReview] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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
        const isBookmarked = await isProblemBookmarked(
          response.problemInfo._id
        );
        setBookmarked(isBookmarked);
      } catch (err) {
        setProblemErr("An error occurred");
        setProblem("");
      }
    }
    fetchProblem();
  }, [problemID]);

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
    setAiReview(false);
    setOutput("");
    setOutputError("");
  };

  const handleBookmarkClick = async () => {
    const result = await toggleBookmark(problemID);
    if (result !== null) {
      setBookmarked(result);
    }
  };

  const handleCustomRun = async () => {
    const inputValue = customInput || " ";
    const payload = { language, code, inputValue };
    setDisableCustomRun(true);
    setDisableRun(true);
    setDisableSubmit(true);
    setOutput("");
    setOutputError("");
    setShowResults(false);
    setToggleTest(false);
    setAiReview(false);
    try {
      if (code.trim() === "") {
        setOutputError("Please enter the code");
        return;
      }
      const response = await getCustomOutput(payload);
      if (!response.success) {
        setOutputError(response.error);
        return;
      }
      if (response.message === "") {
        setOutput("Programme didn't print anything");
        return;
      }
      setOutput(response.message);
    } catch (err) {
      setOutputError("Something went wrong");
    } finally {
      setDisableRun(false);
      setDisableSubmit(false);
      setShowAIReview(false);
      setDisableCustomRun(false);
      setAiReview(false);
    }
  };

  const handleRun = async () => {
    const payload = { language, code };
    setDisableRun(true);
    setDisableSubmit(true);
    setDisableCustomRun(true);
    setAiReview(false);
    setOutputError("");
    setShowResults(false);
    setOutput("");

    try {
      if (code.trim() === "") {
        setOutputError("Please enter the code");
        return;
      }
      const response = await getOutput(problemID, payload);
      if (!response.success) {
        setOutputError(response.error);
        return;
      }
      const { passed, totalTests, testCases } = response;
      const testRes = {
        passed: passed,
        failed: totalTests - passed,
        totalTests: totalTests,
        testCases: testCases,
      };
      setToggleTest(true);
      setTestResult(testRes);
      setShowResults(true);
    } catch (err) {
      setOutputError("something went wrong");
    } finally {
      setDisableRun(false);
      setDisableSubmit(false);
      setShowAIReview(false);
      setDisableCustomRun(false);
      setAiReview(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { language, code };
    setDisableRun(true);
    setDisableSubmit(true);
    setDisableCustomRun(true);
    setOutput("");
    setOutputError("");
    setShowResults(false);
    setToggleTest(false);
    setAiReview(false);
    try {
      if (code.trim() === "") {
        setOutputError("Please enter the code");
        return;
      }
      const response = await getVerdict(problemID, payload);
      if (!response.success) {
        setOutputError(response.error);
        return;
      }
      setToggleTest(false);
      const { passed, totalTests, testCases } = response;
      const testRes = {
        passed: passed,
        failed: totalTests - passed,
        totalTests: totalTests,
        testCases: testCases,
      };
      setTestResult(testRes);
      setShowResults(true);
      if (testRes.failed === 0) {
        setAiReview(true);
      }
    } catch (err) {
      setOutputError("something went wrong");
    } finally {
      setDisableRun(false);
      setDisableSubmit(false);
      setShowAIReview(false);
      setDisableCustomRun(false);
      setAiReview(false);
    }
  };

  const handleAIReview = () => setShowAIReview(true);
  const handleCancelAIReview = () => setShowAIReview(false);

  const handleBackToProblem = () => setShowResults(false);

  const toggleTestCase = (id) =>
    setExpandTestCase(expandTestCase === id ? null : id);

  const handleCustomToggle = () => {
    setShowCustomInput(!showCustomInput);
    setOutput("");
    setCustomInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
          <div className="w-full lg:w-2/5 lg:overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6">
            {!showResults ? (
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
                    onClick={handleBookmarkClick}
                    title="Toggle Bookmark"
                  >
                    <i
                      className={`text-xl ${
                        bookmarked
                          ? "fas fa-bookmark text-blue-600 dark:text-blue-400"
                          : "far fa-bookmark"
                      }`}
                    ></i>
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
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Test Results</h2>
                  <button
                    onClick={handleBackToProblem}
                    className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {darkMode ? (
                      <i className="fa-solid fa-arrow-left"></i>
                    ) : (
                      <i className="fas fa-arrow-left mr-2"></i>
                    )}
                  </button>
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          testResult.failed === 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        } mr-2`}
                      ></div>
                      <span className="font-semibold">
                        {testResult.passed} / {testResult.totalTests} test cases
                        passed
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Passed: {testResult.passed}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Failed: {testResult.failed}
                      </span>
                    </div>
                  </div>

                  {testResult.testCases.map((testCase, idx) => (
                    <div
                      key={testCase.id}
                      className={`mb-4 rounded-lg border ${
                        testCase.status === "passed"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-red-500 bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <div
                        className={`flex justify-between p-4 ${
                          toggleTest ? "cursor-pointer" : ""
                        }`}
                        onClick={() => {
                          if (toggleTest) toggleTestCase(testCase.id);
                        }}
                      >
                        <h3 className="font-semibold">Test Case #{idx + 1}</h3>
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
                          {toggleTest ? (
                            <i
                              className={`fas ${
                                expandTestCase === testCase.id
                                  ? "fa-chevron-up"
                                  : "fa-chevron-down"
                              }`}
                            ></i>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      {toggleTest && expandTestCase === testCase.id && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-0">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Input</h4>
                            <pre className="p-2 rounded text-xs bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap">
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
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-3/5 lg:overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col">
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
                    {/* <option value="java">Java</option> */}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleRun}
                    className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                    disabled={disableRun}
                  >
                    <i className="fas fa-play mr-2"></i> Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                    disabled={disableSubmit}
                  >
                    <i className="fas fa-check mr-2"></i> Submit
                  </button>
                  <button
                    className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                    disabled={!aiReview}
                  >
                    <i className="fas fa-robot mr-2"></i> AI Review
                  </button>
                  <button
                    onClick={handleCustomToggle}
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
            <Editor
              height="400px"
              className="flex-shrink-0"
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
            {showCustomInput && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2">
                    Custom Input
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full h-24 p-3 rounded font-mono text-sm resize-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 bg-white text-gray-900 border-gray-300 border"
                    placeholder="Enter your test input here..."
                  ></textarea>
                </div>
                <button
                  onClick={handleCustomRun}
                  className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                  disabled={disableCustomRun}
                >
                  <i className="fas fa-play-circle mr-2"></i> Run with Custom
                  Input
                </button>
              </div>
            )}
            <div className="border-t dark:border-gray-700 border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                {output && <h3 className="text-sm font-medium">Output</h3>}
                {outputError && (
                  <h3 className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Error
                  </h3>
                )}
                {showAIReview && (
                  <>
                    <i className="fas fa-robot text-purple-500 mr-2"></i>
                    <span className="font-semibold">AI Code Review</span>
                    <button
                      onClick={handleCancelAIReview}
                      className="px-2 py-1 !rounded-button bg-gray-500 text-white hover:bg-gray-600 text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="fas fa-times mr-1"></i> Close AI Review
                    </button>
                  </>
                )}
              </div>

              {showAIReview ? (
                <div className="w-full h-32 p-3 rounded font-mono text-sm overflow-auto dark:bg-purple-900/20 dark:text-purple-100 border dark:border-purple-700 bg-purple-50 text-purple-900 border-purple-200">
                  {/* Later on it will be replaced by real AI response */}
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
              ) : outputError ? (
                <pre className="w-full h-32 p-3 rounded text-red-600 font-medium text-sm  overflow-auto bg-gray-50 dark:bg-gray-700">
                  {outputError}
                </pre>
              ) : (
                <pre className="w-full h-32 p-3 rounded font-mono text-sm  overflow-auto bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                  {output || "Output for custom input will appear here..."}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
