import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// Get __filename and __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirOutput = path.join(__dirname, "output");
const dirInput = path.join(__dirname, "input");

fs.mkdir(dirOutput, { recursive: true });
fs.mkdir(dirInput, { recursive: true });

const max_source_code_size = 50 * 1024; // 50 KB
const time_limit = 1000; // 1 second

function spawnWithCapture(command, args, inputBuffer = null) {
  let killedForTimeout = false;

  // Start the child:
  const proc = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });

  // If inputBuffer is given, write it to stdin and close stdin:
  if (inputBuffer) {
    proc.stdin.write(inputBuffer);
  }
  proc.stdin.end();

  let stdout = "";
  let stderr = "";
  proc.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  proc.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  // Promise that resolves when the child exits:
  const promise = new Promise((resolve) => {
    proc.on("close", (code) => {
      resolve({ code, stdout, stderr, killedForTimeout });
    });
  });

  // Attach a helper to kill for timeout:
  proc.killForTimeout = () => {
    killedForTimeout = true;
    proc.kill("SIGKILL");
  };

  return { procRef: proc, promise };
}

export const executeJava = async (filePath, sampleInputContent) => {
  const jobId = path.basename(filePath).split(".")[0];
  const exeFileName = `${jobId}.exe`;
  const exeFile = path.join(dirOutput, exeFileName);
  const inputFilePath = path.join(dirInput, `${jobId}_input.txt`);

  try {
    const stats = await fs.stat(filePath);
    if (stats.size > max_source_code_size) {
      return {
        success: false,
        error: `Source file limit exceeded`,
      };
    }

    await fs.writeFile(inputFilePath, sampleInputContent);

    const inputBuffer = await fs.readFile(inputFilePath);
    const { procRef: runProc, promise: runPromise } = spawnWithCapture(
      "java",
      [filePath],
      inputBuffer
    );

    const timer = setTimeout(() => {
      runProc.killForTimeout();
    }, time_limit);

    // Wait for the process to exit (either normally or by our function):
    const { code, stdout, stderr, killedForTimeout } = await runPromise;

    clearTimeout(timer);

    if (killedForTimeout) {
      return { success: false, error: "Time limit exceeded" };
    }
    if (code !== 0) {
      return { success: false, error: stderr || `Exited with code ${code}` };
    }
    return { success: true, message: stdout };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    await Promise.all([
      fs.unlink(inputFilePath).catch(() => {}),
      fs.unlink(exeFile).catch(() => {}),
    ]);
  }
};
