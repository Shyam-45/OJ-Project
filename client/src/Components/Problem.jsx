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
    <div className="bg-white rounded-lg shadow p-6 m-4 flex flex-col md:flex-row items-center justify-between transition hover:shadow-lg">
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-bold text-gray-900">{problem.title}</h3>
      </div>
      <button
        className="mt-4 md:mt-0 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        onClick={() => handleSolveProblem(problem.problemID)}
      >
        Solve
      </button>
    </div>
  );
}
