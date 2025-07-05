import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo, getUserProblem } from "../services/user";
import { deleteProblem } from "../services/problem";
import ProfileProblem from "../components/ProfileProblem";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [delError, setDelErr] = useState("");
  const { userID } = useParams();
  const [userInfo, setUserInfo] = useState({
    name: "",
    userID: "",
    email: "",
  });
  const [problemList, setProblemList] = useState([]);
  useEffect(() => {
    async function userInfoFunc() {
      const res = await getUserInfo(userID);
      if (res.success) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          name: res.name,
          userID: res.userID,
          email: res.email,
        }));
      }
      return;
    }
    async function userProblem() {
      const response = await getUserProblem(userID);
      if (response.success) {
        setProblemList(response.problems);
      }
    }

    userInfoFunc();
    userProblem();
  }, [userID]);

  const admin_id = import.meta.env.VITE_ADMIN_ID;
  const isAdmin = admin_id === userID;

  const handleDeleteProblem = async (p_id) => {
    try {
      const response = await deleteProblem(p_id, userID);
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

  const removeProblemFromList = (deletedProblemID) => {
    setProblemList((prevList) =>
      prevList.filter((p) => p.problemID !== deletedProblemID)
    );
  };

  const newProblemButton = () => {
    navigate(`/${userID}/addproblem`);
    return;
  };

  return (
    <div className="mt-12 lg:mt-16 dark:bg-gray-950">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 sm:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10">
          <div className="flex gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold">{userInfo.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                @{userInfo.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">User ID</p>
                  <p>{userInfo.userID}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-nowrap pr-8">{userInfo.email}</p>
                </div>
                {/* <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p>
                    {new Date(userInfo.createdAt).toLocaleDateString("en-CA")}
                  </p>
                </div> */}
                {/* <div>
                  <p className="text-gray-500 dark:text-gray-400">Problems</p>
                  <p>{problemList.length}</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Problems
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage your created problems
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition"
              onClick={newProblemButton}
            >
              Add Problem
            </button>
          </div>
        )}

        {isAdmin && (
          <div>
            {problemList.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  No problems added yet.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {problemList.map((problem) => (
                  <ProfileProblem
                    key={problem.problemID}
                    problem={problem}
                    u_id={userID}
                    onDelete={() => removeProblemFromList(problem.problemID)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
