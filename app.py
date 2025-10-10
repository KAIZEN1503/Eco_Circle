from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from transformers import AutoImageProcessor, SiglipForImageClassification
from PIL import Image
import torch
import io

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Paths and limits
UPLOAD_DIR = "uploads"
ALLOWED_EXT = {"png", "jpg", "jpeg"}
MAX_FILE_SIZE_MB = 16

os.makedirs(UPLOAD_DIR, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_DIR
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE_MB * 1024 * 1024

# Load model
print("Loading SIGLIP model, please wait...")
try:
    model_name = "prithivMLmods/Augmented-Waste-Classifier-SigLIP2"
    model = SiglipForImageClassification.from_pretrained(model_name)
    processor = AutoImageProcessor.from_pretrained(model_name)
    
    # Fine-grained class labels
    labels = {
        "0": "Battery", "1": "Biological", "2": "Cardboard", "3": "Clothes", 
        "4": "Glass", "5": "Metal", "6": "Paper", "7": "Plastic", 
        "8": "Shoes", "9": "Trash"
    }

    # Map fine-grained labels to Wet/Dry Waste
    wet_dry_map = {
        "Battery": "Dry Waste",
        "Biological": "Wet Waste",
        "Cardboard": "Dry Waste",
        "Clothes": "Dry Waste",
        "Glass": "Dry Waste",
        "Metal": "Dry Waste",
        "Paper": "Dry Waste",
        "Plastic": "Dry Waste",
        "Shoes": "Dry Waste",
        "Trash": "Wet Waste"
    }
    
    model_loaded = True
    print("✅ SIGLIP model loaded successfully!")
except Exception as e:
    print(f"✗ Failed to load model: {e}")
    model_loaded = False

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "model_loaded": model_loaded,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/classify", methods=["POST"])
def classify():
    if not model_loaded:
        return jsonify({"success": False, "error": "Model not loaded"}), 500

    if "image" not in request.files:
        return jsonify({"success": False, "error": "No image field in form-data"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400
    if not allowed_file(file.filename):
        return jsonify({"success": False, "error": f"Invalid file type. Allowed: {', '.join(ALLOWED_EXT)}"}), 400

    try:
        # Read image from the uploaded file
        img = Image.open(io.BytesIO(file.read())).convert("RGB")

        # Preprocess and predict
        inputs = processor(images=img, return_tensors="pt")
        with torch.no_grad():
            logits = model(**inputs).logits

        predicted_class_idx = logits.argmax(-1).item()
        predicted_class = labels[str(predicted_class_idx)]
        waste_type = wet_dry_map[predicted_class]

        # Convert waste_type to match frontend expectations (wet/dry)
        category = "wet" if waste_type == "Wet Waste" else "dry"
        
        # Confidence estimation (using softmax)
        probs = torch.nn.functional.softmax(logits, dim=-1)
        confidence = float(probs.max().item())

        result = {
            "predicted_class": predicted_class,
            "waste_type": waste_type,
            "category": category,
            "confidence": round(confidence * 100, 2)
        }
        
        return jsonify({"success": True, "result": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({"success": False, "error": f"File too large. Max {MAX_FILE_SIZE_MB}MB"}), 413

if __name__ == "__main__":
    print(f"API running on http://localhost:5000")
    app.run(debug=True, port=5000)