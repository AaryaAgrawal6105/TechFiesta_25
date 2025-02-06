// src/components/FileUpload.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import axios from 'axios'; // We will use axios for file upload

const FileUpload = ({ userId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false); // Track upload status

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file upload to the backend
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('user_id', userId);
    formData.append('title', 'Assignment Title'); // Replace with actual title
    formData.append('content', 'Assignment Content'); // Replace with actual content
    formData.append('submitted_at', new Date().toISOString()); // Use actual date

    try {
      setUploading(true);
      // Make a POST request to upload the file
      const response = await axios.post('http://localhost:3000/api/assignments/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUploading(false);
      onUploadSuccess(response.data); // Update parent component with success response
      alert('Assignment submitted successfully!');
    } catch (error) {
      setUploading(false);
      console.error('Error during file upload', error);
      alert('Failed to submit assignment');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-dark-lighter hover:border-primary'
        }`}
        onDragEnter={(e) => {
          handleDrag(e);
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          handleDrag(e);
          setIsDragging(false);
        }}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mx-auto mb-2" />
          <p>Click to upload or drag and drop</p>
          {file && <p className="mt-2 text-primary">{file.name}</p>}
        </label>
      </div>
      
      {file && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default FileUpload;
