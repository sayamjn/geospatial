import { useState } from 'react';
import { uploadFile } from '../utils/api';

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = JSON.parse(e.target.result);
        const uploadedFile = await uploadFile(file);
        onUploadSuccess({ ...uploadedFile, content });
      };
      reader.readAsText(file);
      
      setFile(null);
    } catch (error) {
      console.error('File upload failed', error);
      setError(error.message || 'File upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">GeoJSON or KML (MAX. 10MB)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".geojson,.kml" />
        </label>
      </div>
      {file && <p className="text-sm text-gray-500">{file.name}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!file}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Upload
      </button>
    </form>
  );
}