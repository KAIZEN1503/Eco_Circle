import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react";
import { wasteDetectionService } from "@/services/wasteDetection";
import { CUSTOM_MODEL_CONFIG, validateModelConfig, getModelInfo } from "@/config/modelConfig";

const ModelTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    configValid: boolean;
    modelInfo: any;
    loadTest: boolean;
    error?: string;
  } | null>(null);

  const runModelTests = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      // Test 1: Validate configuration
      const configValid = validateModelConfig(CUSTOM_MODEL_CONFIG);
      const modelInfo = getModelInfo(CUSTOM_MODEL_CONFIG);

      // Test 2: Try to load the model
      let loadTest = false;
      let error: string | undefined;

      try {
        await wasteDetectionService.loadModel();
        loadTest = true;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error';
        loadTest = false;
      }

      setTestResults({
        configValid,
        modelInfo,
        loadTest,
        error
      });
    } catch (err) {
      setTestResults({
        configValid: false,
        modelInfo: null,
        loadTest: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Model Integration Test
          </h1>
          <p className="text-muted-foreground">
            Test your custom TensorFlow.js model integration
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Model Path:</strong> {CUSTOM_MODEL_CONFIG.modelPath}
                </div>
                <div>
                  <strong>Input Size:</strong> {CUSTOM_MODEL_CONFIG.inputSize.join(' x ')}
                </div>
                <div>
                  <strong>Number of Classes:</strong> {CUSTOM_MODEL_CONFIG.numClasses}
                </div>
                <div>
                  <strong>Class Names:</strong> {CUSTOM_MODEL_CONFIG.classNames.join(', ')}
                </div>
                <div>
                  <strong>Normalization:</strong> {CUSTOM_MODEL_CONFIG.preprocessing.normalize ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Normalization Range:</strong> {CUSTOM_MODEL_CONFIG.preprocessing.normalizeRange.join(' to ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mb-6">
          <Button 
            onClick={runModelTests} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Run Model Tests
              </>
            )}
          </Button>
        </div>

        {testResults && (
          <div className="space-y-4">
            {/* Configuration Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {testResults.configValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  Configuration Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={testResults.configValid ? "default" : "destructive"}>
                    {testResults.configValid ? "Valid" : "Invalid"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {testResults.configValid 
                      ? "Model configuration is valid" 
                      : "Model configuration has errors"
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Model Loading Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {testResults.loadTest ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  Model Loading Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={testResults.loadTest ? "default" : "destructive"}>
                      {testResults.loadTest ? "Success" : "Failed"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {testResults.loadTest 
                        ? "Model loaded successfully" 
                        : "Failed to load model"
                      }
                    </span>
                  </div>
                  {testResults.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                      <strong>Error:</strong> {testResults.error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Model Info */}
            {testResults.modelInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                    {JSON.stringify(testResults.modelInfo, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {testResults.configValid && testResults.loadTest ? (
                    <>
                      <p className="text-green-600">✅ Your model is ready to use!</p>
                      <p>You can now:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Test with real images in the Image Upload page</li>
                        <li>Fine-tune the configuration if needed</li>
                        <li>Deploy your application</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="text-red-600">❌ Model integration needs attention</p>
                      <p>Please:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Check the model file paths</li>
                        <li>Verify the configuration matches your model</li>
                        <li>Ensure model files are in the correct format</li>
                        <li>Check the browser console for detailed errors</li>
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTest; 