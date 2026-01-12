/**
 * Prompt Refinement Engine
 * 
 * This module transforms diverse inputs into a standardized, structured format.
 * It uses pattern matching, keyword extraction, and intelligent parsing to
 * identify and categorize information from various input types.
 */

/**
 * Extract core intent from text content
 */
function extractCoreIntent(text) {
  const intent = {
    purpose: '',
    description: '',
    targetAudience: null
  };

  // Look for purpose indicators
  const purposePatterns = [
    /(?:I want|I need|build|create|develop|design|make)\s+(?:a|an|to)\s+([^.!?]+)/i,
    /(?:goal|objective|aim|purpose)\s*:?\s*([^.!?]+)/i,
    /(?:should|must|will)\s+([^.!?]+)/i
  ];

  for (const pattern of purposePatterns) {
    const match = text.match(pattern);
    if (match) {
      intent.purpose = match[1].trim();
      break;
    }
  }

  // If no purpose found, use first sentence or first 100 chars
  if (!intent.purpose) {
    intent.purpose = text.split(/[.!?]/)[0].substring(0, 100).trim() || 'Unspecified purpose';
  }

  // Extract description (first 2-3 sentences or 300 chars)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  intent.description = sentences.slice(0, 3).join('. ').substring(0, 500).trim() || text.substring(0, 300);

  // Extract target audience
  const audiencePatterns = [
    /(?:for|target|audience|users?)\s+(?:are|is|will be|should be)\s+([^.!?]+)/i,
    /(?:end\s+)?users?\s+(?:are|will|should)\s+([^.!?]+)/i
  ];

  for (const pattern of audiencePatterns) {
    const match = text.match(pattern);
    if (match) {
      intent.targetAudience = match[1].trim();
      break;
    }
  }

  return intent;
}

/**
 * Extract functional requirements
 */
function extractFunctionalRequirements(text) {
  const requirements = {
    primaryFeatures: [],
    userInteractions: [],
    expectedBehaviors: []
  };

  // Extract features
  const featurePatterns = [
    /(?:feature|function|functionality|capability)\s*:?\s*([^.!?]+)/gi,
    /(?:should|must|needs? to|has to)\s+(?:have|include|support|provide)\s+([^.!?]+)/gi,
    /(?:supports?|includes?|provides?)\s+([^.!?]+)/gi
  ];

  const foundFeatures = new Set();
  featurePatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const feature = match[1].trim();
      if (feature.length > 5 && !foundFeatures.has(feature.toLowerCase())) {
        foundFeatures.add(feature.toLowerCase());
        requirements.primaryFeatures.push({
          feature: feature.substring(0, 200),
          description: '',
          priority: determinePriority(feature)
        });
      }
    }
  });

  // Extract user interactions
  const interactionPatterns = [
    /(?:user|users?)\s+(?:can|should|will|must)\s+([^.!?]+)/gi,
    /(?:click|tap|press|select|choose|input|enter|submit)\s+([^.!?]+)/gi
  ];

  const foundInteractions = new Set();
  interactionPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const interaction = match[1].trim();
      if (interaction.length > 3 && !foundInteractions.has(interaction.toLowerCase())) {
        foundInteractions.add(interaction.toLowerCase());
        requirements.userInteractions.push(interaction.substring(0, 150));
      }
    }
  });

  // Extract expected behaviors
  const behaviorPatterns = [
    /(?:when|if|upon)\s+([^.!?]+?)\s+(?:then|should|will|must)\s+([^.!?]+)/gi,
    /(?:system|application|app)\s+(?:should|will|must)\s+([^.!?]+)/gi
  ];

  behaviorPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const behavior = match[0].trim();
      if (behavior.length > 10) {
        requirements.expectedBehaviors.push(behavior.substring(0, 200));
      }
    }
  });

  return requirements;
}

/**
 * Extract technical constraints
 */
function extractTechnicalConstraints(text) {
  const constraints = {
    platform: null,
    technologies: [],
    performance: null,
    compatibility: [],
    limitations: []
  };

  // Extract platform
  const platforms = ['web', 'mobile', 'desktop', 'ios', 'android', 'windows', 'macos', 'linux', 'cloud'];
  platforms.forEach(platform => {
    if (new RegExp(`\\b${platform}\\b`, 'i').test(text)) {
      constraints.platform = platform;
    }
  });

  // Extract technologies
  const techKeywords = [
    'react', 'vue', 'angular', 'node', 'python', 'java', 'javascript', 'typescript',
    'mongodb', 'mysql', 'postgresql', 'redis', 'docker', 'kubernetes', 'aws', 'azure'
  ];
  
  techKeywords.forEach(tech => {
    if (new RegExp(`\\b${tech}\\b`, 'i').test(text)) {
      constraints.technologies.push(tech);
    }
  });

  // Extract performance requirements
  const performancePatterns = [
    /(?:performance|speed|fast|quick|responsive|load time)\s*:?\s*([^.!?]+)/i,
    /(?:should|must)\s+(?:be|run|load)\s+(?:fast|quick|within|under)\s+([^.!?]+)/i
  ];

  performancePatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      constraints.performance = match[1].trim();
    }
  });

  // Extract limitations
  const limitationPatterns = [
    /(?:cannot|can't|must not|should not|limitation|constraint|restriction)\s+([^.!?]+)/gi,
    /(?:not\s+)?(?:support|supports?|allow|allows?)\s+([^.!?]+)/gi
  ];

  limitationPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      constraints.limitations.push(match[1].trim().substring(0, 150));
    }
  });

  return constraints;
}

/**
 * Extract deliverables
 */
function extractDeliverables(text) {
  const deliverables = {
    outputs: [],
    milestones: []
  };

  // Extract output types
  const outputTypes = {
    'code': ['code', 'source code', 'implementation', 'program'],
    'design': ['design', 'ui', 'ux', 'mockup', 'wireframe', 'prototype'],
    'documentation': ['documentation', 'docs', 'readme', 'guide', 'manual'],
    'prototype': ['prototype', 'demo', 'mvp', 'proof of concept']
  };

  Object.entries(outputTypes).forEach(([type, keywords]) => {
    keywords.forEach(keyword => {
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(text)) {
        deliverables.outputs.push({
          type: type,
          description: `Deliver ${type}`,
          format: 'standard'
        });
      }
    });
  });

  // Extract milestones
  const milestonePatterns = [
    /(?:milestone|phase|stage|step)\s+(?:1|2|3|one|two|three|first|second|third)\s*:?\s*([^.!?]+)/gi,
    /(?:first|second|third|next)\s+(?:step|phase|milestone)\s*:?\s*([^.!?]+)/gi
  ];

  milestonePatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      deliverables.milestones.push({
        name: match[0].substring(0, 100),
        description: match[1].trim().substring(0, 200),
        estimatedComplexity: 'medium'
      });
    }
  });

  return deliverables;
}

/**
 * Extract visual elements from image data
 */
function extractVisualElements(imageData) {
  const visual = {
    colors: [],
    designStyle: null,
    layout: null,
    components: []
  };

  if (imageData && imageData.dominantColors) {
    const rgb = imageData.dominantColors.slice(0, 3);
    visual.colors.push(`rgb(${rgb[0].mean}, ${rgb[1].mean}, ${rgb[2].mean})`);
  }

  // Analyze OCR text for design elements
  if (imageData && imageData.ocrText) {
    const ocrText = imageData.ocrText.toLowerCase();
    
    // Detect design style
    if (ocrText.includes('minimal') || ocrText.includes('simple')) {
      visual.designStyle = 'minimalist';
    } else if (ocrText.includes('modern') || ocrText.includes('contemporary')) {
      visual.designStyle = 'modern';
    } else if (ocrText.includes('classic') || ocrText.includes('traditional')) {
      visual.designStyle = 'classic';
    }

    // Detect layout
    if (ocrText.includes('grid') || ocrText.includes('column')) {
      visual.layout = 'grid';
    } else if (ocrText.includes('sidebar') || ocrText.includes('navigation')) {
      visual.layout = 'sidebar';
    }
  }

  return visual;
}

/**
 * Calculate confidence and completeness scores
 */
function calculateScores(refinedPrompt) {
  let confidenceScore = 0.5;
  let completenessScore = 0.5;
  const missingInfo = [];

  // Check core intent completeness
  if (refinedPrompt.coreIntent.purpose && refinedPrompt.coreIntent.purpose !== 'Unspecified purpose') {
    completenessScore += 0.2;
    confidenceScore += 0.1;
  } else {
    missingInfo.push('Core purpose');
  }

  if (refinedPrompt.coreIntent.description && refinedPrompt.coreIntent.description.length > 50) {
    completenessScore += 0.1;
  } else {
    missingInfo.push('Detailed description');
  }

  // Check functional requirements
  if (refinedPrompt.functionalRequirements.primaryFeatures.length > 0) {
    completenessScore += 0.15;
    confidenceScore += 0.1;
  } else {
    missingInfo.push('Primary features');
  }

  // Check technical constraints
  if (refinedPrompt.technicalConstraints.platform || 
      refinedPrompt.technicalConstraints.technologies.length > 0) {
    completenessScore += 0.1;
    confidenceScore += 0.05;
  } else {
    missingInfo.push('Technical specifications');
  }

  // Check deliverables
  if (refinedPrompt.deliverables.outputs.length > 0) {
    completenessScore += 0.1;
  } else {
    missingInfo.push('Expected deliverables');
  }

  // Normalize scores
  confidenceScore = Math.min(1, confidenceScore);
  completenessScore = Math.min(1, completenessScore);

  return { confidenceScore, completenessScore, missingInfo };
}

/**
 * Main refinement function
 */
function refinePrompt(processedData, sourceTypes = []) {
  const combinedText = processedData.combinedText || processedData.content || '';
  
  // Validate input relevance
  if (!combinedText || combinedText.trim().length < 10) {
    throw new Error('Input is too short or irrelevant. Please provide more detailed information.');
  }

  // Check for completely irrelevant content
  const irrelevantPatterns = [
    /^[^a-zA-Z]*$/,
    /^(test|hello|hi|lorem ipsum)/i
  ];

  if (irrelevantPatterns.some(pattern => pattern.test(combinedText.trim()))) {
    throw new Error('Input appears to be irrelevant or test content. Please provide meaningful project requirements.');
  }

  // Extract all components
  const coreIntent = extractCoreIntent(combinedText);
  const functionalRequirements = extractFunctionalRequirements(combinedText);
  const technicalConstraints = extractTechnicalConstraints(combinedText);
  const deliverables = extractDeliverables(combinedText);
  
  // Extract visual elements if images are present
  let visualElements = {
    colors: [],
    designStyle: null,
    layout: null,
    components: []
  };

  if (processedData.images && processedData.images.length > 0) {
    visualElements = extractVisualElements(processedData.images[0]);
  }

  // Build refined prompt structure
  const refinedPrompt = {
    coreIntent,
    functionalRequirements,
    technicalConstraints,
    deliverables,
    visualElements,
    metadata: {
      sourceTypes: sourceTypes.length > 0 ? sourceTypes : ['text'],
      extractionMethod: 'pattern-matching-and-keyword-extraction'
    },
    sourceInputs: {
      textContent: combinedText.substring(0, 1000), // Store first 1000 chars
      imagePaths: processedData.images ? processedData.images.map(img => img.path || '') : [],
      documentPaths: processedData.documents ? processedData.documents.map(doc => doc.path || '') : [],
      originalFormat: sourceTypes.join('+')
    },
    customFields: {}
  };

  // Calculate scores
  const scores = calculateScores(refinedPrompt);
  refinedPrompt.metadata.confidenceScore = scores.confidenceScore;
  refinedPrompt.metadata.completenessScore = scores.completenessScore;
  refinedPrompt.metadata.missingInformation = scores.missingInfo;

  return refinedPrompt;
}

/**
 * Determine priority based on keywords
 */
function determinePriority(text) {
  const highPriorityKeywords = ['must', 'critical', 'essential', 'required', 'important'];
  const lowPriorityKeywords = ['nice to have', 'optional', 'future', 'later'];
  
  const lowerText = text.toLowerCase();
  
  if (highPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'high';
  } else if (lowPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'low';
  }
  
  return 'medium';
}

module.exports = {
  refinePrompt,
  extractCoreIntent,
  extractFunctionalRequirements,
  extractTechnicalConstraints,
  extractDeliverables,
  extractVisualElements
};

