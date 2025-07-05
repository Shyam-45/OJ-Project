import { useEffect, useState } from "react";
import Problem from "../components/Problem.jsx";
import { getProblemList } from "../services/problem.js";

export default function ProblemPage() {
  const [problemList, setProblemList] = useState([]);
  const [fetchProblem, setFetchProblem] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProblemList() {
      try {
        const response = await getProblemList();
        if (response.success) {
          setProblemList(response.problem_list);
          setError("");
          return;
        }
        setProblemList([]);
        setError(response.error);
      } catch (err) {
        setProblemList([]);
        setError("Failed to get problem list");
      } finally {
        setFetchProblem(false);
      }
    }
    fetchProblemList();
  }, []);

  return (
    <div className="mt-12 lg:mt-16 dark:bg-gray-950">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
  
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300">
            Browse through all available coding problems
          </h1>
        </div>


        {fetchProblem ? (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold text-yellow-500">
              Fetching problem list...
            </h2>
          </div>
        ) : error ? (
          <div className="text-center mt-12">
            <p className="text-red-600 font-semibold text-lg">❌ {error}</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {problemList.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {problemList.map((item) => (
                  <Problem key={item.problemID} problem={item} />
                ))}
              </div>
            ) : (
              <div className="text-center mt-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  🚫 No problems available at the moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
