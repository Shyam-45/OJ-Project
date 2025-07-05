import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const fetchBookmarkedProblems = async () => {
  try {
    const res = await axios.get(`${backend_url}/bookmark`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    // console.error("Failed to fetch bookmarks", err);
    return [];
  }
};

export const toggleBookmark = async (problemId) => {
  try {
    const res = await axios.put(
      `${backend_url}/bookmark/${problemId}`,
      {},
      { withCredentials: true }
    );
    return res.data.bookmarked;
  } catch (err) {
    // console.error("Failed to toggle bookmark", err);
    return null;
  }
};

export const isProblemBookmarked = async (problemId) => {
  try {
    const bookmarks = await fetchBookmarkedProblems();
    // console.log(bookmarks);
    return bookmarks.some((p) => p._id === problemId);
  } catch (err) {
    return false;
  }
};
