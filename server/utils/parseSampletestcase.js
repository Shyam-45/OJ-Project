import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export function parseSampleTestCases(inputPath, outputPath) {
  const inputStr  = fs.readFileSync(inputPath,  "utf8");
  const outputStr = fs.readFileSync(outputPath, "utf8");

  const inputLines  = inputStr.split(/\r?\n/);
  const outputLines = outputStr.split(/\r?\n/);

  const numBlocks = parseInt(inputLines[0], 10);
  let inIdx  = 1;
  let outIdx = 0;
  const result = [];

  for (let b = 0; b < numBlocks; b++) {
    const blockLen = parseInt(inputLines[inIdx], 10);

    // slice out the original block lines
    const blockLines = inputLines.slice(inIdx + 1, inIdx + 1 + blockLen);
    // now prefix the size
    const inputBlock = [blockLen, ...blockLines].join("\n");

    const outputBlock = outputLines
      .slice(outIdx, outIdx + blockLen)
      .join("\n");

    result.push({
      siofID:             uuidv4(),
      sampleInputFile:    inputBlock,
      sampleOutputFile:   outputBlock,
    });

    inIdx  += 1 + blockLen;
    outIdx += blockLen;
  }

  return result;
}
