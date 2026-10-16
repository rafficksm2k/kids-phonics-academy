import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', requireAdminAuth, createProduct);
router.put('/:id', requireAdminAuth, updateProduct);
router.delete('/:id', requireAdminAuth, deleteProduct);

export default router;
