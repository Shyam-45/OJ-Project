import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// Get __filename and __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCode = path.join(__dirname, "codes");

if (!fs.existsSync(dirCode)) {
  fs.mkdirSync(dirCode, { recursive: true });
}

export const generateFile = (language, code) => {
  const uniqueId = uuidv4();
  const fileName = `${uniqueId}.${language}`;
  const filePath = path.join(dirCode, fileName);
  console.log(`Printing code file path: ${filePath}`);
  fs.writeFileSync(filePath, code);
  return filePath;
};
