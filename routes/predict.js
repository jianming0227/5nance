const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');

// MongoDB config
const MONGODB_URI = process.env.MONGO_URI;;
const DB_NAME = 'investmentDB';
const COLLECTION_NAME = 'strategies';


// ======================= POST /api/predict ========================
router.post("/predict", async (req, res) => {
  const profileData = req.body;

  if (!profileData || Object.keys(profileData).length === 0) {
    return res.status(400).json({ message: 'Missing or empty profile data' });
  }

  const tempFileName = `temp_${uuidv4()}.json`;
  const tempFilePath = path.join(__dirname, '..', 'frontend', 'AI', tempFileName);
  const scriptPath = path.join(__dirname, '..', 'frontend', 'AI', 'predict.py');
  const pythonExecutable = process.env.PYTHON_PATH || 'python3';
  console.log("🐍 Using Python executable:", pythonExecutable);

  try {
    await fs.promises.writeFile(tempFilePath, JSON.stringify(profileData));

    const command = `${pythonExecutable} "${scriptPath}" "${tempFilePath}"`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error('❌ Python error output:', stderr);
      return res.status(500).json({ message: 'Python script error', stderr });
    }

    let prediction;
    try {
      prediction = JSON.parse(stdout);
    } catch (parseErr) {
      console.error('❌ Failed to parse Python stdout as JSON:', stdout);
      return res.status(500).json({ message: 'Python output is not valid JSON', error: parseErr.message });
    }

    res.json({
      message: 'Strategy generated successfully',
      strategy: prediction
    });
    console.log('✅ Prediction from Python:', prediction);

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Prediction failed', error: error.message });
  } finally {
    await fs.promises.unlink(tempFilePath).catch(err => {
      console.warn(`⚠️ Failed to delete temp file: ${tempFilePath}`, err);
    });
  }
});


// ======================= POST /api/customize ========================
console.log("🧭 Using MongoDB URI:", MONGODB_URI);

router.post('/customize', async (req, res) => {
  const { risk_tolerance, duration_year } = req.body;

  try {
    const duration = Number(duration_year);
    if (isNaN(duration)) {
      return res.status(400).json({ message: 'Invalid duration_year value' });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const strategiesCollection = db.collection(COLLECTION_NAME);

    const minYear = duration - 1;
    const maxYear = duration + 1;

    console.log("🔍 Searching strategies with:", {
      risk_level: risk_tolerance,
      duration_years: { $gte: minYear, $lte: maxYear }
    });

    const allDocs = await strategiesCollection.find().toArray();
    console.log("📄 All strategies in DB:", allDocs);

    // Now apply the filter manually (for debugging)
    const matchedStrategies = await strategiesCollection.find({
    risk_level: risk_tolerance,
    duration_years: { $gte: minYear, $lte: maxYear }
    }).toArray();

    console.log("🎯 Matched strategies:", matchedStrategies);
    
    if (matchedStrategies.length === 0) {
      return res.status(404).json({ message: 'No matching strategies found.' });
    }

    const strategy = matchedStrategies[Math.floor(Math.random() * matchedStrategies.length)];

    res.status(200).json({
      message: 'Customized strategy generated successfully',
      strategy,
    });
  } catch (error) {
    console.error('Error in /api/customize:', error);
    res.status(500).json({ message: 'Failed to get customized strategy', error: error.message });
  }
});


module.exports = router;
