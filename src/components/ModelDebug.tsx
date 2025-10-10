import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info, Loader2, Upload } from "lucide-react";
import { wasteDetectionService } from "@/services/wasteDetection";
import * as tf from '@tensorflow/tfjs';

const ModelDebug = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugResults, setDebugResults] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const testModelWithImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setDebugResults(null);

    try {
      // Load model first
      await wasteDetectionService.loadModel();
      
      // Create image element
      const img = new Image();
      img.onload = async () => {
        try {
          // Get raw predictions
          const tensor = tf.browser.fromPixels(img);
          const resized = tf.image.resizeBilinear(tensor, [200, 200]);
          const normalized = resized.div(255);
          const batched = normalized.expandDims(0);
          
          // Get model
          const model = (wasteDetectionService as any).model;
          if (!model) {
            setDebugResults({ error: "Model not loaded" });
            return;
          }

          // Run prediction
          const predictions = model.predict(batched) as tf.Tensor;
          const predictionData = predictions.dataSync();
          
          console.log('=== MODEL DEBUG INFO ===');
          console.log('Model input shape:', model.inputs[0].shape);
          console.log('Model output shape:', model.outputs[0].shape);
          console.log('Raw prediction data:', predictionData);
          console.log('Prediction shape:', predictions.shape);
          console.log('First prediction value:', predictionData[0]);
          console.log('All prediction values:', Array.from(predictionData));
          
          setDebugResults({
            inputShape: model.inputs[0].shape,
            outputShape: model.outputs[0].shape,
            rawPredictions: Array.from(predictionData),
            predictionShape: predictions.shape,
            firstValue: predictionData[0]
          });

          // Clean up
          tensor.dispose();
          resized.dispose();
          normalized.dispose();
          batched.dispose();
          predictions.dispose();
          
        } catch (error) {
          console.error('Error during prediction:', error);
          setDebugResults({ error: error.message });
        }
      };
      
      img.src = URL.createObjectURL(selectedFile);
      
    } catch (error) {
      console.error('Error:', error);
      setDebugResults({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Model Debug Tool
          </h1>
          <p className="text-muted-foreground">
            Test your model and see raw prediction values
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Upload Test Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
              
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
              )}
              
              <Button 
                onClick={testModelWithImage} 
                disabled={!selectedFile || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing Model...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Test Model
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {debugResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {debugResults.error ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                Debug Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debugResults.error ? (
                <div className="text-red-600 bg-red-50 p-4 rounded">
                  <strong>Error:</strong> {debugResults.error}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <strong>Model Input Shape:</strong> {JSON.stringify(debugResults.inputShape)}
                  </div>
                  <div>
                    <strong>Model Output Shape:</strong> {JSON.stringify(debugResults.outputShape)}
                  </div>
                  <div>
                    <strong>Prediction Shape:</strong> {JSON.stringify(debugResults.predictionShape)}
                  </div>
                  <div>
                    <strong>First Prediction Value:</strong> {debugResults.firstValue}
                  </div>
                  <div>
                    <strong>All Prediction Values:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                      {JSON.stringify(debugResults.rawPredictions, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded">
                    <h4 className="font-semibold mb-2">Analysis:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• If first value is close to 0: Model predicts "dry"</li>
                      <li>• If first value is close to 1: Model predicts "wet"</li>
                      <li>• If values are very low (&lt; 0.1): Model might be predicting "dry"</li>
                      <li>• If values are very high (&gt; 0.9): Model might be predicting "wet"</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModelDebug; 