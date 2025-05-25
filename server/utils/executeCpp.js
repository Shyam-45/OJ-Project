import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec as execCallback } from "child_process";
import { promisify } from "util";

const exec = promisify(execCallback);

// Get __filename and __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirOutput = path.join(__dirname, "outputs");

if (!fs.existsSync(dirOutput)) {
  fs.mkdirSync(dirOutput, { recursive: true });
}

export const executeCpp = async (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const exeFileName = `${jobId}.exe`;
  const exeFile = path.join(dirOutput, exeFileName);
  console.log(`Printing exec file path: ${exeFile}`);
  const command = `g++ ${filePath} -o ${exeFile} && cd ${dirOutput} && .\\${exeFileName}`;

  try {
    const { stdout, stderr } = await exec(command);

    if (stderr) {
      console.error(`Standard error (warnings or errors): ${stderr}`);
      return { success: false, error: stderr };
    }

    return { success: true, message: stdout };
  } catch (err) {
    // This is where actual errors like compilation failure will be caught
    console.error(`Code Execution failed: ${err.message}`);
    return { success: false, error: err.message };
  }
};
