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
        // Error interacting with pronlemList API
        console.log(`Error occurred : ${err}`);
        setProblemList([]);
        setError("Failed to get problem list");
      } finally {
        setFetchProblem(false);
      }
    }
    fetchProblemList();
  }, []);

  return (
    <div className="mt-12 lg:mt-16">
      {error && (
        <p className="mt-2 text-sm text-red-600 font-semibold">❌ {error}</p>
      )}
      {fetchProblem ? (
        <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
          Fetching Problem List.....
        </h2>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8 px-4 dark:bg-gray-600">
          <div className="max-w-7xl mx-auto">
            {problemList.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {problemList.map((item) => (
                  <Problem key={item.problemID} problem={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-red-600 text-lg font-medium">
                  No problem found!
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
