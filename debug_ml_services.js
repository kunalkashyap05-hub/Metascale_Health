const liverService = require('./healthapp/backend/src/services/liverPredictionService');
const diabetesService = require('./healthapp/backend/src/services/diabetesPredictionService');

const testLiver = async () => {
  console.log('--- TESTING LIVER SERVICE ---');
  const sampleData = {
    age: 45,
    gender: 'male',
    totalBilirubin: 1.5,
    directBilirubin: 0.5,
    alkalinePhosphotase: 150,
    alamineAminotransferase: 60,
    aspartateAminotransferase: 70,
    totalProteins: 7.0,
    albumin: 3.6,
    albuminGlobulinRatio: 1.0
  };
  try {
    const result = await liverService.predict(sampleData);
    console.log('LIVER RESULT:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('LIVER FAILED:', err);
  }
};

const testDiabetes = async () => {
  console.log('\n--- TESTING DIABETES SERVICE ---');
  const sampleData = {
    ageGroup: '40-49',
    gender: 'male',
    familyDiabetes: 'yes',
    highBP: 'yes',
    physicallyActive: 'one hr or more',
    bmi: 28.5,
    smoking: 'no',
    alcohol: 'no',
    sleepHours: 8,
    soundSleep: 6,
    regularMedicine: 'no',
    junkFood: 'occasionally',
    stress: 'sometimes',
    bpLevel: 'normal',
    pregnancies: 0,
    prediabetes: 'no',
    urinationFreq: 'not much'
  };
  try {
    const result = await diabetesService.predict(sampleData);
    console.log('DIABETES RESULT:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('DIABETES FAILED:', err);
  }
};

const run = async () => {
  await testLiver();
  await testDiabetes();
};

run();
