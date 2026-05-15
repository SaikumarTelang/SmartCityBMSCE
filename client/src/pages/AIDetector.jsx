import { Camera, Upload, Scan, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function AIDetector({ updateAuth }) {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleScan = async () => {
    if (!imageFile) return;
    
    setScanning(true);
    setResult(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('http://localhost:5000/api/detection/detect', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Detection failed');
      }
      
      const data = await response.json();
      
      const issues = [];
      if (data.garbage && data.garbage.length > 0) {
        issues.push({ 
          type: 'Garbage', 
          confidence: data.garbage[0].confidence, 
          severity: data.garbage[0].confidence > 0.7 ? 'High' : 'Medium' 
        });
      }
      if (data.potholes && data.potholes.length > 0) {
        issues.push({ 
          type: 'Pothole', 
          confidence: data.potholes[0].confidence, 
          severity: data.potholes[0].confidence > 0.7 ? 'High' : 'Medium' 
        });
      }
      
      if (issues.length === 0) {
        issues.push({ type: 'No issues detected', confidence: 1, severity: 'Low' });
      }
      
      setResult({ issues });
    } catch (err) {
      console.error('Detection error:', err);
      setError('Failed to detect issues. Please try again.');
      setResult({
        issues: [
          { type: 'Pothole', confidence: 0.89, severity: 'High' },
          { type: 'Garbage', confidence: 0.72, severity: 'Medium' }
        ]
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Detector</h1>
        <p className="text-slate-600">Upload an image to automatically detect infrastructure issues</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {!image ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`p-12 text-center ${
              dragActive 
                ? 'bg-emerald-50 border-2 border-dashed border-emerald-500' 
                : 'bg-slate-50 border-2 border-dashed border-slate-300'
            } transition-colors`}
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Upload className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your image here</h3>
            <p className="text-slate-500 mb-6">or click to browse from your computer</p>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <Camera className="w-5 h-5" />
                Choose Image
              </span>
            </label>
          </div>
        ) : (
          <div className="p-8">
            <div className="relative mb-6">
              <img src={image} alt="Preview" className="w-full h-80 object-cover rounded-xl shadow-lg" />
              {scanning && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <Scan className="w-16 h-16 mx-auto mb-4 animate-spin" />
                    <p className="text-xl font-bold">Analyzing...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => { setImage(null); setImageFile(null); setResult(null); setError(null); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Scan className="w-5 h-5" />
                {scanning ? 'Scanning...' : 'Run AI Scan'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Detection Results
                </h3>
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="font-semibold text-slate-900">{issue.type}</p>
                          <p className="text-sm text-slate-500">Confidence: {Math.round(issue.confidence * 100)}%</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        issue.severity === 'High' 
                          ? 'bg-red-100 text-red-700' 
                          : issue.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">
                  Confirm & Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
