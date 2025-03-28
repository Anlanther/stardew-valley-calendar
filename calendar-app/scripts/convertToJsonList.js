import { readdirSync, readFileSync, writeFileSync } from "fs";

const CWD = process.cwd();
const SOURCE_DIR = "../sample-downloads";
const TARGET_DIR = `${CWD}/src/app/constants/sampleCalendars.json`;

function createSampleCalendars() {
  const fileNames = getFileNames();
  const calendarsJson = convertToJsonList(fileNames);
  writeToFile(calendarsJson);
}

function getFileNames() {
  return readdirSync(SOURCE_DIR);
}

function convertToJsonList(calendarTexts) {
  const jsonList = JSON.stringify(
    calendarTexts.reduce((acc, fileName) => {
      const fileContent = readFileSync(`${SOURCE_DIR}/${fileName}`, "utf8");
      acc.push(JSON.parse(fileContent));
      return acc;
    }, []),
  );
  return jsonList;
}

function writeToFile(jsonList) {
  writeFileSync(TARGET_DIR, jsonList);
}

createSampleCalendars();
