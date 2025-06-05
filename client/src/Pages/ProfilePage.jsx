import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo, getUserProblem } from "../Services/user";
import ProfileProblem from "../Components/ProfileProblem";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [userInfo, setUserInfo] = useState({
    name: "",
    userID: "",
    email: "",
  });
  const [problemList, setProblemList] = useState([]);
  console.log(userID);

  useEffect(() => {
    async function userInfoFunc() {
      const res = await getUserInfo(userID);
      console.log(res);
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
    <div className="main_div m-4 p-4">
      <div className="m-2 border-4 inline-block min-w-[300px] border-yellow-300">
        <div className="flex flex-row mb-2">
          <h3 className="font-normal text-xl px-2">Name: </h3>
          <h3 className="font-medium text-xl">{userInfo.name}</h3>
        </div>
        <div className="flex flex-row mb-2">
          <h3 className="font-normal text-xl px-2">Email: </h3>
          <h3 className="font-medium text-xl">{userInfo.email}</h3>
        </div>
        <div className="flex flex-row mb-2">
          <h3 className="font-normal text-xl px-2">User id: </h3>
          <h3 className="font-medium text-xl">{userInfo.userID}</h3>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center w-[300px] lg:w-[350px] my-4 mx-2 border-4 border-indigo-500">
        <h3 className="font-semibold text-xl p-2">Add a new problem</h3>
        <button
          type="button"
          className="border-2 text-lg px-2 my-2 bg-indigo-600 hover:bg-indigo-700 text-white mx-2 dark:text-gray-200"
          onClick={newProblemButton}
        >
          Click here
        </button>
      </div>

      <div className="min-h-screen bg-gray-50 py-8 px-4 dark:bg-gray-600 border-4">
        <h3 className="font-semibold text-xl p-2">Previously added problems</h3>
        <div className="max-w-7xl mx-auto">
          {problemList.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {problemList.map((item) => (
                <ProfileProblem
                  key={item.problemID}
                  problem={item}
                  u_id={userID}
                  onDelete={() => removeProblemFromList(item.problemID)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-white text-lg font-medium">
                You are yet to add your 1st problem.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
