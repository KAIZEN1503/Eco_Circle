# 🔄 Model Conversion Guide

Since the automatic conversion is having compatibility issues, here's how to manually convert your `waste_classifier_model.h5` to TensorFlow.js format.

## 🐍 Method 1: Using Python Script (Recommended)

### Step 1: Create a Python Environment
```bash
# Create a new virtual environment
python -m venv model_conversion_env

# Activate the environment
# On Windows:
model_conversion_env\Scripts\activate
# On Mac/Linux:
source model_conversion_env/bin/activate
```

### Step 2: Install Required Packages
```bash
pip install tensorflow tensorflowjs
```

### Step 3: Create Conversion Script
Create a file called `convert_manual.py`:

```python
import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs
import os

def convert_model():
    try:
        print("Loading waste_classifier_model.h5...")
        
        # Load the model
        model = keras.models.load_model('waste_classifier_model.h5')
        
        print("Model loaded successfully!")
        print("Model summary:")
        model.summary()
        
        # Create output directory
        output_dir = 'public/models/waste_classifier_model'
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"Converting model to TensorFlow.js format...")
        
        # Convert to TensorFlow.js format
        tfjs.converters.save_keras_model(model, output_dir)
        
        print(f"✅ Model converted successfully!")
        print(f"📁 Output directory: {output_dir}")
        print(f"📝 Files created:")
        for file in os.listdir(output_dir):
            print(f"  - {file}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error converting model: {str(e)}")
        return False

if __name__ == "__main__":
    success = convert_model()
    if not success:
        exit(1)
```

### Step 4: Run the Conversion
```bash
python convert_manual.py
```

## 🌐 Method 2: Using Online Converter

If the Python method doesn't work, you can use an online converter:

1. Go to: https://convert.tensorflowjs.org/
2. Upload your `waste_classifier_model.h5` file
3. Download the converted files
4. Place them in `public/models/waste_classifier_model/`

## 📋 Method 3: Using Google Colab

1. Open Google Colab: https://colab.research.google.com/
2. Upload your `waste_classifier_model.h5` file
3. Run this code:

```python
!pip install tensorflowjs

import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs

# Load your model
model = keras.models.load_model('waste_classifier_model.h5')

# Convert to TensorFlow.js
tfjs.converters.save_keras_model(model, 'waste_classifier_model_js')

# Download the files
from google.colab import files
import zipfile
import os

# Create a zip file
with zipfile.ZipFile('model_files.zip', 'w') as zipf:
    for file in os.listdir('waste_classifier_model_js'):
        zipf.write(os.path.join('waste_classifier_model_js', file), file)

files.download('model_files.zip')
```

4. Extract the zip file and place the contents in `public/models/waste_classifier_model/`

## 🔧 After Conversion

Once you have the converted files, you should see:
```
public/models/waste_classifier_model/
├── model.json
├── group1-shard1of1.bin
└── ... (other files)
```

## 🧪 Testing Your Model

1. Start your development server:
```bash
npm run dev
```

2. Go to `/test` to test your model integration
3. Go to `/upload` to test with real images

## 🐛 Troubleshooting

### Common Issues:

1. **"Model not found" error**: Make sure the model files are in the correct directory
2. **"Invalid model" error**: Check that the conversion was successful
3. **"Input shape mismatch"**: Update the `inputSize` in `src/config/modelConfig.ts`
4. **"Number of classes mismatch"**: Update `numClasses` and `classNames` in the config

### Getting Model Information:

If you need to know your model's exact specifications, you can inspect it:

```python
import h5py

with h5py.File('waste_classifier_model.h5', 'r') as f:
    # Look for input layer shape
    if 'model_weights' in f:
        weights = f['model_weights']
        for layer_name in weights.keys():
            if 'conv2d' in layer_name.lower():
                layer = weights[layer_name]
                for weight_name in layer.keys():
                    if 'kernel' in weight_name:
                        weight = layer[weight_name]
                        print(f"{layer_name} kernel shape: {weight.shape}")
                        # First conv layer kernel shape indicates input channels
                        if layer_name == 'conv2d_9':  # First conv layer
                            input_channels = weight.shape[2]
                            print(f"Input channels: {input_channels}")
```

## 📝 Next Steps

After successful conversion:

1. Update the configuration in `src/config/modelConfig.ts` with your actual model specifications
2. Test the model with various waste images
3. Fine-tune the preprocessing if needed
4. Deploy your application

Your custom waste classification model will then be fully integrated! 🎉 