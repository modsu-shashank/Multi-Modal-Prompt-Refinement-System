const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const path = require('path');

/**
 * Text Processor
 * Extracts and cleans text from plain text inputs
 */
async function processText(textContent) {
  if (!textContent || typeof textContent !== 'string') {
    throw new Error('Invalid text content');
  }

  return {
    content: textContent.trim(),
    wordCount: textContent.split(/\s+/).length,
    type: 'text'
  };
}

/**
 * PDF Processor
 * Extracts text content from PDF files
 */
async function processPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    return {
      content: pdfData.text,
      pageCount: pdfData.numpages,
      metadata: pdfData.info,
      wordCount: pdfData.text.split(/\s+/).length,
      type: 'pdf'
    };
  } catch (error) {
    throw new Error(`PDF processing error: ${error.message}`);
  }
}

/**
 * Word Document Processor
 * Extracts text from .docx files
 */
async function processWord(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    
    return {
      content: result.value,
      messages: result.messages,
      wordCount: result.value.split(/\s+/).length,
      type: 'word'
    };
  } catch (error) {
    throw new Error(`Word document processing error: ${error.message}`);
  }
}

/**
 * Image Processor with OCR
 * Extracts text from images and analyzes visual elements
 */
async function processImage(filePath) {
  try {
    // Perform OCR on the image
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: m => {} // Suppress logs
    });

    // Analyze image properties
    const imageMetadata = await sharp(filePath).metadata();
    
    // Extract dominant colors (simplified approach)
    const stats = await sharp(filePath)
      .resize(200, 200, { fit: 'inside' })
      .stats();
    
    const dominantColors = stats.channels.map((channel, index) => {
      return {
        channel: ['red', 'green', 'blue', 'alpha'][index],
        mean: Math.round(channel.mean)
      };
    });

    return {
      ocrText: text.trim(),
      imageMetadata: {
        width: imageMetadata.width,
        height: imageMetadata.height,
        format: imageMetadata.format,
        hasAlpha: imageMetadata.hasAlpha
      },
      dominantColors: dominantColors.slice(0, 3), // RGB only
      wordCount: text.split(/\s+/).length,
      type: 'image'
    };
  } catch (error) {
    throw new Error(`Image processing error: ${error.message}`);
  }
}

/**
 * Combined Processor
 * Processes multiple input types and merges results
 */
async function processCombined(inputs) {
  const results = {
    textContent: '',
    images: [],
    documents: [],
    combinedText: ''
  };

  for (const input of inputs) {
    if (input.type === 'text') {
      const processed = await processText(input.content);
      results.textContent += processed.content + '\n\n';
    } else if (input.type === 'image') {
      const processed = await processImage(input.path);
      results.images.push(processed);
      results.combinedText += `[Image OCR]: ${processed.ocrText}\n\n`;
    } else if (input.type === 'pdf') {
      const processed = await processPDF(input.path);
      results.documents.push(processed);
      results.combinedText += `[PDF Content]: ${processed.content}\n\n`;
    } else if (input.type === 'word') {
      const processed = await processWord(input.path);
      results.documents.push(processed);
      results.combinedText += `[Word Content]: ${processed.content}\n\n`;
    }
  }

  results.combinedText += results.textContent;
  
  return results;
}

module.exports = {
  processText,
  processPDF,
  processWord,
  processImage,
  processCombined
};

