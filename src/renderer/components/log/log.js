const fs = require("fs");
const path = require("path");

/**
 * Append a log message to a log file. If the file does not exist, it will be created.
 *
 * @param {string} logMessage - The log message to append.
 * @param {string} logFilePath - The path of the log file.
 * @returns {Promise<void>} - A promise that resolves when the log message has been appended.
 */
export function appendLog(logMessage, logFilePath) {
  logFilePath += "/log.txt";
  console.log(logFilePath);
  return new Promise((resolve, reject) => {
    // Ensure the directory for the log file exists
    const logDir = path.dirname(logFilePath);
    fs.mkdir(logDir, { recursive: true }, (err) => {
      if (err && err.code !== "EEXIST") {
        reject(err);
      } else {
        // Append the log message to the log file
        const localTime = new Date().toLocaleString();
        const logEntry = `${localTime} - ${logMessage}\n`;
        fs.appendFile(logFilePath, logEntry, "utf8", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}
/*
// Example usage
const logMessage = "This is a test log message";
const logFilePath = "./logs/logfile.log";

appendLog(logMessage, logFilePath)
  .then(() => {
    console.log("Log message appended successfully");
  })
  .catch((error) => {
    console.error("Error appending log message:", error.message);
  });
*/
