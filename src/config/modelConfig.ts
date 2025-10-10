import { ModelConfig } from '@/services/wasteDetection';

// Configuration for your custom trained TensorFlow model
// Update these values based on your model's specifications

export const CUSTOM_MODEL_CONFIG: ModelConfig = {
  // Path to your model files in the public directory
  // Your model files should be placed in: public/models/your_model_name/
  modelPath: '/models/waste_classifier_model/model.json', // Updated for your model
  
  // Input image size that your model expects
  // Based on your model's actual input shape: [200, 200, 3]
  inputSize: [200, 200], // Your model's actual input size
  
  // Number of output classes your model predicts
  // Binary classification: 1 output with sigmoid activation
  numClasses: 2, // Binary classification (0 or 1)
  
  // Class names in the same order as your training data labels
  // Make sure these match your training data labels
  classNames: ['dry', 'wet'], // Dry waste and wet waste
  
  // Preprocessing configuration
  preprocessing: {
    // Whether to normalize pixel values
    normalize: true,
    
    // Normalization range - common options:
    // [0, 1] - normalize to 0-1 range
    // [-1, 1] - normalize to -1 to 1 range
    normalizeRange: [0, 1], // Standard normalization for most models
    
    // Image resizing method
    resizeMethod: 'bilinear' as const
  }
};

// Alternative configurations for different model types
export const MODEL_CONFIGS = {
  // For models trained with ImageNet preprocessing
  imagenet: {
    ...CUSTOM_MODEL_CONFIG,
    preprocessing: {
      normalize: true,
      normalizeRange: [-1, 1], // ImageNet standard
      resizeMethod: 'bilinear' as const
    }
  },
  
  // For models with custom preprocessing
  custom: CUSTOM_MODEL_CONFIG,
  
  // For models without normalization
  raw: {
    ...CUSTOM_MODEL_CONFIG,
    preprocessing: {
      normalize: false,
      normalizeRange: [0, 1],
      resizeMethod: 'bilinear' as const
    }
  }
};

// Helper function to validate model configuration
export const validateModelConfig = (config: ModelConfig): boolean => {
  const errors: string[] = [];
  
  if (!config.modelPath) {
    errors.push('Model path is required');
  }
  
  if (!Array.isArray(config.inputSize) || config.inputSize.length !== 2) {
    errors.push('Input size must be an array of 2 numbers [width, height]');
  }
  
  if (config.numClasses <= 0) {
    errors.push('Number of classes must be positive');
  }
  
  if (!Array.isArray(config.classNames) || config.classNames.length === 0) {
    errors.push('Class names must be a non-empty array');
  }
  
  if (config.classNames.length !== config.numClasses) {
    errors.push('Number of class names must match numClasses');
  }
  
  if (errors.length > 0) {
    console.error('Model configuration errors:', errors);
    return false;
  }
  
  return true;
};

// Helper function to get model info for debugging
export const getModelInfo = (config: ModelConfig) => {
  return {
    modelPath: config.modelPath,
    inputSize: config.inputSize,
    numClasses: config.numClasses,
    classNames: config.classNames,
    preprocessing: config.preprocessing
  };
}; 