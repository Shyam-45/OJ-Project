import fs from "fs";
import path from "path";
import os from "os";
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

export const executeCpp = async (filePath, sampleInputContent) => {
  const jobId = path.basename(filePath).split(".")[0];
  const exeFileName = `${jobId}.exe`;
  const exeFile = path.join(dirOutput, exeFileName);

  const inputFilePath = path.join(os.tmpdir(), `${jobId}_input.txt`);

  try {
    fs.writeFileSync(inputFilePath, sampleInputContent);

    const compileCommand = `g++ ${filePath} -o ${exeFile}`;
    console.log(`Compiling with: ${compileCommand}`);
    await exec(compileCommand);

    const runCommand = `"${exeFile}" < "${inputFilePath}"`;
    console.log(`Running with: ${runCommand}`);
    const { stdout, stderr } = await exec(runCommand);

    if (stderr) {
      console.error(`Standard error: ${stderr}`);
    }

    return { success: true, message: stdout };

  } catch (err) {
    console.error(`Code execution failed: ${err.message}`);
    return { success: false, error: err.message };
  } finally {
    if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
    // if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
  }
};
