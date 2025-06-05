import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemAndTestcases } from "../Services/problem";
import InputOutput from "./InputOutput";

export default function ViewProblem() {
  const { problemID } = useParams();
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    tags: "",
    inputInfo: "",
    outputInfo: "",
    sampleInputOutput: [],
  });
  const [testcase, setTestcase] = useState({
    inputOutputFile: [],
    sampleInputOutputFile: [],
  });

  const [infoError, setInfoError] = useState("");

  useEffect(() => {
    async function fetchProblem() {
      try {
        console.log("i tried");
        const response = await getProblemAndTestcases(problemID);
        if (!response.success) {
          setInfoError(response.error);
          setProblem("");
          setTestcase("");
          return;
        }
        setProblem(response.payload.problemInfo);
        setTestcase(response.payload.testcaseInfo);
        setInfoError("");
      } catch (err) {
        // console.log("Error while getting problem info from api");
        setInfoError("An error occurred");
        setProblem("");
        setTestcase("");
      }
    }
    fetchProblem();
  }, [problemID]);

  return (
    <div>
      {infoError ? (
        <div>{infoError}</div>
      ) : (
        <div className="m-4 border-4 px-4">
          <div className="flex flex-col w-fit break-words whitespace-normal px-4 mt-4 border-2 bg-gray-100 dark:bg-gray-800">
            <h3 className="font-medium text-lg pt-4 dark:text-gray-300">
              Title
            </h3>
            <p className="text-xl py-2 dark:text-white">{problem.title}</p>
          </div>
          <div className="flex flex-row w-fit break-words whitespace-normal px-4 mt-4 border-2 bg-gray-100 dark:bg-gray-800">
            <span className="font-medium text-lg py-2 dark:text-gray-300">
              Tag:
            </span>
            &nbsp;
            <span className="text-xl py-2 dark:text-white">{problem.tags}</span>
          </div>
          <div className="flex flex-col w-fit break-words whitespace-normal px-4 mt-4 border-2 bg-gray-100 dark:bg-gray-800">
            <h3 className="font-medium text-lg pt-4 dark:text-gray-300">
              Description
            </h3>
            <p className="text-xl py-2 dark:text-white">
              {problem.description}
            </p>
          </div>
          <div className="flex flex-col w-fit break-words whitespace-normal px-4 mt-4 border-2 bg-gray-100 dark:bg-gray-800">
            <h3 className="font-medium text-lg pt-4 dark:text-gray-300">
              Input Format
            </h3>
            <p className="text-xl py-2 dark:text-white">{problem.inputInfo}</p>
          </div>
          <div className="flex flex-col w-fit break-words whitespace-normal px-4 mt-4 border-2 bg-gray-100 dark:bg-gray-800">
            <h3 className="font-medium text-lg pt-4 dark:text-gray-300">
              Output Format
            </h3>
            <p className="text-xl py-2 dark:text-white">{problem.outputInfo}</p>
          </div>
          <div className="w-fit h-fit break-words px-4 mt-4 border-2 bg-gray-100 dark:bg-gray-800">
            <h3 className="font-medium text-lg pt-4 dark:text-gray-300">
              Sample Input Output
            </h3>
          
          <div className="max-w-7xl">
            {problem.sampleInputOutput.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {problem.sampleInputOutput.map((item) => (
                  <InputOutput
                    key={item.sioID}
                    inp={item.input}
                    out={item.output}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-lg font-medium">
                  No test case provided to display
                </span>
              </div>
            )}
            </div>
          </div>
          <div>
            
          </div>
          <div>
            Test cases to check on sample cases
            </div>
          {/* <div className="flex lg:flex">
              <h4 className="font-medium text-lg dark:text-gray-300">Input</h4>
              <h4 className="font-medium text-lg dark:text-gray-300">Output</h4>
              </div>
          </div> */}
          {/* <div>
            <h3>Sample input info</h3>
            <p>{problem.title}</p>
          </div> */}
          {/* <div>Test case for sample input</div>
          <div>TEST CASE for verdict</div> */}
        </div>
      )}
    </div>
  );
}
