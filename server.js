const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./server/routes/userRoutes');
const carRoutes = require('./server/routes/carRoutes');
const session = require('express-session');
const app = express();
const PORT = 5000;
const fs   = require("fs/promises");  
const path = require("path");        
const ocr = require("node-tesseract-ocr"); 
const os = require("os");
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./server/routes/userRoutes'));
app.use('/api/cars', require('./server/routes/carRoutes'));
const cfg = {
  lang: "eng",
  oem : 1,              // LSTM only
  psm : 7,              // Treat image as a single text line
  tessedit_char_whitelist: "0123456789ABCDEFGHJKLMNPRSTUVWXYZ"
};
app.post('/api/vin-ocr', async function (req, res) {
   try {
   
    const { image } = req.body;                      
    const b64 = image.split(",")[1];
    const buf = Buffer.from(b64, "base64");
    const uuid = crypto.randomUUID(); 
    const tmpPath = path.join(os.tmpdir(), `${uuid}.jpg`);
    await fs.writeFile(tmpPath, buf);

    const rawText = await ocr.recognize(tmpPath, cfg);
    console.log(rawText);
    const vin = rawText       

    await fs.unlink(tmpPath);
    console.log("VIN:", vin);
    return res.json({ vin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OCR failed" });
  }
});
app.get('/dashboard', function (req, res) {
  try {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error." });
  }
});
app.use(session({ secret: 'dasdasfsdkgfpldgkldfkgl', cookie: { maxAge: 60000 }}))
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connect
mongoose.connect('mongodb://localhost:27017/mygarage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
