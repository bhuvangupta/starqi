import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationSchema {
  type: 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingDate?: string;
  founders?: Array<{ name: string }>;
  contactPoint?: {
    contactType: string;
    email: string;
  };
  sameAs?: string[];
}

interface WebsiteSchema {
  type: 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    type: string;
    target: string;
    queryInput: string;
  };
}

interface ArticleSchema {
  type: 'Article' | 'BlogPosting';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    type: string;
    name: string;
  };
  publisher: {
    type: string;
    name: string;
    logo: {
      type: string;
      url: string;
    };
  };
}

interface BreadcrumbSchema {
  type: 'BreadcrumbList';
  itemListElement: Array<{
    type: string;
    position: number;
    name: string;
    item: string;
  }>;
}

interface HowToSchema {
  type: 'HowTo';
  name: string;
  description: string;
  step: Array<{
    type: string;
    name: string;
    text: string;
    image?: string;
  }>;
}

interface FAQSchema {
  type: 'FAQPage';
  mainEntity: Array<{
    type: string;
    name: string;
    acceptedAnswer: {
      type: string;
      text: string;
    };
  }>;
}

type SchemaType = OrganizationSchema | WebsiteSchema | ArticleSchema | BreadcrumbSchema | HowToSchema | FAQSchema;

interface StructuredDataProps {
  data: SchemaType | SchemaType[];
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const generateSchema = (schema: SchemaType) => {
    const baseSchema = {
      '@context': 'https://schema.org',
    };

    switch (schema.type) {
      case 'Organization':
        return {
          ...baseSchema,
          '@type': 'Organization',
          name: schema.name,
          url: schema.url,
          logo: schema.logo,
          description: schema.description,
          foundingDate: schema.foundingDate,
          founders: schema.founders,
          contactPoint: schema.contactPoint,
          sameAs: schema.sameAs,
        };

      case 'WebSite':
        return {
          ...baseSchema,
          '@type': 'WebSite',
          name: schema.name,
          url: schema.url,
          description: schema.description,
          potentialAction: schema.potentialAction,
        };

      case 'Article':
      case 'BlogPosting':
        return {
          ...baseSchema,
          '@type': schema.type,
          headline: schema.headline,
          description: schema.description,
          image: schema.image,
          datePublished: schema.datePublished,
          dateModified: schema.dateModified,
          author: {
            '@type': schema.author.type,
            name: schema.author.name,
          },
          publisher: {
            '@type': schema.publisher.type,
            name: schema.publisher.name,
            logo: {
              '@type': schema.publisher.logo.type,
              url: schema.publisher.logo.url,
            },
          },
        };

      case 'BreadcrumbList':
        return {
          ...baseSchema,
          '@type': 'BreadcrumbList',
          itemListElement: schema.itemListElement.map((item) => ({
            '@type': item.type,
            position: item.position,
            name: item.name,
            item: item.item,
          })),
        };

      case 'HowTo':
        return {
          ...baseSchema,
          '@type': 'HowTo',
          name: schema.name,
          description: schema.description,
          step: schema.step.map((step) => ({
            '@type': step.type,
            name: step.name,
            text: step.text,
            image: step.image,
          })),
        };

      case 'FAQPage':
        return {
          ...baseSchema,
          '@type': 'FAQPage',
          mainEntity: schema.mainEntity.map((item) => ({
            '@type': item.type,
            name: item.name,
            acceptedAnswer: {
              '@type': item.acceptedAnswer.type,
              text: item.acceptedAnswer.text,
            },
          })),
        };

      default:
        return baseSchema;
    }
  };

  const schemas = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(generateSchema(schema))}
        </script>
      ))}
    </Helmet>
  );
};

// Helper functions to create common schemas
export const createOrganizationSchema = (): OrganizationSchema => ({
  type: 'Organization',
  name: 'SkyQI',
  url: 'https://skyqi.in',
  logo: 'https://skyqi.in/logo.png',
  description: 'A global platform for measuring and tracking light pollution through citizen science and sky quality monitoring.',
  foundingDate: '2024',
  contactPoint: {
    contactType: 'Customer Service',
    email: 'contact@skyqi.org',
  },
  sameAs: [
    'https://github.com/yourusername/skyqi',
  ],
});

export const createWebsiteSchema = (): WebsiteSchema => ({
  type: 'WebSite',
  name: 'SkyQI - Light Pollution Portal',
  url: 'https://skyqi.in',
  description: 'Measure, track, and visualize light pollution worldwide through citizen science.',
  potentialAction: {
    type: 'SearchAction',
    target: 'https://skyqi.in/blog?search={search_term_string}',
    queryInput: 'required name=search_term_string',
  },
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>): BreadcrumbSchema => ({
  type: 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    type: 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://skyqi.in${item.url}`,
  })),
});
