const { detectFromBuffer } = require('../services/aiService');

exports.detectImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    const result = await detectFromBuffer(
      req.file.buffer,
      req.file.originalname || 'upload.jpg'
    );
    res.json(result);
  } catch (error) {
    res.status(502).json({
      error: error.message,
      hint: 'Ensure Python is installed: py -m pip install -r aiModel/requirements.txt',
    });
  }
};
