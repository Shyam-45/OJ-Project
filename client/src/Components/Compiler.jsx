import { useState, useContext } from "react";
import Editor from "@monaco-editor/react";
import { AuthContext } from "../contexts/AuthContext";
import { getCustomOutput } from "../services/problem";
import {
  cSample,
  pySample,
  javaSample,
  jsSample,
  cppSample,
} from "../utils/sampleCode";

export default function Compiler() {
  const { darkMode } = useContext(AuthContext);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(cppSample);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(true);
  const [output, setOutput] = useState("");
  const [outputError, setOutputError] = useState(false);
  const [disableCustomRun, setDisableCustomRun] = useState(false);
  const [aiReview, setAiReview] = useState(false);
  const [disableAI, setDisableAI] = useState(true);

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
    setOutput("");
    setOutputError("");
  };

  const handleCustomRun = async () => {
    const inputValue = customInput || " ";
    const payload = { language, code, inputValue };
    setDisableCustomRun(true);
    setDisableAI(true);
    setOutput("");
    setOutputError("");
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
      setDisableCustomRun(false);
      setDisableAI(true);
      setAiReview(false);
    }
  };

  const handleCustomToggle = () => {
    setShowCustomInput(!showCustomInput);
    setOutput("");
    setCustomInput("");
  };

  return (
    <div className="flex flex-col min-h-90vh bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)] min-h-0">
          <div className="w-full lg:w-1/2 lg:overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col">
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
                    onClick={handleCustomRun}
                    className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                    disabled={disableCustomRun}
                  >
                    <i className="fas fa-play mr-2"></i> Run
                  </button>
                  <button
                    className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                    disabled={disableAI}
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
            <div className="border-b border-gray-200 dark:border-gray-700">
              <Editor
                height="519px"
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
            </div>
          </div>
          <div className="w-full lg:w-1/2 lg:overflow-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col">
            <div className="px-4 border-b border-gray-200 dark:border-gray-700">
              {showCustomInput && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                  <div>
                    <label className="block text-base font-medium mb-2">
                      Custom Input
                    </label>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="w-full h-32 p-3 rounded font-mono text-sm resize-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 bg-white text-gray-900 border-gray-300 border"
                      placeholder="Enter your test input here..."
                    ></textarea>
                  </div>
                </div>
              )}
              <div className="border-t dark:border-gray-700 border-gray-200 p-2">
                <div className="flex justify-between items-center mb-2">
                  {outputError ? (
                    <h3 className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Error
                    </h3>
                  ) : (
                    <h3 className="block text-base font-medium">Output</h3>
                  )}
                </div>
                <div className="flex justify-between items-center mb-2">
                  {outputError ? (
                    <pre className="w-full h-32 p-3 rounded font-mono text-sm  overflow-auto bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                      {outputError}
                    </pre>
                  ) : (
                    <pre className="w-full h-32 p-3 rounded font-mono text-sm  overflow-auto bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                      {output || "Output will appear here"}
                    </pre>
                  )}
                </div>
              </div>
              <div>
                <div className="border-t dark:border-gray-700 border-gray-200 p-4">
                  <div className="flex flex-col justify-between items-center mb-2">
                    <h3 className="w-full text-base font-medium mb-2">
                      Code Review by AI
                    </h3>
                    <div className="w-full h-32 p-3 rounded font-mono text-sm overflow-auto dark:bg-purple-900/20 dark:text-purple-100 border dark:border-purple-700 bg-purple-50 text-purple-900 border-purple-200">
                      {aiReview ? (
                        { aiReview }
                      ) : (
                        <div>
                          <span>AI review will appear here (coming soon)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
