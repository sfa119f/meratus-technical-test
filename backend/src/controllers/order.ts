import { Request, Response } from 'express';
import * as orderService from '../services/order';
import { ResourceNotFoundError, UnprocessableEntityError } from '../exceptions';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { senderName, recipientName, origin, destination } = req.body;

    // Validation
    if (!senderName || !recipientName || !origin || !destination) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['senderName', 'recipientName', 'origin', 'destination'],
      });
    }

    const order = await orderService.createOrder({
      senderName: senderName.trim(),
      recipientName: recipientName.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Failed to create order',
      message: error.message,
    });
  }
};

export const updateStatusOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({
        error: 'Status is required',
        validStatuses: ['PENDING', 'IN_TRANSIT', 'DELIVERED'],
      });
    }

    const updatedOrder = await orderService.updateOrderStatus(id, status);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    if (error instanceof UnprocessableEntityError) {
      return res.status(422).json({
        error: 'Cannot update order status',
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'Failed to update order status',
      message: error.message,
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const canceledOrder = await orderService.cancelOrder(id);

    res.json({
      success: true,
      message: 'Order canceled successfully',
      data: canceledOrder,
    });
  } catch (error: any) {
    console.error('Get orders error:', error);
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({
        error: 'Order not found',
        message: error.message,
      });
    }
    if (error instanceof UnprocessableEntityError) {
      return res.status(422).json({
        error: 'Cannot cancel order',
        message: error.message,
      });
    }
    res.status(500).json({
      error: 'Failed to fetch orders',
      message: error.message,
    });
  }
};

export const getListOrders = async (req: Request, res: Response) => {
  try {
    const { status, sender, recipient, id, page = 1, limit = 10 } = req.query;

    const { data, total } = await orderService.getListOrders({
      page: Number(page),
      limit: Number(limit),
      id: id ? String(id) : undefined,
      status: status ? String(status) : undefined,
      sender: sender ? String(sender) : undefined,
      recipient: recipient ? String(recipient) : undefined,
    });

    res.json({
      success: true,
      data: data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      message: error.message,
    });
  }
};

export const getDetailOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await orderService.getDetailOrderById(id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: `Order with ID ${id} does not exist`,
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Get order detail error:', error);
    res.status(500).json({
      error: 'Failed to fetch order details',
      message: error.message,
    });
  }
};
