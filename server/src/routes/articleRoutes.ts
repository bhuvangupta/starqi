import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  getAllArticlesAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
} from '../controllers/articleController';

const router = Router();

/**
 * Public Routes
 */

// Get all published articles
router.get('/', getArticles);

// Get article categories
router.get('/categories', getCategories);

// Get single article by slug
router.get('/:slug', getArticleBySlug);

/**
 * Admin Routes
 * TODO: Add authentication middleware to protect these routes
 */

// Get all articles (including drafts)
router.get('/admin/all', getAllArticlesAdmin);

// Create new article
router.post('/admin/create', createArticle);

// Update article
router.put('/admin/:id', updateArticle);

// Delete article
router.delete('/admin/:id', deleteArticle);

export default router;
