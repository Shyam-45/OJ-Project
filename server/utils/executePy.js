import { exec as execCallback } from "child_process";
import { promisify } from "util";

const exec = promisify(execCallback);

export const executePy = async (filePath) => {
  const command = `python ${filePath}`;

  try {
    const { stdout, stderr } = await exec(command);

    if (stderr) {
      console.error(`Standard error (warnings or errors): ${stderr}`);
      return { success: false, error: stderr };
    }

    return { success: true, message: stdout };
  } catch (err) {
    console.error(`Code Execution failed: ${err.message}`);
    return { success: false, error: err.message };
  }
};
