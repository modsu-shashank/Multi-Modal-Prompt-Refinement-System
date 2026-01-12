import React from 'react';
import './RefinedPromptDisplay.css';

const RefinedPromptDisplay = ({ refinedPrompt }) => {
  if (!refinedPrompt) return null;

  const formatScore = (score) => {
    return (score * 100).toFixed(1);
  };

  return (
    <div className="refined-prompt-container">
      <h2>Refined Prompt</h2>
      
      {/* Metadata Scores */}
      <div className="scores-section">
        <div className="score-item">
          <span className="score-label">Confidence:</span>
          <span className="score-value">{formatScore(refinedPrompt.metadata?.confidenceScore || 0)}%</span>
        </div>
        <div className="score-item">
          <span className="score-label">Completeness:</span>
          <span className="score-value">{formatScore(refinedPrompt.metadata?.completenessScore || 0)}%</span>
        </div>
      </div>

      {/* Core Intent */}
      <section className="prompt-section">
        <h3>Core Intent</h3>
        <div className="section-content">
          <div className="field">
            <strong>Purpose:</strong>
            <p>{refinedPrompt.coreIntent?.purpose || 'Not specified'}</p>
          </div>
          <div className="field">
            <strong>Description:</strong>
            <p>{refinedPrompt.coreIntent?.description || 'Not specified'}</p>
          </div>
          {refinedPrompt.coreIntent?.targetAudience && (
            <div className="field">
              <strong>Target Audience:</strong>
              <p>{refinedPrompt.coreIntent.targetAudience}</p>
            </div>
          )}
        </div>
      </section>

      {/* Functional Requirements */}
      <section className="prompt-section">
        <h3>Functional Requirements</h3>
        <div className="section-content">
          {refinedPrompt.functionalRequirements?.primaryFeatures?.length > 0 && (
            <div className="field">
              <strong>Primary Features:</strong>
              <ul>
                {refinedPrompt.functionalRequirements.primaryFeatures.map((feature, idx) => (
                  <li key={idx}>
                    <span className={`priority-badge priority-${feature.priority}`}>
                      {feature.priority}
                    </span>
                    {feature.feature}
                    {feature.description && <span className="feature-desc"> - {feature.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {refinedPrompt.functionalRequirements?.userInteractions?.length > 0 && (
            <div className="field">
              <strong>User Interactions:</strong>
              <ul>
                {refinedPrompt.functionalRequirements.userInteractions.map((interaction, idx) => (
                  <li key={idx}>{interaction}</li>
                ))}
              </ul>
            </div>
          )}

          {refinedPrompt.functionalRequirements?.expectedBehaviors?.length > 0 && (
            <div className="field">
              <strong>Expected Behaviors:</strong>
              <ul>
                {refinedPrompt.functionalRequirements.expectedBehaviors.map((behavior, idx) => (
                  <li key={idx}>{behavior}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Technical Constraints */}
      <section className="prompt-section">
        <h3>Technical Constraints</h3>
        <div className="section-content">
          {refinedPrompt.technicalConstraints?.platform && (
            <div className="field">
              <strong>Platform:</strong>
              <p>{refinedPrompt.technicalConstraints.platform}</p>
            </div>
          )}
          
          {refinedPrompt.technicalConstraints?.technologies?.length > 0 && (
            <div className="field">
              <strong>Technologies:</strong>
              <div className="tag-list">
                {refinedPrompt.technicalConstraints.technologies.map((tech, idx) => (
                  <span key={idx} className="tag">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {refinedPrompt.technicalConstraints?.performance && (
            <div className="field">
              <strong>Performance:</strong>
              <p>{refinedPrompt.technicalConstraints.performance}</p>
            </div>
          )}

          {refinedPrompt.technicalConstraints?.limitations?.length > 0 && (
            <div className="field">
              <strong>Limitations:</strong>
              <ul>
                {refinedPrompt.technicalConstraints.limitations.map((limitation, idx) => (
                  <li key={idx}>{limitation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Deliverables */}
      <section className="prompt-section">
        <h3>Deliverables</h3>
        <div className="section-content">
          {refinedPrompt.deliverables?.outputs?.length > 0 && (
            <div className="field">
              <strong>Expected Outputs:</strong>
              <ul>
                {refinedPrompt.deliverables.outputs.map((output, idx) => (
                  <li key={idx}>
                    <span className="output-type">{output.type}</span>
                    {output.description && <span> - {output.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {refinedPrompt.deliverables?.milestones?.length > 0 && (
            <div className="field">
              <strong>Milestones:</strong>
              <ul>
                {refinedPrompt.deliverables.milestones.map((milestone, idx) => (
                  <li key={idx}>
                    <strong>{milestone.name}</strong>
                    {milestone.description && <span> - {milestone.description}</span>}
                    <span className={`complexity-badge complexity-${milestone.estimatedComplexity}`}>
                      {milestone.estimatedComplexity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Visual Elements */}
      {refinedPrompt.visualElements && (
        refinedPrompt.visualElements.colors?.length > 0 ||
        refinedPrompt.visualElements.designStyle ||
        refinedPrompt.visualElements.layout
      ) && (
        <section className="prompt-section">
          <h3>Visual Elements</h3>
          <div className="section-content">
            {refinedPrompt.visualElements.colors?.length > 0 && (
              <div className="field">
                <strong>Colors:</strong>
                <div className="color-list">
                  {refinedPrompt.visualElements.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {refinedPrompt.visualElements.designStyle && (
              <div className="field">
                <strong>Design Style:</strong>
                <p>{refinedPrompt.visualElements.designStyle}</p>
              </div>
            )}

            {refinedPrompt.visualElements.layout && (
              <div className="field">
                <strong>Layout:</strong>
                <p>{refinedPrompt.visualElements.layout}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Missing Information */}
      {refinedPrompt.metadata?.missingInformation?.length > 0 && (
        <section className="prompt-section warning">
          <h3>Missing Information</h3>
          <div className="section-content">
            <ul>
              {refinedPrompt.metadata.missingInformation.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Source Information */}
      <section className="prompt-section metadata">
        <h3>Source Information</h3>
        <div className="section-content">
          <div className="field">
            <strong>Source Types:</strong>
            <div className="tag-list">
              {refinedPrompt.metadata?.sourceTypes?.map((type, idx) => (
                <span key={idx} className="tag">{type}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefinedPromptDisplay;

