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
  const [problemErr, setProblemErr] = useState("");
  const [outputErr, setOutputErr] = useState("");
  const [customOutput, setCustomOutput] = useState(
    `5
2 5
3 5
2 5
3 5
2 5
3 5
2 5
3 5
2 5
3 5
`
  );

  //   `5
  // 2 5
  // 3 5`
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
        // console.log("Error while getting problem info from api");
        setProblemErr("An error occurred");
        setProblem("");
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
    setOutputErr("");
    setVerdict("");
  };

  const handleRun = async () => {
    const payload = { language, code };
    try {
      setOutputMessage("");
      setOutputErr("");
      setVerdict("");
      const response = await getOutput(problemID, payload);
      console.log(response);
      if (!response.success) {
        setOutputErr(response.error);
        return;
      }
      const { count, total } = response;
      let message = `All sample test cases passed`;
      if (count != total) {
        message = `${count} out of ${total} sample test case passed`;
      }
      setOutputMessage(message);
      setOutputErr("");
    } catch (error) {
      console.log("Problem in receiving req from run {language, code}");
      return;
    }
  };

  const handleSubmit = async () => {
    const payload = { language, code };
    try {
      setOutputMessage("");
      setOutputErr("");
      setVerdict("");
      const response = await getVerdict(problemID, payload);
      console.log(response);
      if (!response.success) {
        setOutputErr(response.error);
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
      setOutputErr("");
    } catch (error) {
      console.log("Problem in receiving req from submit {language, code}");
      return;
    }
  };

  return (
    <>
      {loading && <p className="text-center py-4">Loading your problem...</p>}
      {problemErr ? (
        <div>{problemErr}</div>
      ) : (
        <div className="flex flex-col lg:flex-row justify-between m-2 h-screen">
          <div className="lg:w-2/5 flex flex-col pr-4 overflow-visible lg:overflow-y-auto dark">
            <div className="flex justify-between items-center py-2 mt-6 lg:mt-0  bg-gray-100 dark:bg-gray-800">
              <div className="text-xl font-bold w-4/5 px-2 dark:text-gray-300">
                {problem.title}
              </div>
              <span className="inline-flex items-center justify-center text-xl mx-2 dark:text-gray-300 px-4 lg:bg-gray-200 lg:dark:bg-gray-700">
                {problem.tags}
              </span>
            </div>
            <div className="px-2 mt-4 bg-gray-100 dark:bg-gray-800">
              <h3 className="font-medium text-base pt-2 dark:text-gray-300">
                Description
              </h3>
              <p className="text-lg py-2 dark:text-gray-300">
                {problem.description}
              </p>
            </div>
            <div className="px-2 mt-4 bg-gray-100 dark:bg-gray-800">
              <h3 className="text-base pt-2 font-medium dark:text-gray-300">
                Input Format
              </h3>
              <p className="text-lg py-2 dark:text-gray-300">
                {problem.inputInfo}
              </p>
            </div>
            <div className="px-2 mt-4 bg-gray-100 dark:bg-gray-800">
              <h3 className="text-base pt-2 font-medium dark:text-gray-300">
                Output Format
              </h3>
              <p className="text-lg py-2 dark:text-gray-300">
                {problem.outputInfo}
              </p>
            </div>
            <div className="w-full mt-4 bg-gray-100 dark:bg-gray-800">
              <div className="flex justify-between items-center px-2 pt-2">
                <div className="text-lg font-medium w-1/2 dark:text-gray-300 ">
                  Input
                </div>
                <div className="text-lg font-medium w-1/2 dark:text-gray-300">
                  Output
                </div>
              </div>
              {problem.sampleInputOutput.map((item) => (
                <div key={item.sioID} className="flex justify-between">
                  <div className="w-1/2 px-2 my-2 text-base dark:text-gray-300">
                    <pre>{item.input}</pre>
                  </div>
                  <div className="w-1/2 px-2 my-2 text-base dark:text-gray-300">
                    <pre>{item.output}</pre>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col px-2 mt-4 bg-gray-100 dark:bg-gray-800">
              <span className="font-medium text-base pt-2 dark:text-gray-300">
                More Info
              </span>
              <span className="text-base pt-1 dark:text-gray-300">
                Time limit: 1 sec
              </span>
              <span className="text-base pt-1 dark:text-gray-300">
                Memory limit: 1.5 GB
              </span>
              <span className="text-base py-1 dark:text-gray-300">
                Source Limit: 50 KB
              </span>
            </div>
          </div>
          <div className="lg:w-3/5 flex flex-col overflow-visible px-4 lg:overflow-y-auto dark:bg-gray-600">
            <div className="flex flex-col bg-slate-100 mt-6 lg:mt-0 rounded dark:bg-gray-800">
              <div className="grid grid-cols-2 lg:grid-cols-4 pl-4">
                <button
                  type="button"
                  className="w-1/5 my-2 border-2 h-8 text-base bg-blue-600 text-white rounded-full pl-8 pr-16"
                  onClick={handleRun}
                >
                  Run
                </button>
                <button
                  type="button"
                  className="w-1/5 my-2 border-2 h-8 text-base bg-green-700 text-white rounded-full pl-4 pr-20"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="disabled w-1/5 my-2 text-nowrap text-base border-2 h-[30px] bg-purple-500 text-white rounded-full pl-4 pr-24 disabled:bg-gray-300"
                  disabled
                >
                  AI Review
                </button>
                <div className="w-1/5 my-2 h-8">
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
              </div>
              <div className="w-full mt-2 h-[400px] overflow-auto border-gray-500 border-4">
                <Editor
                  value={code}
                  onValueChange={(code) => setCode(code)}
                  highlight={highlightCode}
                  padding={10}
                  className="code-editor text-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-300 w-full min-h-full"
                />
              </div>
            </div>
            <div className="mt-4 mr-4 bg-gray-100 dark:bg-gray-800">
              {verdict && (
                <p
                  className={`ml-4 mt-4 text-xl font-bold break-words whitespace-normal ${
                    verdict === "FAIL"
                      ? "text-red-500"
                      : "text-green-800 dark:text-green-400"
                  }`}
                >
                  {verdict}
                </p>
              )}
              {outputMessage && (
                <pre className="my-2 p-2 text-lg rounded dark:text-gray-300 break-words whitespace-normal">
                  {outputMessage}
                </pre>
              )}
              {outputErr && (
                <p className="my-2 p-2 text-base h-[100px] overflow-y-auto text-red-600 font-medium break-words whitespace-normal">
                  {outputErr}
                </p>
              )}
            </div>
            <div className="flex flex-col lg:flex-row lg:justify-between pr-4 my-2">
              <div className="lg:w-2/5 border-4 bg-slate-100 dark:bg-slate-700 dark:border-slate-500">
                <h3 className="text-base font-medium p-2 dark:text-gray-300">
                  Custom Input
                </h3>
                <textarea
                  rows={5}
                  placeholder="Type your input here..."
                  className="text-lg w-full resize-none flex-grow pl-2 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="h-4 lg:hidden"></div>
              <div className="lg:w-1/2 border-4 bg-slate-100 dark:bg-slate-700 dark:border-slate-500">
                <h3 className="text-base font-medium p-2 dark:text-gray-300">
                  Output
                </h3>
                <pre className="px-4 pt-2 text-lg h-[150px] flex-grow overflow-y-auto break-words bg-white dark:bg-gray-800 dark:text-gray-300">
                  {customOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
