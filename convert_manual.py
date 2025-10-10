#!/usr/bin/env python3
"""
Manual Model Converter for waste_classifier_model.h5
Converts the h5 model to TensorFlow.js format
"""

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
            
        # Print model information for configuration
        print(f"\n📋 Model Information for Configuration:")
        print(f"Input shape: {model.input_shape}")
        print(f"Output shape: {model.output_shape}")
        print(f"Number of output classes: {model.output_shape[-1]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error converting model: {str(e)}")
        print(f"💡 Try using the online converter at: https://convert.tensorflowjs.org/")
        return False

if __name__ == "__main__":
    success = convert_model()
    if not success:
        exit(1) 