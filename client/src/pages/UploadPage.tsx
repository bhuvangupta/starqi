import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoUpload } from '../components/PhotoUpload';

export const UploadPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('upload.pageTitle')}</h1>
        <p className="text-gray-600 mt-2">
          {t('upload.pageDescription')}
        </p>
      </div>
      <PhotoUpload />
    </div>
  );
};
