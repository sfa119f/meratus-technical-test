import { ResourceNotFoundError, UnprocessableEntityError } from '../exceptions';
import * as orderRepository from '../repositories/order.repo';
import { Prisma, $Enums } from '@prisma/client';

export async function createOrder(params: {
  senderName: string;
  recipientName: string;
  origin: string;
  destination: string;
}) {
  const createdOrder = await orderRepository.createOrder({
    senderName: params.senderName,
    recipientName: params.recipientName,
    origin: params.origin,
    destination: params.destination,
    status: $Enums.OrderStatus.PENDING,
  });

  return createdOrder;
}

export async function updateOrderStatus(id: string, status: string) {
  // Validation
  if (
    !Object.values($Enums.OrderStatus).includes(status as $Enums.OrderStatus)
  ) {
    throw new UnprocessableEntityError(
      Object.values($Enums.OrderStatus).toString(),
    );
  }

  // Check if order exists
  const existingOrder = await orderRepository.findOneOrderById(id);
  if (!existingOrder) {
    throw new ResourceNotFoundError(`Order with ID ${id} does not exist`);
  }

  if (existingOrder.status === (status as $Enums.OrderStatus)) {
    throw new UnprocessableEntityError('Changes status same as existing order');
  }

  const updatedOrder = await orderRepository.updateOrder(id, {
    status: status as $Enums.OrderStatus,
  });

  return updatedOrder;
}

export async function cancelOrder(id: string) {
  // Check if order exists
  const existingOrder = await orderRepository.findOneOrderById(id);
  if (!existingOrder) {
    throw new ResourceNotFoundError(`Order with ID ${id} does not exist`);
  }

  // Check if order can be canceled
  if (existingOrder.status === $Enums.OrderStatus.IN_TRANSIT) {
    throw new UnprocessableEntityError('In transit orders cannot be canceled');
  }
  if (existingOrder.status === $Enums.OrderStatus.DELIVERED) {
    throw new UnprocessableEntityError('Delivered orders cannot be canceled');
  }
  if (existingOrder.status === $Enums.OrderStatus.CANCELED) {
    throw new UnprocessableEntityError('This order has already been canceled');
  }

  const canceledOrder = await orderRepository.updateOrder(id, {
    status: $Enums.OrderStatus.CANCELED,
  });

  return canceledOrder;
}

export async function getListOrders(params: {
  page: number;
  limit: number;
  status?: string;
  sender?: string;
  recipient?: string;
}) {
  const offset = (Number(params.page) - 1) * Number(params.limit);

  const where: Prisma.OrderWhereInput = {};
  if (params.status && params.status !== 'all') {
    Object.assign(where, {
      status: params.status as $Enums.OrderStatus,
    } as Prisma.OrderWhereInput);
  }
  if (params.sender) {
    Object.assign(where, {
      senderName: {
        contains: params.sender,
        mode: 'insensitive',
      },
    } as Prisma.OrderWhereInput);
  }
  if (params.recipient) {
    Object.assign(where, {
      recipientName: {
        contains: params.recipient,
        mode: 'insensitive',
      },
    } as Prisma.OrderWhereInput);
  }

  const [orders, count] = await orderRepository.findManyAndCountOrders(
    where,
    { createdAt: 'desc' },
    offset,
    params.limit,
  );

  return { data: orders, total: count };
}

export async function getDetailOrderById(id: string) {
  const order = await orderRepository.findOneOrderById(id);
  return order;
}
