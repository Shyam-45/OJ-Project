import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemAndTestcases } from "../services/problem";

function Section({ title, content }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}

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

  const [infoError, setInfoError] = useState("");

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await getProblemAndTestcases(problemID);
        if (!response.success) {
          setInfoError(response.error);
          return;
        }
        setProblem(response.payload.problemInfo);
        setInfoError("");
      } catch (err) {
        setInfoError("An error occurred while fetching problem data.");
      }
    }
    fetchProblem();
  }, [problemID]);

  if (infoError) {
    return (
      <div className="text-center text-red-600 font-semibold py-6">
        {infoError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title and Tags */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {problem.title || "Untitled Problem"}
            </h1>
            <span className="mt-2 sm:mt-0 inline-block text-sm font-medium px-3 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white rounded-full">
              {problem.tags}
            </span>
          </div>
        </div>

        <Section title="Description" content={problem.description} />
        <Section title="Input Format" content={problem.inputInfo} />
        <Section title="Output Format" content={problem.outputInfo} />

        {/* Sample Input Output */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sample Input Output
          </h3>
          {problem.sampleInputOutput.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {problem.sampleInputOutput.map((item) => (
                <div
                  key={item.sioID}
                  className="flex flex-col lg:flex-row justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow hover:shadow-lg"
                >
                  <div className="w-full lg:w-1/2 pr-2">
                    <h4 className="font-medium text-md text-gray-800 dark:text-gray-300 mb-1">
                      Input
                    </h4>
                    <pre className="bg-white dark:bg-gray-800 p-2 rounded text-sm text-gray-900 dark:text-white overflow-auto">
                      {item.input}
                    </pre>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:w-1/2 pl-2">
                    <h4 className="font-medium text-md text-gray-800 dark:text-gray-300 mb-1">
                      Output
                    </h4>
                    <pre className="bg-white dark:bg-gray-800 p-2 rounded text-sm text-gray-900 dark:text-white overflow-auto">
                      {item.output}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No sample cases provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}
