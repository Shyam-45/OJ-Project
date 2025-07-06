import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faEye,
  faEdit,
  faTrash,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteProblem } from "../Services/problem";

export default function ProfileProblem({ problem, u_id, onDelete }) {
  const navigate = useNavigate();
  const [delError, setDelErr] = useState("");

  const handleDeleteProblem = async (p_id) => {
    try {
      const response = await deleteProblem(p_id, u_id);
      if (!response.success) {
        setDelErr(response.error);
        return;
      }
      setDelErr("");
      onDelete();
    } catch (err) {
      setDelErr("Something went wrong");
    }
    return;
  };

  const handleViewProblem = async () => {
    navigate(`/${u_id}/${problem.problemID}/view`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col gap-3 border border-gray-200 dark:border-gray-700 transition hover:shadow-xl">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-lg">{problem.title}</h4>
        {problem.tags}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <FontAwesomeIcon icon={faCalendar} className="h-3 w-3" />
        Created on {new Date(problem.createdAt).toLocaleDateString("en-CA")}
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          className="flex-1 text-sm border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleViewProblem}
        >
          <FontAwesomeIcon icon={faEye} className="mr-1" /> View
        </button>
        <button
          className="flex-1 text-sm border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-500"
          disabled
        >
          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
        </button>
        <button
          className="text-red-600 border border-red-300 dark:border-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40"
          onClick={() => handleDeleteProblem(problem.problemID)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}
