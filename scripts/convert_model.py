#!/usr/bin/env python3
"""
TensorFlow.js Model Converter Script
Converts trained TensorFlow models to TensorFlow.js format for web deployment
"""

import os
import sys
import argparse
import tensorflow as tf
from tensorflow import keras

def convert_keras_model_to_tfjs(model_path, output_dir, model_format='keras'):
    """
    Convert a Keras model to TensorFlow.js format
    
    Args:
        model_path: Path to the saved model file
        output_dir: Directory to save the converted model
        model_format: Format of the input model ('keras', 'h5', 'saved_model')
    """
    try:
        print(f"Loading model from: {model_path}")
        
        # Load the model based on format
        if model_format == 'keras' or model_path.endswith('.h5'):
            model = keras.models.load_model(model_path)
        elif model_format == 'saved_model':
            model = tf.saved_model.load(model_path)
        else:
            raise ValueError(f"Unsupported model format: {model_format}")
        
        print(f"Model loaded successfully")
        print(f"Model summary:")
        model.summary()
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Convert to TensorFlow.js format
        print(f"Converting model to TensorFlow.js format...")
        
        # Use tensorflowjs converter
        try:
            import tensorflowjs as tfjs
            tfjs.converters.save_keras_model(model, output_dir)
            print(f"Model converted successfully to: {output_dir}")
        except ImportError:
            print("tensorflowjs not installed. Installing...")
            os.system("pip install tensorflowjs")
            import tensorflowjs as tfjs
            tfjs.converters.save_keras_model(model, output_dir)
            print(f"Model converted successfully to: {output_dir}")
        
        # Print model info
        print(f"\nModel conversion completed!")
        print(f"Output directory: {output_dir}")
        print(f"Files created:")
        for file in os.listdir(output_dir):
            print(f"  - {file}")
            
    except Exception as e:
        print(f"Error converting model: {str(e)}")
        return False
    
    return True

def convert_saved_model_to_tfjs(model_path, output_dir):
    """
    Convert a SavedModel to TensorFlow.js format
    """
    try:
        print(f"Converting SavedModel from: {model_path}")
        
        # Use tensorflowjs converter for SavedModel
        try:
            import tensorflowjs as tfjs
            tfjs.converters.convert_tf_saved_model(model_path, output_dir)
            print(f"SavedModel converted successfully to: {output_dir}")
        except ImportError:
            print("tensorflowjs not installed. Installing...")
            os.system("pip install tensorflowjs")
            import tensorflowjs as tfjs
            tfjs.converters.convert_tf_saved_model(model_path, output_dir)
            print(f"SavedModel converted successfully to: {output_dir}")
            
    except Exception as e:
        print(f"Error converting SavedModel: {str(e)}")
        return False
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Convert TensorFlow model to TensorFlow.js format')
    parser.add_argument('model_path', help='Path to the input model file or directory')
    parser.add_argument('output_dir', help='Output directory for the converted model')
    parser.add_argument('--format', choices=['keras', 'h5', 'saved_model'], 
                       default='keras', help='Input model format')
    
    args = parser.parse_args()
    
    # Check if input exists
    if not os.path.exists(args.model_path):
        print(f"Error: Model path does not exist: {args.model_path}")
        sys.exit(1)
    
    # Convert based on format
    if args.format == 'saved_model':
        success = convert_saved_model_to_tfjs(args.model_path, args.output_dir)
    else:
        success = convert_keras_model_to_tfjs(args.model_path, args.output_dir, args.format)
    
    if success:
        print("\n✅ Model conversion completed successfully!")
        print(f"📁 Converted model saved to: {args.output_dir}")
        print(f"🌐 You can now use this model in your web application")
        print(f"📝 Update the modelPath in src/config/modelConfig.ts to: '/models/{os.path.basename(args.output_dir)}/model.json'")
    else:
        print("\n❌ Model conversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 