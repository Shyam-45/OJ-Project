import { useEffect, useState } from "react";
import Problem from "./Problem.jsx";
import { getProblemList } from "../Services/problem.js";

export default function Home() {
  const [problemList, setProblemList] = useState([]);

  useEffect(() => {
    async function fetchProblemList() {
      try {
        let response = await getProblemList();
        setProblemList(response);
      } catch (err) {
        console.log(`Error occurred : ${err}`);
        setProblemList([]);
      }
    }
    fetchProblemList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Available Problems</h1>

        {problemList.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemList.map((item) => (
              <Problem key={item.problemID} problem={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-red-600 text-lg font-medium">No problems found</span>
          </div>
        )}
      </div>
    </div>
  );
}
