import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "react-simple-code-editor";
import Prism, { highlight } from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import {
  cSample,
  pySample,
  javaSample,
  jsSample,
  cppSample,
} from "../Utils/sampleCode.js";
import { getProblemInfo, getOutput, getVerdict } from "../Services/problem";

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
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(cppSample);
  const [outputMessage, setOutputMessage] = useState("");
  const [verdict, setVerdict] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchProblem() {
      try {
        const problemInfo = await getProblemInfo(problemID);
        setProblem(problemInfo);
      } catch (err) {
        console.log("Error while getting problem info from api");
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [problemID]);

  const languageMap = {
    c: "c",
    cpp: "clike",
    js: "javascript",
    java: "java",
    py: "python",
  };

  const sampleCodeMap = {
    c: cSample,
    cpp: cppSample,
    py: pySample,
    js: jsSample,
    java: javaSample,
  };

  const highlightCode = (code) =>
    highlight(
      code,
      Prism.languages[languageMap[language]],
      languageMap[language]
    );

  const selectLanguage = (event) => {
    const selected = event.target.value;
    if (!selected) return;
    setLanguage(selected);
    setCode(sampleCodeMap[selected]);
    setOutputMessage("");
    setErr("");
    setVerdict("");
  };

  const handleRun = async () => {
    const payload = { language, code };
    try {
      setOutputMessage("");
      setErr("");
      setVerdict("");
      const response = await getOutput(problemID, payload);
      console.log(response);
      if (!response.success) {
        setErr(response.error);
        return;
      }
      const { count, total } = response;
      let message = `All sample test cases passed`;
      if (count != total) {
        message = `${count} out of ${total} sample test case passed`;
      }
      setOutputMessage(message);
      setErr("");
    } catch (error) {
      console.log("Problem in receiving req from run {language, code}");
      return;
    }
  };

  const handleSubmit = async () => {
    const payload = { language, code };
    try {
      setOutputMessage("");
      setErr("");
      setVerdict("");
      const response = await getVerdict(problemID, payload);
      console.log(response);
      if (!response.success) {
        setErr(response.error);
        return;
      }
      const { count, total } = response;
      let message = `All test cases passed`;
      let verdictMessage = "ACCEPTED";
      if (count != total) {
        message = `${count} out of ${total} test case passed`;
        verdictMessage = "FAIL";
      }
      setVerdict(verdictMessage);
      setOutputMessage(message);
      setErr("");
    } catch (error) {
      console.log("Problem in receiving req from run {language, code}");
      return;
    }
  };

  return (
    <>
      {loading && <p className="text-center py-4">Loading your problem...</p>}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {problem.title}
              </h2>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                {problem.tags}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-600">{problem.description}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-1">Input</h3>
              <p className="text-gray-600">{problem.inputInfo}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-1">Output</h3>
              <p className="text-gray-600">{problem.outputInfo}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problem.sampleInputOutput.map((item) => (
                <div key={item.sioID} className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold">Input</h4>
                  <pre className="text-gray-600 mb-2">{item.input}</pre>
                  <h4 className="font-semibold">Output</h4>
                  <pre className="text-gray-600">{item.output}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
            <select
              name="language"
              value={language}
              onChange={selectLanguage}
              className="mb-4 p-2 border border-gray-300 rounded"
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="py">Python</option>
              <option value="js">Javascript</option>
              <option value="java">Java</option>
            </select>

            <div className="flex-1 bg-gray-50 text-gray-800 p-4 rounded overflow-auto">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={highlightCode}
                padding={10}
                style={{
                  fontFamily: "Fira code, Fira Mono, monospace",
                  fontSize: 20,
                  color: "#1a202c",
                  backgroundColor: "#f7fafc",
                }}
                className="w-full h-full"
              />
            </div>
            <div>
              <div className="mt-4 flex space-x-4">
                <button
                  type="button"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleRun}
                >
                  Run
                </button>
                <button
                  type="button"
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
              <div className="mt-4">
                {verdict && (
                  <p
                    className={`text-center text-xl font-bold ${
                      verdict === "FAIL" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {verdict}
                  </p>
                )}
                {outputMessage && (
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-gray-800">
                    {outputMessage}
                  </pre>
                )}
                {err && <p className="mt-2 text-red-600 font-medium">{err}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
