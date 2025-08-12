import { Router } from 'express';
import {
  createOrder,
  getDetailOrder,
  getListOrders,
  updateStatusOrder,
} from '../controllers/order';
import { cancelOrder } from '../services/order';

const router = Router();

// Create new order
router.post('/', createOrder);

// Get all orders (order list)
router.get('/', getListOrders);

// Get order by ID (order detail)
router.get('/:id', getDetailOrder);

// Update order status
router.patch('/:id/status', updateStatusOrder);

// Cancel order (specific endpoint for cancellation)
router.patch('/:id/cancel', cancelOrder);

export default router;
