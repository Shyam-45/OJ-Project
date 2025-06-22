import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div>
      <main className="container mx-auto pt-28 pb-16 px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-700 dark:text-gray-300">
          Welcome back, {userId}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 dark:bg-gray-800 bg-white hover:bg-gray-50 dark:hover:bg-gray-700`}
            onClick={() => navigate("/problems")}
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900`}
              >
                <i
                  className={`fas fa-search-plus text-2xl text-indigo-600 dark:text-indigo-300`}
                ></i>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                Solve new problems
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-300">
              Explore Problems
            </h2>
            <p className={`mb-6 text-gray-600 dark:text-gray-300`}>
              Discover coding challenges across different difficulty levels and
              categories.
            </p>
            <div className="flex items-center">
              <span className={`text-base  text-blue-600 dark:text-blue-400`}>
                Browse challenges
              </span>
            </div>
          </div>

          <div className="cursor-not-allowed transition-all duration-300 opacity-50">
            <div
              className={`rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700`}
              onClick={() => navigate("#")}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900`}
                >
                  <i
                    className={`fas fa-clipboard-list text-2xl text-purple-600dark:text-purple-300`}
                  ></i>
                </div>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  Recent submissions
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-300">
                View Submissions
              </h2>
              <p className={`mb-6 text-gray-600 dark:text-gray-300`}>
                Review your previous code submissions, solutions, and
                performance metrics.
              </p>
              <div className="flex items-center">
                <span className={`text-base text-blue-600 dark:text-blue-400`}>
                  See your history
                </span>
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700`}
            onClick={() => navigate("/compiler")}
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900`}
              >
                <i
                  className={`fas fa-terminal text-2xl text-green-600 dark:text-green-300`}
                ></i>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                Ready to code
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-300">
              Go to Compiler
            </h2>
            <p className={`mb-6 text-gray-600 dark:text-gray-300`}>
              Access our powerful online compiler with support for multiple
              programming languages.
            </p>
            <div className="flex items-center">
              <span className={`text-base text-blue-600 dark:text-blue-400`}>
                Start coding
              </span>
            </div>
          </div>

          <div className="cursor-not-allowed transition-all duration-300 opacity-50">
            <div
              className={`rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700`}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900`}
                >
                  <i className="fas fa-bookmark text-2xl text-yellow-500 dark:text-yellow-400" />
                </div>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                  Saved Challenges
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-300">
                Visit Bookmarked Problems
              </h2>
              <p className={`mb-6 text-gray-600 dark:text-gray-300 `}>
                Browse your saved problems and quickly revisit your toughest
                challenges.
              </p>
              <div className="flex items-center">
                <span className={`text-base text-blue-600 dark:text-blue-400`}>
                  Revisit problems
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
