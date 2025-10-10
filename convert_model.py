#!/usr/bin/env python3
"""
Simple TensorFlow.js Model Converter
Converts waste_classifier_model.h5 to TensorFlow.js format
"""

import os
import sys
import tensorflow as tf
from tensorflow import keras

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
        import tensorflowjs as tfjs
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
        sys.exit(1) 