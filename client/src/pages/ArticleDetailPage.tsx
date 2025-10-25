import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { apiService } from '../services/api';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  language: string;
  author_name: string;
  featured_image?: string;
  view_count: number;
  published_at: string;
}

export const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getArticle(articleSlug);
      setArticle(data.article);
    } catch (error: any) {
      console.error('Error loading article:', error);
      if (error.response?.status === 404) {
        setError('Article not found');
      } else {
        setError('Failed to load article. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      basics: 'Basics',
      science: 'Science',
      'how-to': 'How To',
      impact: 'Impact',
      action: 'Take Action',
      news: 'News',
    };
    return labels[category] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Article not found'}
          </h2>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Image Section */}
      {article.featured_image ? (
        <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Title Overlay on Hero */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 text-sm font-semibold rounded-full">
                  {getCategoryLabel(article.category)}
                </span>
                <span className="text-sm text-white/90">{article.view_count} views</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-lg md:text-xl text-white/95 mb-4 drop-shadow-md max-w-3xl">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-white/90">
                <span className="font-medium">{article.author_name}</span>
                <span>•</span>
                <span>{formatDate(article.published_at)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Header without Hero Image */
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                {getCategoryLabel(article.category)}
              </span>
              <span className="text-sm text-gray-500">{article.view_count} views</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="font-medium">{article.author_name}</span>
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <article className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {article.content}
            </ReactMarkdown>
          </article>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg mb-6">
            Start measuring light pollution in your area and contribute to our global database.
          </p>
          <Link
            to="/upload"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Upload Your First Reading
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Read More Articles
          </Link>
        </div>
      </div>
    </div>
  );
};
