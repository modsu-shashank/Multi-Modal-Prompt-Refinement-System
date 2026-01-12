# Multi-Modal Prompt Refinement System

A comprehensive system that processes various input types (text, images, documents, or combinations) and refines them into a standardized, structured prompt format suitable for downstream AI processing.

## Features

- **Multi-Modal Input Support**: Accepts plain text, images (with OCR), PDF documents, and Word documents
- **Intelligent Extraction**: Automatically extracts core intent, functional requirements, technical constraints, and deliverables
- **Structured Output**: Transforms diverse inputs into a consistent, well-structured format
- **Quality Metrics**: Provides confidence and completeness scores for refined prompts
- **Modern UI**: Beautiful, responsive React frontend with drag-and-drop file upload
- **Validation**: Rejects irrelevant or incomplete inputs with helpful error messages

## Technology Stack

- **Frontend**: React 18, Axios, React-Dropzone, React-Toastify
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **File Processing**: 
  - PDF: pdf-parse
  - Word: mammoth
  - Images: Tesseract.js (OCR), Sharp (image processing)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment variables**:
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/prompt-refinement
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the application**:
   
   Option 1: Run both frontend and backend together:
   ```bash
   npm run dev
   ```
   
   Option 2: Run separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Using the Web Interface

1. **Text Input**: Enter your project requirements in the text area
2. **Image Upload**: Drag and drop or select images (sketches, screenshots, designs)
3. **Document Upload**: Upload PDF or Word documents with specifications
4. **Refine**: Click "Refine Prompt" to process and structure your input
5. **View Results**: Review the refined prompt with all extracted information

### API Endpoints

#### POST `/api/prompt/refine`
Refine a prompt from various input types.

**Request** (multipart/form-data):
- `textContent` (optional): Plain text description
- `images` (optional): Image files (JPEG, PNG, GIF)
- `documents` (optional): PDF or Word documents

**Response**:
```json
{
  "success": true,
  "refinedPrompt": {
    "coreIntent": { ... },
    "functionalRequirements": { ... },
    "technicalConstraints": { ... },
    "deliverables": { ... },
    "metadata": { ... }
  }
}
```

#### GET `/api/prompt/:id`
Get a refined prompt by ID.

#### GET `/api/prompt`
Get all refined prompts (limited to 50 most recent).

#### DELETE `/api/prompt/:id`
Delete a refined prompt.

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── RefinedPrompt.js     # MongoDB schema
│   ├── routes/
│   │   └── promptRoutes.js      # API routes
│   ├── utils/
│   │   ├── fileProcessors.js   # File processing utilities
│   │   └── promptRefiner.js     # Prompt refinement engine
│   ├── uploads/                 # Uploaded files (created automatically)
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.js
│   │   │   ├── RefinedPromptDisplay.js
│   │   │   └── SampleExamples.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── samples/                      # Sample input files
├── DOCUMENTATION.md              # Detailed explanation document
└── README.md                     # This file
```

## Sample Inputs

See the `samples/` directory for example inputs and their corresponding refined outputs. The web interface also includes 5 sample examples that demonstrate the refinement process.

## Documentation

For detailed information about:
- Design decisions and rationale
- Template structure justification
- Extraction strategies
- Alternative approaches considered
- AI-assisted vs. original contributions

See [DOCUMENTATION.md](./DOCUMENTATION.md)

## Error Handling

The system includes comprehensive error handling:
- **Input Validation**: Checks for minimum content length and relevance
- **File Type Validation**: Only accepts supported file formats
- **Processing Errors**: Graceful handling of file processing failures
- **User Feedback**: Clear error messages via toast notifications

## Limitations

- Image OCR accuracy depends on image quality
- PDF extraction works best with text-based PDFs (not scanned images)
- Word document processing supports .docx format primarily
- File size limit: 10MB per file

## Future Enhancements

- Support for more file formats (Excel, PowerPoint)
- Advanced NLP for better intent extraction
- Machine learning models for improved accuracy
- Batch processing capabilities
- Export refined prompts to various formats (JSON, XML, Markdown)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

