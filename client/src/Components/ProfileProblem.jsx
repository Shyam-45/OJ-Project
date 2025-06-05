import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProblem } from "../Services/problem";

export default function ProfileProblem({ problem, u_id, onDelete }) {
  const navigate = useNavigate();
  const [delError, setDelErr] = useState("");

  const handleDeleteProblem = async (p_id) => {
    try {
      // console.log(`delete problem button with id: ${p_id} clicked`);
      const response = await deleteProblem(p_id, u_id);
      if (!response.success) {
        setDelErr(response.error);
        return;
      }
      setDelErr("");
      onDelete();
    } catch (err) {
      console.log(err);
      setDelErr("Something went wrong");
    }
    return;
  };

  const handleViewProblem = async () => {
    console.log("/u_id/p_id/view");
    navigate(`/${u_id}/${problem.problemID}/view`)
  };

  return (
    // grid grid-cols-4 gap-4
    <div className="flex flex-col lg:flex-row justify-start items-center shadow-md py-4 my-2 hover:shadow-lg dark:bg-gray-800 rounded-xl">
      <div className="w-3/5 pl-3 font-normal lg:text-xl text-lg dark:text-gray-300">
        {problem.title}
      </div>
      <div></div>
      {/* <div className="w-1/5 text-lg font-light mx-2 dark:text-white">
        {problem.tags}
      </div> */}
      <button
        className="text-base lg:text-lg p-2 mt-2 rounded-md bg-green-600 hover:bg-green-700 text-white mx-2 dark:text-gray-200"
        onClick={() => handleViewProblem(problem.problemID)}
      >
        View
      </button>
      <button
        className="text-base lg:text-lg p-2 mt-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white mx-2 dark:text-gray-200 disabled:bg-gray-300"
        disabled
        // onClick={() => handleSolveProblem(problem.problemID)}
      >
        Modify
      </button>
      <button
        className="text-base lg:text-lg p-2 mt-2 rounded-md bg-red-500 hover:bg-red-600 text-white mx-2 dark:text-gray-200"
        onClick={() => handleDeleteProblem(problem.problemID)}
      >
        Delete
      </button>
    </div>
  );
}
