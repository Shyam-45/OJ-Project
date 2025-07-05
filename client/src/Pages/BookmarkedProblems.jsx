// import { useNavigate } from "react-router-dom";

// export default function Problem({ problem }) {
//   const navigate = useNavigate();

//   const handleSolveProblem = (id) => {
//     navigate(`/problems/${id}`);
//   };

//   return (
//     <div className="flex justify-start items-center shadow-md py-4 my-2 hover:shadow-lg dark:bg-gray-800 rounded-xl">
//       <div className="w-3/5 pl-3 font-normal text-xl dark:text-gray-300">
//         {problem.title}
//       </div>
//       <div className="w-1/5 text-lg font-light mx-2 dark:text-white">
//         {problem.tags}
//       </div>
//       <button
//         className="w-1/5 text-xl py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white mx-2 dark:text-gray-200"
//         onClick={() => handleSolveProblem(problem.problemID)}
//       >
//         solve
//       </button>
//     </div>
//   );
// }

// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import {
// //   fetchBookmarkedProblems,
// //   toggleBookmark,
// // } from "../services/bookmark.js"; // adjust path as needed

// // export default function BookmarkedProblems() {
// //   const [bookmarks, setBookmarks] = useState([]);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     const loadBookmarks = async () => {
// //       try {
// //         const data = await fetchBookmarkedProblems();
// //         setBookmarks(data);
// //       } catch (err) {
// //         setError("Failed to fetch bookmarked problems");
// //         setBookmarks([]);
// //       }
// //     };

// //     loadBookmarks();
// //   }, []);

// //   const removeBookmark = async (problemId) => {
// //     try {
// //       const data = await toggleBookmark(problemId);
// //       if (data.success) {
// //         setBookmarks((prev) =>
// //           prev.filter((problem) => problem.problemID !== problemId)
// //         );
// //       }
// //     } catch (err) {
// //       console.error("Error removing bookmark");
// //     }
// //   };

// //   if (error) return <div className="text-red-600">{error}</div>;

// //   return (
// //     <div className="mt-12 lg:mt-16 dark:bg-gray-950">
// //       <div className="max-w-5xl mx-auto p-4">
// //         <h2 className="text-3xl font-bold mb-6">Bookmarked Problems</h2>
// //         {bookmarks.length === 0 ? (
// //           <p className="text-gray-500">No bookmarked problems yet.</p>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {bookmarks.map((problem) => (
// //               <div
// //                 key={problem._id}
// //                 className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
// //               >
// //                 <div className="flex justify-between items-center mb-2">
// //                   <h3 className="text-lg font-semibold">{problem.title}</h3>
// //                   <span className="text-sm text-gray-500">{problem.tags}</span>
// //                 </div>
// //                 <div className="flex justify-between items-center mt-4">
// //                   <Link
// //                     to={`/problems/${problem._id}`}
// //                     className="text-blue-600 hover:underline"
// //                   >
// //                     Solve
// //                   </Link>
// //                   <button
// //                     onClick={() => removeBookmark(problem.problemID)}
// //                     className="text-red-600 hover:underline text-sm"
// //                   >
// //                     Remove
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

import { useEffect, useState } from "react";
import Problem from "../components/Problem.jsx";
import { getProblemList } from "../services/problem.js";
import { fetchBookmarkedProblems } from "../services/bookmark.js";

export default function ProblemPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [fetchProblem, setFetchProblem] = useState(true);
  //   const [error, setError] = useState("");

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const data = await fetchBookmarkedProblems();
        setBookmarks(data);
      } catch (err) {
        setError("Failed to fetch bookmarked problems");
      } finally {
        setFetchProblem(false);
      }
    };

    loadBookmarks();
  }, []);

  const [problemList, setProblemList] = useState([]);
  //   const [fetchProblem, setFetchProblem] = useState(true);
  const [error, setError] = useState("");

  //   useEffect(() => {
  //     async function fetchProblemList() {
  //       try {
  //         const response = await getProblemList();
  //         if (response.success) {
  //           setProblemList(response.problem_list);
  //           setError("");
  //           return;
  //         }
  //         setProblemList([]);
  //         setError(response.error);
  //       } catch (err) {
  //         console.log(`Error occurred : ${err}`);
  //         setProblemList([]);
  //         setError("Failed to get problem list");
  //       } finally {
  //         setFetchProblem(false);
  //       }
  //     }
  //     fetchProblemList();
  //   }, []);

  return (
    <div className="mt-12 lg:mt-16 dark:bg-gray-950">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300">
            Your bookmarked problems!
          </h1>
        </div>

        {/* Fetching or Error Message */}
        {fetchProblem ? (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold text-yellow-500">
              Fetching bookmarked problems...
            </h2>
          </div>
        ) : error ? (
          <div className="text-center mt-12">
            <p className="text-red-600 font-semibold text-lg">❌ {error}</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {bookmarks.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((item) => (
                  <Problem key={item.problemID} problem={item} />
                ))}
              </div>
            ) : (
              <div className="text-center mt-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  You are yet to find a challenging problem 🚀
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
