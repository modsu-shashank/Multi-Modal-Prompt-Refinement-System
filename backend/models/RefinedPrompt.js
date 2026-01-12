const mongoose = require('mongoose');

/**
 * Refined Prompt Schema
 * 
 * This schema represents the standardized output structure for refined prompts.
 * Design Rationale:
 * - Separates core intent from technical details for better downstream processing
 * - Includes metadata for traceability and quality assessment
 * - Supports partial information with confidence scores
 * - Allows for extensibility through customFields
 */
const refinedPromptSchema = new mongoose.Schema({
  // Core Product Information
  coreIntent: {
    purpose: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    targetAudience: {
      type: String,
      default: null
    }
  },

  // Functional Requirements
  functionalRequirements: {
    primaryFeatures: [{
      feature: String,
      description: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
      }
    }],
    userInteractions: [{
      type: String
    }],
    expectedBehaviors: [{
      type: String
    }]
  },

  // Technical Constraints
  technicalConstraints: {
    platform: {
      type: String,
      default: null
    },
    technologies: [{
      type: String
    }],
    performance: {
      type: String,
      default: null
    },
    compatibility: [{
      type: String
    }],
    limitations: [{
      type: String
    }]
  },

  // Expected Outputs and Deliverables
  deliverables: {
    outputs: [{
      type: {
        type: String,
        enum: ['code', 'design', 'documentation', 'prototype', 'other']
      },
      description: String,
      format: String
    }],
    milestones: [{
      name: String,
      description: String,
      estimatedComplexity: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    }]
  },

  // Extracted Visual Information (from images)
  visualElements: {
    colors: [{
      type: String
    }],
    designStyle: {
      type: String,
      default: null
    },
    layout: {
      type: String,
      default: null
    },
    components: [{
      type: String
    }]
  },

  // Quality and Confidence Metrics
  metadata: {
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    completenessScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    sourceTypes: [{
      type: String,
      enum: ['text', 'image', 'pdf', 'word', 'combined']
    }],
    extractionMethod: {
      type: String
    },
    missingInformation: [{
      type: String
    }]
  },

  // Original Input References
  sourceInputs: {
    textContent: {
      type: String,
      default: null
    },
    imagePaths: [{
      type: String
    }],
    documentPaths: [{
      type: String
    }],
    originalFormat: {
      type: String
    }
  },

  // Custom Fields for extensibility
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
refinedPromptSchema.index({ 'coreIntent.purpose': 'text', 'coreIntent.description': 'text' });
refinedPromptSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RefinedPrompt', refinedPromptSchema);

