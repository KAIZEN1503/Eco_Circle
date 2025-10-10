import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export interface WasteDetectionResult {
  category: "wet" | "dry";
  confidence: number;
  items: string[];
  recommendations: string[];
}

// Configuration for your custom model
export interface ModelConfig {
  modelPath: string; // Path to your model files
  inputSize: [number, number]; // e.g., [224, 224]
  numClasses: number; // Number of output classes
  classNames: string[]; // Your model's class names
  preprocessing: {
    normalize: boolean;
    normalizeRange: [number, number]; // e.g., [0, 1] or [-1, 1]
    resizeMethod: 'bilinear' | 'nearest' | 'bicubic';
  };
}

// Import custom model configuration
import { CUSTOM_MODEL_CONFIG } from '@/config/modelConfig';

// Default configuration - Uses your custom model config
const DEFAULT_MODEL_CONFIG: ModelConfig = CUSTOM_MODEL_CONFIG;

// Waste categories mapping based on common waste types
const WASTE_CATEGORIES = {
  wet: {
    category: "wet" as const,
    items: ["Food scraps", "Fruit peels", "Vegetable waste", "Organic matter", "Coffee grounds", "Tea bags", "Garden waste", "Dairy products"],
    recommendations: [
      "This appears to be organic waste suitable for composting",
      "Place in your green/wet waste bin",
      "Consider starting a home compost system",
      "Avoid meat and dairy in home composting"
    ]
  },
  dry: {
    category: "dry" as const,
    items: ["Plastic bottles", "Paper", "Cardboard", "Metal cans", "Glass", "Fabric", "Rubber", "Electronics", "Batteries"],
    recommendations: [
      "These items can be recycled",
      "Clean the containers before recycling",
      "Place in your blue/dry waste bin",
      "Remove labels when possible",
      "Take electronics to designated collection centers"
    ]
  }
};

class WasteDetectionService {
  private model: tf.GraphModel | null = null;
  private isModelLoaded: boolean = false;
  private modelConfig: ModelConfig;

  constructor(config: ModelConfig = DEFAULT_MODEL_CONFIG) {
    this.modelConfig = config;
  }

  async loadModel(): Promise<void> {
    if (this.isModelLoaded && this.model) return;

    try {
      await tf.ready();
      console.log('TensorFlow.js backend initialized');

      // Try to load your custom model
      console.log('Attempting to load custom model from:', this.modelConfig.modelPath);
      this.model = await tf.loadGraphModel(this.modelConfig.modelPath);
      
      this.isModelLoaded = true;
      console.log('✅ Custom waste detection model loaded successfully');
      console.log('Model input shape:', this.model.inputs[0].shape);
      console.log('Model output shape:', this.model.outputs[0].shape);
    } catch (error) {
      console.error('❌ Error loading custom model:', error);
      console.log('This is expected if your model has not been converted to TensorFlow.js format yet.');
      
      // Fallback to the original MobileNet model
      console.log('🔄 Falling back to MobileNet model...');
      this.model = await tf.loadGraphModel(
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1',
        { fromTFHub: true }
      );
      
      this.isModelLoaded = true;
      console.log('✅ MobileNet fallback model loaded successfully');
      console.log('💡 To use your custom model, convert it to TensorFlow.js format first.');
    }
  }

  private preprocessImage(imageElement: HTMLImageElement): tf.Tensor {
    return tf.tidy(() => {
      // Convert to tensor
      const tensor = tf.browser.fromPixels(imageElement);
      
      // Resize to model's input size
      const resized = tf.image.resizeBilinear(
        tensor, 
        this.modelConfig.inputSize
      );
      
      // Normalize based on model configuration
      let normalized = resized;
      if (this.modelConfig.preprocessing.normalize) {
        const [min, max] = this.modelConfig.preprocessing.normalizeRange;
        if (min === 0 && max === 1) {
          // Normalize to [0, 1]
          normalized = resized.div(255);
        } else if (min === -1 && max === 1) {
          // Normalize to [-1, 1]
          normalized = resized.div(127.5).sub(1);
        }
      }
      
      // Add batch dimension
      return normalized.expandDims(0);
    });
  }

  private analyzeCustomModelPredictions(predictions: tf.Tensor): WasteDetectionResult {
    const predictionData = predictions.dataSync();
    
    // Debug: Log the raw prediction data
    console.log('Raw prediction data:', predictionData);
    console.log('Prediction shape:', predictions.shape);
    
    // For binary classification, we have a single output value
    const prediction = predictionData[0];
    console.log('Binary prediction value:', prediction);
    
    // Determine class based on threshold (0.5 for binary classification)
    const isWet = prediction > 0.5;
    const predictedClass = isWet ? 'wet' : 'dry';
    console.log('Predicted class:', predictedClass, 'Is wet:', isWet);
    
    // Calculate confidence (distance from threshold)
    const confidence = isWet ? prediction : (1 - prediction);
    console.log('Confidence:', confidence);
    
    // Get category info
    const categoryInfo = WASTE_CATEGORIES[predictedClass as keyof typeof WASTE_CATEGORIES] || WASTE_CATEGORIES.dry;
    
    return {
      category: categoryInfo.category,
      confidence: Math.min(confidence, 0.99), // Cap confidence at 99%
      items: categoryInfo.items.slice(0, 3), // Show top 3 items
      recommendations: categoryInfo.recommendations
    };
  }

  private analyzeImageNetPredictions(predictions: tf.Tensor): WasteDetectionResult {
    // Original ImageNet-based analysis for fallback
    const predictionData = predictions.dataSync();
    const maxPrediction = Math.max(...predictionData);
    const maxIndex = predictionData.indexOf(maxPrediction);
    
    // Map ImageNet predictions to waste categories (only dry and wet)
    let wasteType: keyof typeof WASTE_CATEGORIES;
    
    if (maxIndex < 400) {
      wasteType = 'wet'; // Organic/food items
    } else {
      wasteType = 'dry'; // Manufactured objects
    }

    const categoryInfo = WASTE_CATEGORIES[wasteType];
    
    return {
      category: categoryInfo.category,
      confidence: Math.min(maxPrediction * 1.2, 0.95),
      items: categoryInfo.items.slice(0, 2 + Math.floor(Math.random() * 2)),
      recommendations: categoryInfo.recommendations
    };
  }

  async detectWaste(imageElement: HTMLImageElement): Promise<WasteDetectionResult> {
    if (!this.isModelLoaded || !this.model) {
      await this.loadModel();
    }

    try {
      // Preprocess image
      const preprocessed = this.preprocessImage(imageElement);
      
      // Run inference
      const predictions = this.model!.predict(preprocessed) as tf.Tensor;
      
      // Analyze results based on model type
      let result: WasteDetectionResult;
      
      if (predictions.shape.length === 1 && predictions.shape[0] === 1) {
        // Binary classification model (single output)
        result = this.analyzeCustomModelPredictions(predictions);
      } else if (this.modelConfig.classNames.length > 0 && predictions.shape[1] === this.modelConfig.numClasses) {
        // Multi-class classification model
        result = this.analyzeCustomModelPredictions(predictions);
      } else {
        // Use ImageNet-based analysis (fallback)
        result = this.analyzeImageNetPredictions(predictions);
      }
      
      // Clean up tensors
      preprocessed.dispose();
      predictions.dispose();
      
      return result;
    } catch (error) {
      console.error('Error during waste detection:', error);
      
      // Fallback to a default classification
      return {
        category: "dry",
        confidence: 0.75,
        items: ["Unidentified waste"],
        recommendations: [
          "Unable to classify automatically",
          "Please manually sort based on material type",
          "When in doubt, place in dry waste bin"
        ]
      };
    }
  }

  // Create image element from file for processing
  createImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Method to update model configuration
  updateModelConfig(newConfig: Partial<ModelConfig>): void {
    this.modelConfig = { ...this.modelConfig, ...newConfig };
    // Reset model loading state to force reload with new config
    this.isModelLoaded = false;
    this.model = null;
  }
}

// Create service instance with default config
export const wasteDetectionService = new WasteDetectionService();

// Export for custom configuration
export const createWasteDetectionService = (config: ModelConfig) => {
  return new WasteDetectionService(config);
};