"""
Download the AI model for waste classification
This will download about 2GB of model files from Hugging Face
"""

print("=" * 60)
print("  Downloading AI Waste Classification Model")
print("=" * 60)
print()
print("Model: prithivMLmods/Augmented-Waste-Classifier-SigLIP2")
print("Size: ~2GB")
print("This may take 5-10 minutes depending on your internet speed...")
print()

try:
    from transformers import AutoModelForImageClassification, AutoImageProcessor
    
    model_name = "prithivMLmods/Augmented-Waste-Classifier-SigLIP2"
    
    print("Step 1/2: Downloading model weights...")
    model = AutoModelForImageClassification.from_pretrained(model_name)
    print("✓ Model downloaded successfully!")
    
    print("\nStep 2/2: Downloading image processor...")
    processor = AutoImageProcessor.from_pretrained(model_name)
    print("✓ Image processor downloaded successfully!")
    
    print("\n" + "=" * 60)
    print("  ✅ MODEL DOWNLOAD COMPLETE!")
    print("=" * 60)
    print()
    print("The model is now cached locally and ready to use.")
    print("You can now restart the backend server (app.py)")
    print()
    
except Exception as e:
    print(f"\n✗ Error downloading model: {e}")
    print("\nPossible solutions:")
    print("1. Check your internet connection")
    print("2. Make sure you have enough disk space (~2GB)")
    print("3. Try running again if the download was interrupted")
    
input("\nPress Enter to exit...")
