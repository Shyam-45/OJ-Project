import { useNavigate } from "react-router-dom";

export default function Problem({ problem }) {
  const navigate = useNavigate();

  const handleSolveProblem = (id) => {
    console.log(`Problem with problem id: ${id} clicked`);
    // if (!isLoggedIn) {
    //   alert("Please log in first!");
    //   navigate("/login");
    //   return;
    // }

    navigate(`/problem/${problem.problemID}`);

    // Here we will show compiler page
  };

  return (
    <div className="m-4 p-4 w-full max-w-md border border-gray-300 rounded shadow-sm flex items-center">
      <div className="w-3/5 border border-green-600">
        <span className="text-lg font-medium">{problem.title}</span>
      </div>
      <div className="w-1/5"></div>
      <button
        className="w-1/5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => handleSolveProblem(problem.problemID)}
      >
        Solve
      </button>
    </div>
  );
}
