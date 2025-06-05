import { useState } from "react";
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
import { getCustomOutput } from "../Services/problem.js";

export default function Compiler() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(cppSample);
  const [customInput, setCustomInput] = useState("");
  // const [outputMessage, setOutputMessage] = useState("");
  const [outputErr, setOutputErr] = useState("");
  const [customOutput, setCustomOutput] = useState("5\n2 5\n3 5");

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
    setCustomOutput("");
    setOutputErr("");
    // setVerdict("");
  };

  const handleCustomInput = (event) => {
    setCustomInput(event.target.value);
    // console.log(event.target.value);
  };

  const handleCustomRun = async () => {
    const inputValue = (customInput || " ");
    const payload = { language, code, inputValue};
    try {
      // setOutputMessage("");
      setCustomOutput("");
      setOutputErr("");
      const response = await getCustomOutput(payload);
      console.log(response);
      if (!response.success) {
        setOutputErr(response.error);
        return;
      }
      // const { count, total } = response;
      // let message = `All sample test cases passed`;
      // if (count != total) {
      //   message = `${count} out of ${total} sample test case passed`;
      // }
      setCustomOutput(response.message);
      // setOutputMessage(message);
      setOutputErr("");
    } catch (error) {
      console.log("Problem in receiving req from run {language, code}");
      return;
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row m-4">
        <div className="div_left lg:w-1/2">
          <div className="flex flex-col pt-4 pr-4 mb-2">
            <div className="lang_opt mt-4 w-1/5 px-4">
              <select
                name="language"
                value={language}
                onChange={selectLanguage}
                className="mb-4 p-2 border-2 border-gray-300 rounded dark:bg-gray-400"
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="py">Python</option>
                <option value="js">Javascript</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="w-full h-[575px] overflow-auto px-4">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={highlightCode}
                padding={10}
                className="code-editor text-2xl bg-gray-100 dark:bg-gray-800 dark:text-gray-300 w-full min-h-full border-red-500 border-4"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between mx-4">
            <button
              type="button"
              className="border-2 rounded-full my-2 py-2 px-8 text-2xl  bg-blue-600 hover:bg-blue-800 text-white"
              onClick={handleCustomRun}
            >
              Run
            </button>
            <button
              type="button"
              className="text-xl py-2 my-2 px-4 rounded-full border-2 bg-indigo-600 hover:bg-indigo-700 text-white mx-2 dark:text-gray-200 disabled:bg-gray-300"
              disabled
              //   onClick={handleAIReview}
            >
              AI Review
            </button>
          </div>
        </div>
        <div className="div_right lg:w-1/2 flex flex-col ">
          <div className="cus_inp m-4 border-4 bg-slate-100 dark:bg-slate-700 dark:border-slate-500">
            <h3 className="text-lg font-medium p-2 dark:text-gray-300">
              Custom Input
            </h3>
            <textarea
              rows={10}
              placeholder="Type your input here..."
              // name="customInput"
              value={customInput}
              onChange={handleCustomInput}
              className="text-xl w-full resize-none rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="cus_inp m-4 border-4 min-h-48 max-h-96 bg-slate-100 dark:bg-slate-700 dark:border-slate-500">
            <h3 className="text-lg font-medium p-2 dark:text-gray-300">
              Output
            </h3>
            <pre className="px-4 my-4 text-xl break-words dark:text-gray-300 ">
              {customOutput}
            </pre>
          </div>
          <div className="mt-4 mr-4 bg-gray-100 dark:bg-gray-800">
            {/* {outputMessage && (
              <pre className="mt-2 p-4 text-xl rounded dark:text-gray-300 break-words whitespace-normal">
                {outputMessage}
              </pre>
            )} */}
            {outputErr && (
              <p className="mt-2 px-4 text-lg text-red-600 font-medium break-words whitespace-normal">
                {outputErr}
              </p>
            )}
          </div>
          <div className="cus_inp m-4 border-4 min-h-36 max-h-96 bg-slate-100 dark:bg-slate-700 dark:border-slate-500">
            <h3 className="text-lg font-medium p-2 break-words  dark:text-gray-300">
              Code review by AI will appear here
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
