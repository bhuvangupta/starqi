import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoUpload } from '../components/PhotoUpload';
import { SEO } from '../components/SEO';
import { StructuredData, createBreadcrumbSchema } from '../components/StructuredData';

export const UploadPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Upload', url: '/upload' },
  ]);

  return (
    <>
      <SEO
        title={t('upload.pageTitle')}
        description={t('upload.pageDescription')}
        keywords="upload sky photo, measure light pollution, sky quality meter, upload night sky, citizen science contribution, SQM measurement"
        url="/upload"
        locale={i18n.language}
      />
      <StructuredData data={breadcrumbs} />

      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('upload.pageTitle')}</h1>
          <p className="text-gray-600 mt-2">
            {t('upload.pageDescription')}
          </p>
        </div>
        <PhotoUpload />
      </div>
    </>
  );
};
