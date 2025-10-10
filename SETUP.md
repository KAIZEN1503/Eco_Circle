# Eco Circle - Setup Guide

This guide will help you set up and run the Eco Circle waste management application.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- Python (version 3.8 or higher)
- pip (Python package manager)
- Git (optional, for cloning the repository)

## Project Structure

```
eco_circle/
├── app.py               # Flask backend API
├── requirements.txt     # Python dependencies
├── src/                 # React frontend source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── ...              # Other frontend files
├── package.json         # Frontend dependencies
└── README.md            # Main project documentation
```

## Installation

### 1. Clone the Repository (if not already done)
```bash
git clone <repository-url>
cd eco_circle
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

Alternatively, you can run the install_deps.bat script on Windows.

## Running the Application

### Start the Backend Server
```bash
python app.py
```

The backend server will start on `http://localhost:5000`.

### Start the Frontend Development Server
In a new terminal/command prompt:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Using the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Go to the "AI Waste Detection" page
3. Upload an image of waste items
4. The application will analyze the image and provide:
   - The specific type of waste detected
   - Whether it's wet or dry waste
   - Confidence level of the prediction
   - Recommendations for disposal

## Model Information

The application uses the "prithivMLmods/Augmented-Waste-Classifier-SigLIP2" model from Hugging Face, which can classify 10 different types of waste:
1. Battery
2. Biological
3. Cardboard
4. Clothes
5. Glass
6. Metal
7. Paper
8. Plastic
9. Shoes
10. Trash

The model automatically maps these classifications to either "Wet Waste" or "Dry Waste" categories.

## Troubleshooting

### Backend Issues
- If you encounter model loading errors, ensure you have a stable internet connection as the model is downloaded from Hugging Face.
- Make sure all Python dependencies are installed correctly.

### Frontend Issues
- If the frontend fails to connect to the backend, ensure the Flask server is running on `http://localhost:5000`.
- Clear your browser cache if you're not seeing recent changes.

### Common Solutions
1. **Connection refused errors**: Make sure both servers are running.
2. **Model loading failures**: Check your internet connection and try again.
3. **Dependency installation errors**: Make sure you're using compatible versions of Node.js and Python.

## Development

### Frontend Development
- The frontend is built with React, TypeScript, and Vite
- UI components are from shadcn/ui with Tailwind CSS styling
- The main pages are located in `src/pages/`
- Services for API communication are in `src/services/`

### Backend Development
- The backend is a Flask application
- The main API endpoints are in `app.py`
- The model is loaded once at startup for efficiency
- CORS is enabled for communication with the frontend

## Deployment

For deployment, you would typically:
1. Build the frontend for production:
   ```bash
   npm run build
   ```
2. Deploy the built frontend files to a web server
3. Deploy the backend to a Python-compatible hosting service
4. Configure environment variables as needed

## Support

If you encounter any issues not covered in this guide, please check the console logs for error messages and ensure all dependencies are correctly installed.