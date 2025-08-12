import { PrismaClient, $Enums } from '@prisma/client';
import {} from 'ts-node';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Sample orders
  const sampleOrders = [
    {
      id: 'INV--1',
      senderName: 'John Doe',
      recipientName: 'Jane Smith',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      status: $Enums.OrderStatus.PENDING,
    },
    {
      id: 'INV--2',
      senderName: 'Alice Johnson',
      recipientName: 'Bob Wilson',
      origin: 'Chicago, IL',
      destination: 'Miami, FL',
      status: $Enums.OrderStatus.IN_TRANSIT,
    },
    {
      id: 'INV--3',
      senderName: 'Michael Brown',
      recipientName: 'Sarah Davis',
      origin: 'Seattle, WA',
      destination: 'Denver, CO',
      status: $Enums.OrderStatus.DELIVERED,
    },
    {
      id: 'INV--4',
      senderName: 'David Miller',
      recipientName: 'Emma Garcia',
      origin: 'Boston, MA',
      destination: 'Austin, TX',
      status: $Enums.OrderStatus.CANCELED,
    },
    {
      id: 'INV--5',
      senderName: 'Chris Anderson',
      recipientName: 'Lisa Martinez',
      origin: 'Portland, OR',
      destination: 'Phoenix, AZ',
      status: $Enums.OrderStatus.PENDING,
    },
  ];

  // Create sample orders
  for (const orderData of sampleOrders) {
    const order = await prisma.order.create({
      data: orderData,
    });
    console.log(
      `✅ Created order: ${order.id} - ${order.senderName} to ${order.recipientName}`,
    );
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
