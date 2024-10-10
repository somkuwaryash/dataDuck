// src/components/FileUpload.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const FileUpload: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);
    handleFileUpload(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    multiple: false,
  });

  const handleFileUpload = async (file: File) => {
    setUploadStatus('idle');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('success');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
        }`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-4xl mb-4 text-primary-500" />
        <p className="text-lg mb-2">Drag & drop your file here, or click to select</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Supported formats: CSV, Excel, JSON</p>
      </div>

      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="font-semibold">{uploadedFile.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg flex items-center">
          <FiCheckCircle className="mr-2" />
          File uploaded successfully!
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg flex items-center">
          <FiAlertCircle className="mr-2" />
          Upload failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default FileUpload;