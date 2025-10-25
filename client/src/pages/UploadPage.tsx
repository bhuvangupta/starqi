import React from 'react';
import { PhotoUpload } from '../components/PhotoUpload';

export const UploadPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Upload Night Sky Photo</h1>
        <p className="text-gray-600 mt-2">
          Take a photo of the night sky and we'll analyze the light pollution level for you.
        </p>
      </div>
      <PhotoUpload />
    </div>
  );
};
