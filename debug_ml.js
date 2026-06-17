const { execFile } = require('child_process');
const path = require('path');

const features = {
  ageGroup: "40-49",
  gender: "male",
  familyDiabetes: true,
  highBP: false,
  physicallyActive: "none",
  bmi: 25,
  smoking: false,
  alcohol: false,
  sleepHours: 7,
  soundSleep: 6,
  regularMedicine: false,
  junkFood: "often",
  stress: "sometimes",
  bpLevel: "normal",
  pregnancies: 0,
  prediabetes: false,
  urinationFreq: "notMuch"
};

const pythonPath = path.join(__dirname, 'venv/bin/python');
const scriptPath = path.join(__dirname, 'healthapp/backend/scripts/inference.py');

console.log("Python Path:", pythonPath);
console.log("Script Path:", scriptPath);

execFile(pythonPath, [scriptPath, 'diabetes', JSON.stringify(features)], (error, stdout, stderr) => {
  if (error) {
    console.error("ERROR:", error);
    console.error("STDERR:", stderr);
    return;
  }
  console.log("STDOUT:", stdout);
});
