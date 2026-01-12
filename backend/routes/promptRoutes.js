const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { processText, processPDF, processWord, processImage, processCombined } = require('../utils/fileProcessors');
const { refinePrompt } = require('../utils/promptRefiner');
const RefinedPrompt = require('../models/RefinedPrompt');
const { body, validationResult } = require('express-validator');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, Word documents, and text files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

/**
 * POST /api/prompt/refine
 * Refine a prompt from various input types
 */
router.post('/refine',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'documents', maxCount: 5 },
    { name: 'text', maxCount: 1 }
  ]),
  [
    body('textContent').optional().isString().trim()
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if at least one input is provided
      const hasText = req.body.textContent && req.body.textContent.trim().length > 0;
      const hasImages = req.files && req.files.images && req.files.images.length > 0;
      const hasDocuments = req.files && req.files.documents && req.files.documents.length > 0;

      if (!hasText && !hasImages && !hasDocuments) {
        return res.status(400).json({
          error: 'At least one input (text, image, or document) is required'
        });
      }

      const sourceTypes = [];
      const inputs = [];

      // Process text input
      if (hasText) {
        sourceTypes.push('text');
        const textData = await processText(req.body.textContent);
        inputs.push({ type: 'text', content: textData.content });
      }

      // Process images
      if (hasImages) {
        sourceTypes.push('image');
        for (const image of req.files.images) {
          const imageData = await processImage(image.path);
          imageData.path = image.path;
          inputs.push({ type: 'image', path: image.path, data: imageData });
        }
      }

      // Process documents
      if (hasDocuments) {
        for (const doc of req.files.documents) {
          const ext = path.extname(doc.originalname).toLowerCase();
          let docData;

          if (ext === '.pdf') {
            sourceTypes.push('pdf');
            docData = await processPDF(doc.path);
            docData.path = doc.path;
            inputs.push({ type: 'pdf', path: doc.path, data: docData });
          } else if (ext === '.docx' || ext === '.doc') {
            sourceTypes.push('word');
            docData = await processWord(doc.path);
            docData.path = doc.path;
            inputs.push({ type: 'word', path: doc.path, data: docData });
          }
        }
      }

      // Combine all inputs
      const processedData = await processCombined(inputs);

      // Refine the prompt
      const refinedPrompt = refinePrompt(processedData, [...new Set(sourceTypes)]);

      // Save to database
      const savedPrompt = await RefinedPrompt.create(refinedPrompt);

      // Clean up uploaded files (optional - you might want to keep them)
      // Uncomment if you want to delete files after processing
      // if (hasImages) {
      //   for (const image of req.files.images) {
      //     await fs.unlink(image.path).catch(() => {});
      //   }
      // }
      // if (hasDocuments) {
      //   for (const doc of req.files.documents) {
      //     await fs.unlink(doc.path).catch(() => {});
      //   }
      // }

      res.status(201).json({
        success: true,
        refinedPrompt: savedPrompt,
        message: 'Prompt refined successfully'
      });

    } catch (error) {
      console.error('Refinement error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to refine prompt'
      });
    }
  }
);

/**
 * GET /api/prompt/:id
 * Get a refined prompt by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const prompt = await RefinedPrompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({
      success: true,
      refinedPrompt: prompt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/prompt
 * Get all refined prompts
 */
router.get('/', async (req, res) => {
  try {
    const prompts = await RefinedPrompt.find().sort({ createdAt: -1 }).limit(50);
    
    res.json({
      success: true,
      count: prompts.length,
      refinedPrompts: prompts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/prompt/:id
 * Delete a refined prompt
 */
router.delete('/:id', async (req, res) => {
  try {
    const prompt = await RefinedPrompt.findByIdAndDelete(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({
      success: true,
      message: 'Prompt deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

