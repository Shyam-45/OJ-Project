import { useEffect, useState } from "react";
import Problem from "./Problem.jsx";
import { getProblemList } from "../Services/problem.js";

export default function Home() {

  const [problemList, setProblemList] = useState([]);

  useEffect( () => {
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
    <div>
      {problemList.length ? (
        <ul>
            {problemList.map((item, idx) => (
          <li key={item.problemID}>
            <Problem problem={item} />
          </li>))}
        </ul>
      ) : (
        <span className="text-red-600">No problems found</span>
      )}
    </div>
  );
}
