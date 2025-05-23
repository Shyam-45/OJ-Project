import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemInfo } from "../Services/problem";

export default function solveProblem() {
  const { problemID } = useParams();
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const problemInfo = await getProblemInfo(problemID);
        console.log(problemInfo);
        setProblem(problemInfo);
      } catch (err) {
        console.log("Error while getting problem info from api");
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [problemID]);

  return (
    <>
      {loading && <p>Loading your problem</p>}
      <h2 className="bg-red-400 text-white">Problem Info</h2>
      <p>{problem.title}</p>
    </>
  );
}
