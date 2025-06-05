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

const dirOutput = path.join(__dirname, "output");

if (!fs.existsSync(dirOutput)) {
  fs.mkdirSync(dirOutput, { recursive: true });
}

export const executeJs = async (filePath, sampleInputContent) => {
  const jobId = path.basename(filePath).split(".")[0];
    const inputFilePath = path.join(os.tmpdir(), `${jobId}_input.txt`);

  try {
      fs.writeFileSync(inputFilePath, sampleInputContent);
  
      const runCmd = `node ${filePath} < "${inputFilePath}"`;
      console.log(`Running Javascript with: ${runCmd}`);
      const { stdout, stderr } = await exec(runCmd);
  
      if (stderr) {
        console.error(`Standard error: ${stderr}`);
        return { success: false, error: stderr };
      }
  
      return { success: true, message: stdout };
    } catch (err) {
      console.error(`Javascript Execution failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
    }
};
