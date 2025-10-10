#!/usr/bin/env python3
"""
Model Inspector - Get basic info about the model without full loading
"""

import h5py
import numpy as np

def inspect_model():
    try:
        print("Inspecting waste_classifier_model.h5...")
        
        with h5py.File('waste_classifier_model.h5', 'r') as f:
            print("\n📁 Model structure:")
            def print_structure(name, obj):
                if isinstance(obj, h5py.Dataset):
                    print(f"  📄 {name}: shape={obj.shape}, dtype={obj.dtype}")
                elif isinstance(obj, h5py.Group):
                    print(f"  📁 {name}/")
            
            f.visititems(print_structure)
            
            # Look for layer information
            if 'model_weights' in f:
                weights_group = f['model_weights']
                print(f"\n🏗️ Model layers:")
                for layer_name in weights_group.keys():
                    layer = weights_group[layer_name]
                    print(f"  📋 {layer_name}")
                    if isinstance(layer, h5py.Group):
                        for weight_name in layer.keys():
                            weight = layer[weight_name]
                            if isinstance(weight, h5py.Dataset):
                                print(f"    - {weight_name}: {weight.shape}")
                            else:
                                print(f"    - {weight_name}: (nested group)")
                                
            # Try to find the output layer
            print(f"\n🔍 Looking for output layer...")
            if 'model_weights' in f:
                weights_group = f['model_weights']
                for layer_name in weights_group.keys():
                    if 'dense' in layer_name.lower():
                        layer = weights_group[layer_name]
                        if isinstance(layer, h5py.Group):
                            for weight_name in layer.keys():
                                weight = layer[weight_name]
                                if isinstance(weight, h5py.Dataset) and 'kernel' in weight_name:
                                    print(f"  📊 {layer_name} kernel: {weight.shape}")
                                    # The last dimension of the kernel is the number of output classes
                                    if len(weight.shape) == 2:
                                        num_classes = weight.shape[1]
                                        print(f"  🎯 Number of output classes: {num_classes}")
                                        
        return True
        
    except Exception as e:
        print(f"❌ Error inspecting model: {str(e)}")
        return False

if __name__ == "__main__":
    success = inspect_model()
    if not success:
        exit(1) 