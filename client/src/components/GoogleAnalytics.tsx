import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only load GA if measurement ID is provided
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics Measurement ID not found in environment variables');
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll handle page views manually
    });

    return () => {
      // Cleanup on unmount
      document.head.removeChild(script1);
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    // Send page view event
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);

  return null; // This component doesn't render anything
};

// Helper function to track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  window.gtag('event', eventName, eventParams);
};

// Predefined event trackers
export const GAEvents = {
  // Upload events
  uploadPhoto: (location: string) => {
    trackEvent('upload_photo', {
      event_category: 'engagement',
      event_label: 'Sky Photo Upload',
      location: location,
    });
  },

  // Blog events
  readArticle: (articleTitle: string, articleSlug: string) => {
    trackEvent('read_article', {
      event_category: 'engagement',
      event_label: articleTitle,
      article_slug: articleSlug,
    });
  },

  // Sharing events
  shareContent: (contentType: string, method: string) => {
    trackEvent('share', {
      event_category: 'engagement',
      content_type: contentType,
      method: method,
    });
  },

  // Download events
  downloadData: (dataType: string) => {
    trackEvent('download', {
      event_category: 'engagement',
      event_label: dataType,
    });
  },

  // Navigation events
  clickExternalLink: (url: string, linkText: string) => {
    trackEvent('click_external_link', {
      event_category: 'navigation',
      event_label: linkText,
      url: url,
    });
  },

  // Search events
  search: (searchTerm: string, resultsCount: number) => {
    trackEvent('search', {
      event_category: 'engagement',
      search_term: searchTerm,
      results_count: resultsCount,
    });
  },

  // User engagement
  changeLanguage: (fromLang: string, toLang: string) => {
    trackEvent('change_language', {
      event_category: 'engagement',
      from_language: fromLang,
      to_language: toLang,
    });
  },

  // Map interactions
  viewMapLocation: (latitude: number, longitude: number, location: string) => {
    trackEvent('view_map_location', {
      event_category: 'engagement',
      event_label: location,
      latitude: latitude,
      longitude: longitude,
    });
  },

  // Impact dashboard
  viewImpactDashboard: () => {
    trackEvent('view_impact_dashboard', {
      event_category: 'engagement',
    });
  },

  // Newsletter/Contact
  submitContact: (formType: string) => {
    trackEvent('submit_contact', {
      event_category: 'conversion',
      form_type: formType,
    });
  },
};
