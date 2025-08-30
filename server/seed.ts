import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      dob: new Date('1990-01-01'),
      password: 'test123'
    }
  });

  console.log('✅ User created:', user.email);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Laptop',
        percentage: 25,
        color: '#3B82F6',
        price: 999.99,
        category: 'Electronics',
        stock: 50,
        description: 'High-performance laptop',
        userId: user.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Smartphone',
        percentage: 30,
        color: '#10B981',
        price: 699.99,
        category: 'Electronics',
        stock: 100,
        description: 'Latest smartphone model',
        userId: user.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Headphones',
        percentage: 20,
        color: '#F59E0B',
        price: 199.99,
        category: 'Audio',
        stock: 75,
        description: 'Wireless noise-canceling headphones',
        userId: user.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Tablet',
        percentage: 25,
        color: '#8B5CF6',
        price: 399.99,
        category: 'Electronics',
        stock: 30,
        description: 'Portable tablet device',
        userId: user.id
      }
    })
  ]);

  console.log('✅ Products created:', products.length);

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        status: 'active',
        totalSpent: 1500.00,
        userId: user.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        country: 'USA',
        status: 'vip',
        totalSpent: 2500.00,
        userId: user.id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1234567892',
        address: '789 Pine Rd',
        city: 'Chicago',
        country: 'USA',
        status: 'active',
        totalSpent: 800.00,
        userId: user.id
      }
    })
  ]);

  console.log('✅ Customers created:', customers.length);

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-001',
        customerId: customers[0].id,
        status: 'delivered',
        totalAmount: 999.99,
        shippingAddress: '123 Main St, New York, NY 10001',
        paymentMethod: 'credit_card',
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: 999.99,
              total: 999.99
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-002',
        customerId: customers[1].id,
        status: 'shipped',
        totalAmount: 1399.98,
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
        paymentMethod: 'credit_card',
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: products[1].id,
              quantity: 2,
              price: 699.99,
              total: 1399.98
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-003',
        customerId: customers[2].id,
        status: 'pending',
        totalAmount: 199.99,
        shippingAddress: '789 Pine Rd, Chicago, IL 60601',
        paymentMethod: 'debit_card',
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: products[2].id,
              quantity: 1,
              price: 199.99,
              total: 199.99
            }
          ]
        }
      }
    })
  ]);

  console.log('✅ Orders created:', orders.length);

  // Create sample activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        week: 'Week 1',
        guest: 150,
        userCount: 120,
        userId: user.id
      }
    }),
    prisma.activity.create({
      data: {
        week: 'Week 2',
        guest: 180,
        userCount: 140,
        userId: user.id
      }
    }),
    prisma.activity.create({
      data: {
        week: 'Week 3',
        guest: 200,
        userCount: 160,
        userId: user.id
      }
    }),
    prisma.activity.create({
      data: {
        week: 'Week 4',
        guest: 220,
        userCount: 180,
        userId: user.id
      }
    })
  ]);

  console.log('✅ Activities created:', activities.length);

  // Create sample notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Welcome to Dashboard',
        message: 'Your dashboard is ready with sample data',
        type: 'info',
        userId: user.id
      }
    }),
    prisma.notification.create({
      data: {
        title: 'New Order Received',
        message: 'Order ORD-001 has been placed',
        type: 'success',
        userId: user.id
      }
    })
  ]);

  console.log('✅ Notifications created:', notifications.length);

  // Create user settings
  const userSettings = await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true
    }
  });

  console.log('✅ User settings created');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Sample data created for user: ${user.email}`);
  console.log(`📦 Products: ${products.length}`);
  console.log(`👥 Customers: ${customers.length}`);
  console.log(`📋 Orders: ${orders.length}`);
  console.log(`📈 Activities: ${activities.length}`);
  console.log(`🔔 Notifications: ${notifications.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
