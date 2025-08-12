import { Prisma } from '@prisma/client';
import { prisma } from '../database/connection';

export async function createOrder(data: Prisma.OrderCreateInput) {
  return await prisma.order.create({ data: data });
}

export async function updateOrder(id: string, data: Prisma.OrderUpdateInput) {
  return await prisma.order.update({ where: { id }, data: data });
}

export async function findManyAndCountOrders(
  where: Prisma.OrderWhereInput,
  orderBy: Prisma.OrderOrderByWithRelationInput,
  offset: number,
  limit: number,
) {
  return await Promise.all([
    prisma.order.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
}

export async function findOneOrderById(id: string) {
  return await prisma.order.findUnique({ where: { id } });
}
