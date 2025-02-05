// src/components/FileUpload.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
          onClick={() => onUpload(file)}
        >
          Upload
        </motion.button>
      )}
    </motion.div>
  );
};

export default FileUpload;

// Add similar component files for History.jsx and Profile.jsx following the same pattern