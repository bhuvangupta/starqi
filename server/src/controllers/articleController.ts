import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Article, ArticleStatus } from '../models/Article';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get all published articles (public)
 */
export const getArticles = async (req: Request, res: Response) => {
  try {
    const { category, language, limit = '10', offset = '0' } = req.query;

    const articleRepo = AppDataSource.getRepository(Article);
    const query = articleRepo
      .createQueryBuilder('article')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .orderBy('article.published_at', 'DESC');

    if (category) {
      query.andWhere('article.category = :category', { category });
    }

    if (language) {
      query.andWhere('article.language = :language', { language });
    }

    const [articles, total] = await query
      .skip(parseInt(offset as string))
      .take(parseInt(limit as string))
      .getManyAndCount();

    res.json({
      articles,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

/**
 * Get single article by slug (public)
 */
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({
      where: { slug, status: ArticleStatus.PUBLISHED },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    article.view_count += 1;
    await articleRepo.save(article);

    res.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

/**
 * Get all articles including drafts (admin only)
 */
export const getAllArticlesAdmin = async (req: Request, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    const articleRepo = AppDataSource.getRepository(Article);
    const query = articleRepo
      .createQueryBuilder('article')
      .orderBy('article.created_at', 'DESC');

    if (status) {
      query.where('article.status = :status', { status });
    }

    const [articles, total] = await query
      .skip(parseInt(offset as string))
      .take(parseInt(limit as string))
      .getManyAndCount();

    res.json({
      articles,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

/**
 * Create new article (admin only)
 */
export const createArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      language,
      author_name,
      featured_image,
      tags,
      status,
    } = req.body;

    // Validation
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const articleRepo = AppDataSource.getRepository(Article);

    // Check if slug already exists
    const existingArticle = await articleRepo.findOne({ where: { slug } });
    if (existingArticle) {
      return res.status(400).json({ error: 'Article with this slug already exists' });
    }

    const article = new Article();
    article.id = uuidv4();
    article.title = title;
    article.slug = slug;
    article.excerpt = excerpt;
    article.content = content;
    article.category = category || 'basics';
    article.language = language || 'en';
    article.author_name = author_name || 'StarQI Team';
    article.featured_image = featured_image;
    article.tags = tags;
    article.status = status || ArticleStatus.DRAFT;

    if (status === ArticleStatus.PUBLISHED && !article.published_at) {
      article.published_at = new Date();
    }

    // TODO: Set author_id from authenticated user
    // article.author_id = req.user?.id;

    await articleRepo.save(article);

    res.status(201).json({
      message: 'Article created successfully',
      article,
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

/**
 * Update article (admin only)
 */
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      language,
      author_name,
      featured_image,
      tags,
      status,
    } = req.body;

    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({ where: { id } });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== article.slug) {
      const existingArticle = await articleRepo.findOne({ where: { slug } });
      if (existingArticle) {
        return res.status(400).json({ error: 'Article with this slug already exists' });
      }
      article.slug = slug;
    }

    // Update fields
    if (title) article.title = title;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (content) article.content = content;
    if (category) article.category = category;
    if (language) article.language = language;
    if (author_name) article.author_name = author_name;
    if (featured_image !== undefined) article.featured_image = featured_image;
    if (tags !== undefined) article.tags = tags;

    // Handle status change
    if (status && status !== article.status) {
      article.status = status;
      if (status === ArticleStatus.PUBLISHED && !article.published_at) {
        article.published_at = new Date();
      }
    }

    await articleRepo.save(article);

    res.json({
      message: 'Article updated successfully',
      article,
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

/**
 * Delete article (admin only)
 */
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({ where: { id } });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await articleRepo.remove(article);

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

/**
 * Get article categories (public)
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);

    const categories = await articleRepo
      .createQueryBuilder('article')
      .select('article.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .groupBy('article.category')
      .getRawMany();

    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
