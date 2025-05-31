import { useNavigate } from "react-router-dom";

export default function Problem({ problem }) {
  const navigate = useNavigate();

  const handleSolveProblem = (id) => {
    navigate(`/problem/${problem.problemID}`);
  };

  return (
    <div className="flex justify-start items-center shadow-md py-4 my-2 hover:shadow-lg dark:bg-gray-800 rounded-xl">
      <div className="w-3/5 pl-3 font-normal text-xl dark:text-gray-300">
        {problem.title}
      </div>
      <div className="w-1/5 text-lg font-light mx-2 dark:text-white">
        {problem.tags}
      </div>
      <button
        className="w-1/5 text-xl py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white mx-2 dark:text-gray-200"
        onClick={() => handleSolveProblem(problem.problemID)}
      >
        solve
      </button>
    </div>
  );
}
