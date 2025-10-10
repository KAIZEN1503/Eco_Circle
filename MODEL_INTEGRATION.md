# 🤖 Custom Model Integration Guide

This guide will help you integrate your trained TensorFlow model into the eco_circle waste management project.

## 📋 Prerequisites

1. **Your trained model** (in one of these formats):
   - `.h5` file (Keras format)
   - `.pb` file (TensorFlow SavedModel)
   - `.json` + `.bin` files (already in TensorFlow.js format)

2. **Python environment** with TensorFlow and tensorflowjs installed

## 🚀 Step-by-Step Integration

### Step 1: Convert Your Model to TensorFlow.js Format

If your model is not already in TensorFlow.js format, use the provided conversion script:

```bash
# For Keras/H5 models
python scripts/convert_model.py path/to/your/model.h5 public/models/waste_detection_model --format h5

# For SavedModel format
python scripts/convert_model.py path/to/your/saved_model public/models/waste_detection_model --format saved_model
```

### Step 2: Place Model Files in the Project

After conversion, your model files should be in:
```
public/models/waste_detection_model/
├── model.json
├── group1-shard1of1.bin
└── ... (other files)
```

### Step 3: Update Model Configuration

Edit `src/config/modelConfig.ts` and update the configuration based on your model:

```typescript
export const CUSTOM_MODEL_CONFIG: ModelConfig = {
  // Update this path to match your model directory
  modelPath: '/models/waste_detection_model/model.json',
  
  // Update based on your model's input size
  inputSize: [224, 224], // Change to your model's input size
  
  // Update based on your model's output classes
  numClasses: 3, // Change to your number of classes
  
  // Update with your actual class names (in the same order as training)
  classNames: ['wet', 'dry', 'hazardous'], // Change to your class names
  
  // Update preprocessing based on how your model was trained
  preprocessing: {
    normalize: true,
    normalizeRange: [0, 1], // Change based on your preprocessing
    resizeMethod: 'bilinear'
  }
};
```

### Step 4: Update the Service to Use Your Model

Edit `src/services/wasteDetection.ts` and update the default configuration:

```typescript
// Import your custom config
import { CUSTOM_MODEL_CONFIG } from '@/config/modelConfig';

// Update the default config to use your model
const DEFAULT_MODEL_CONFIG: ModelConfig = CUSTOM_MODEL_CONFIG;
```

### Step 5: Test Your Integration

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the Image Upload page
3. Upload an image and test the classification

## 🔧 Configuration Options

### Model Path
- **Local model**: `/models/your_model_name/model.json`
- **Remote model**: `https://your-domain.com/models/model.json`

### Input Size
Common input sizes:
- `[224, 224]` - Standard for many CNN models
- `[299, 299]` - Inception models
- `[512, 512]` - Higher resolution models

### Normalization
Choose based on your training preprocessing:
- `[0, 1]` - Normalize pixel values to 0-1 range
- `[-1, 1]` - Normalize to -1 to 1 range (ImageNet standard)
- `false` - No normalization

### Class Names
Make sure your class names match exactly with your training data labels and are in the same order.

## 🐛 Troubleshooting

### Model Loading Errors

1. **Check file paths**: Ensure model files are in the correct directory
2. **Verify model format**: Make sure the model was converted properly
3. **Check browser console**: Look for specific error messages

### Classification Issues

1. **Input size mismatch**: Verify `inputSize` matches your model
2. **Preprocessing mismatch**: Check `normalizeRange` matches training
3. **Class names mismatch**: Ensure `classNames` match training labels

### Performance Issues

1. **Model size**: Large models may load slowly
2. **Image size**: Large input images affect performance
3. **Browser compatibility**: Ensure TensorFlow.js is supported

## 📊 Model Validation

To validate your model configuration, use the helper function:

```typescript
import { validateModelConfig, CUSTOM_MODEL_CONFIG } from '@/config/modelConfig';

const isValid = validateModelConfig(CUSTOM_MODEL_CONFIG);
console.log('Model config is valid:', isValid);
```

## 🔄 Updating Model

To update your model:

1. Replace the model files in `public/models/`
2. Update the configuration if needed
3. Clear browser cache
4. Restart the development server

## 📝 Example Configurations

### ImageNet Preprocessing
```typescript
{
  normalize: true,
  normalizeRange: [-1, 1],
  resizeMethod: 'bilinear'
}
```

### Custom Preprocessing
```typescript
{
  normalize: true,
  normalizeRange: [0, 1],
  resizeMethod: 'bilinear'
}
```

### No Normalization
```typescript
{
  normalize: false,
  normalizeRange: [0, 1],
  resizeMethod: 'bilinear'
}
```

## 🎯 Next Steps

After successful integration:

1. **Test thoroughly** with various waste images
2. **Optimize performance** if needed
3. **Add more classes** if your model supports them
4. **Improve UI** to show model confidence and details
5. **Add model versioning** for updates

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify model configuration matches training
3. Test with simple images first
4. Ensure TensorFlow.js is properly loaded

Your custom model should now be integrated and ready to classify waste images! 🎉 