import React, { useState } from 'react';
import './SampleExamples.css';

const SampleExamples = () => {
  const [expandedExample, setExpandedExample] = useState(null);

  const examples = [
    {
      id: 1,
      title: 'E-Commerce Mobile App',
      input: {
        text: 'I want to build a mobile e-commerce app for iOS and Android. Users should be able to browse products, add items to cart, and checkout securely. The app must support payment via credit cards and PayPal. It should have a modern, minimalist design with a blue and white color scheme.',
        images: [],
        documents: []
      },
      output: {
        coreIntent: {
          purpose: 'build a mobile e-commerce app for iOS and Android',
          description: 'E-commerce mobile application supporting product browsing, cart management, and secure checkout',
          targetAudience: 'mobile users on iOS and Android'
        },
        functionalRequirements: {
          primaryFeatures: [
            { feature: 'browse products', priority: 'high' },
            { feature: 'add items to cart', priority: 'high' },
            { feature: 'checkout securely', priority: 'high' },
            { feature: 'payment via credit cards', priority: 'high' },
            { feature: 'payment via PayPal', priority: 'high' }
          ],
          userInteractions: ['browse products', 'add items to cart', 'checkout']
        },
        technicalConstraints: {
          platform: 'mobile',
          technologies: ['ios', 'android']
        },
        visualElements: {
          colors: ['blue', 'white'],
          designStyle: 'minimalist'
        }
      }
    },
    {
      id: 2,
      title: 'Task Management Web Application',
      input: {
        text: 'Create a web-based task management system using React and Node.js. Features include: creating tasks, assigning to team members, setting deadlines, and tracking progress. Must be responsive and work on all browsers.',
        images: [],
        documents: []
      },
      output: {
        coreIntent: {
          purpose: 'Create a web-based task management system',
          description: 'Task management system with task creation, assignment, deadline tracking, and progress monitoring'
        },
        functionalRequirements: {
          primaryFeatures: [
            { feature: 'creating tasks', priority: 'high' },
            { feature: 'assigning to team members', priority: 'high' },
            { feature: 'setting deadlines', priority: 'high' },
            { feature: 'tracking progress', priority: 'high' }
          ]
        },
        technicalConstraints: {
          platform: 'web',
          technologies: ['react', 'node']
        }
      }
    },
    {
      id: 3,
      title: 'Restaurant Booking System',
      input: {
        text: 'Design a restaurant reservation system. Customers can book tables online, view menu, and receive confirmation emails. Restaurant staff can manage reservations and view bookings calendar.',
        images: [],
        documents: []
      },
      output: {
        coreIntent: {
          purpose: 'Design a restaurant reservation system',
          description: 'Online booking system for restaurants with customer and staff interfaces'
        },
        functionalRequirements: {
          primaryFeatures: [
            { feature: 'book tables online', priority: 'high' },
            { feature: 'view menu', priority: 'medium' },
            { feature: 'receive confirmation emails', priority: 'medium' },
            { feature: 'manage reservations', priority: 'high' },
            { feature: 'view bookings calendar', priority: 'high' }
          ]
        }
      }
    },
    {
      id: 4,
      title: 'Fitness Tracking App',
      input: {
        text: 'Build a fitness tracking mobile app. Users can log workouts, track calories, monitor heart rate, and set fitness goals. The app should integrate with wearable devices and provide weekly progress reports.',
        images: [],
        documents: []
      },
      output: {
        coreIntent: {
          purpose: 'Build a fitness tracking mobile app',
          description: 'Mobile fitness application for workout logging, calorie tracking, and progress monitoring'
        },
        functionalRequirements: {
          primaryFeatures: [
            { feature: 'log workouts', priority: 'high' },
            { feature: 'track calories', priority: 'high' },
            { feature: 'monitor heart rate', priority: 'medium' },
            { feature: 'set fitness goals', priority: 'high' },
            { feature: 'integrate with wearable devices', priority: 'medium' },
            { feature: 'provide weekly progress reports', priority: 'medium' }
          ]
        },
        technicalConstraints: {
          platform: 'mobile'
        }
      }
    },
    {
      id: 5,
      title: 'Educational Platform',
      input: {
        text: 'Develop an online learning platform where students can enroll in courses, watch video lectures, take quizzes, and earn certificates. Instructors can create courses, upload content, and track student progress. Platform should support video streaming and have a discussion forum.',
        images: [],
        documents: []
      },
      output: {
        coreIntent: {
          purpose: 'Develop an online learning platform',
          description: 'Educational platform with course enrollment, video lectures, assessments, and certification'
        },
        functionalRequirements: {
          primaryFeatures: [
            { feature: 'enroll in courses', priority: 'high' },
            { feature: 'watch video lectures', priority: 'high' },
            { feature: 'take quizzes', priority: 'high' },
            { feature: 'earn certificates', priority: 'medium' },
            { feature: 'create courses', priority: 'high' },
            { feature: 'upload content', priority: 'high' },
            { feature: 'track student progress', priority: 'high' },
            { feature: 'video streaming', priority: 'high' },
            { feature: 'discussion forum', priority: 'medium' }
          ]
        },
        technicalConstraints: {
          platform: 'web'
        }
      }
    }
  ];

  const toggleExample = (id) => {
    setExpandedExample(expandedExample === id ? null : id);
  };

  return (
    <div className="sample-examples-container">
      <h2>Sample Examples</h2>
      <p className="examples-intro">
        Explore these examples to see how different inputs are transformed into structured, refined prompts.
      </p>
      
      <div className="examples-list">
        {examples.map((example) => (
          <div key={example.id} className="example-card">
            <div className="example-header" onClick={() => toggleExample(example.id)}>
              <h3>{example.title}</h3>
              <span className="toggle-icon">
                {expandedExample === example.id ? '−' : '+'}
              </span>
            </div>
            
            {expandedExample === example.id && (
              <div className="example-content">
                <div className="example-section">
                  <h4>Input:</h4>
                  <div className="input-display">
                    <strong>Text:</strong>
                    <p>{example.input.text}</p>
                  </div>
                </div>
                
                <div className="example-section">
                  <h4>Refined Output:</h4>
                  <div className="output-display">
                    <div className="output-field">
                      <strong>Purpose:</strong>
                      <p>{example.output.coreIntent.purpose}</p>
                    </div>
                    <div className="output-field">
                      <strong>Description:</strong>
                      <p>{example.output.coreIntent.description}</p>
                    </div>
                    {example.output.functionalRequirements.primaryFeatures.length > 0 && (
                      <div className="output-field">
                        <strong>Primary Features:</strong>
                        <ul>
                          {example.output.functionalRequirements.primaryFeatures.map((feature, idx) => (
                            <li key={idx}>
                              <span className={`priority-badge priority-${feature.priority}`}>
                                {feature.priority}
                              </span>
                              {feature.feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {example.output.technicalConstraints.platform && (
                      <div className="output-field">
                        <strong>Platform:</strong>
                        <p>{example.output.technicalConstraints.platform}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleExamples;

