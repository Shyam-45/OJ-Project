import User from "../models/User.js";
import Problem from "../models/Problem.js";

export const toggleBookmark = async (req, res) => {
  const userId = req.userId;
  const { problemId } = req.params;

  try {
    const user = await User.findOne({ userID: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyBookmarked = user.bookmarkedProblems.includes(problemId);

    if (alreadyBookmarked) {
      user.bookmarkedProblems.pull(problemId);
    } else {
      user.bookmarkedProblems.push(problemId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      bookmarked: !alreadyBookmarked,
      message: alreadyBookmarked ? "Bookmark removed" : "Bookmark added",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBookmarkedProblems = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findOne({ userID: userId });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const problems = await Problem.find({
      problemID: { $in: user.bookmarkedProblems },
    });

    res.status(200).json(problems);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
