import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all reports with pagination
export const getReports = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, limit = 10, type = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { generatedAt: 'desc' }
      }),
      prisma.report.count({ where })
    ]);

    res.json({
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// Get report by ID
export const getReportById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const report = await prisma.report.findFirst({
      where: { id, userId }
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

// Generate sales report
export const generateSalesReport = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { startDate, endDate, filters } = req.body;

    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    // Get sales data
    const salesData = await prisma.order.findMany({
      where: {
        userId,
        orderDate: {
          gte: start,
          lte: end
        },
        status: { not: 'cancelled' }
      },
      include: {
        customer: {
          select: { name: true, email: true }
        },
        orderItems: {
          include: {
            product: {
              select: { name: true, category: true }
            }
          }
        }
      },
      orderBy: { orderDate: 'desc' }
    });

    // Calculate totals
    const totalRevenue = salesData.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = salesData.length;
    const totalItems = salesData.reduce((sum, order) => 
      sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Group by date
    const dailySales = salesData.reduce((acc, order) => {
      const date = order.orderDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { revenue: 0, orders: 0, items: 0 };
      }
      acc[date].revenue += order.totalAmount;
      acc[date].orders += 1;
      acc[date].items += order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      return acc;
    }, {} as any);

    // Top products
    const productSales = salesData.reduce((acc, order) => {
      order.orderItems.forEach(item => {
        const productName = item.product.name;
        if (!acc[productName]) {
          acc[productName] = { quantity: 0, revenue: 0 };
        }
        acc[productName].quantity += item.quantity;
        acc[productName].revenue += item.total;
      });
      return acc;
    }, {} as any);

    const topProducts = Object.entries(productSales)
      .map(([name, data]: [string, any]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Top customers
    const customerSales = salesData.reduce((acc, order) => {
      const customerName = order.customer.name;
      if (!acc[customerName]) {
        acc[customerName] = { orders: 0, revenue: 0 };
      }
      acc[customerName].orders += 1;
      acc[customerName].revenue += order.totalAmount;
      return acc;
    }, {} as any);

    const topCustomers = Object.entries(customerSales)
      .map(([name, data]: [string, any]) => ({
        name,
        orders: data.orders,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const reportContent = {
      summary: {
        totalRevenue,
        totalOrders,
        totalItems,
        period: { start, end }
      },
      dailySales,
      topProducts,
      topCustomers,
      filters: filters || {}
    };

    // Save report to database
    const report = await prisma.report.create({
      data: {
        title: `Sales Report ${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
        type: 'sales',
        content: JSON.stringify(reportContent),
        filters: JSON.stringify(filters || {}),
        userId
      }
    });

    res.json({
      report,
      data: reportContent
    });
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ error: "Failed to generate sales report" });
  }
};

// Generate inventory report
export const generateInventoryReport = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { filters } = req.body;

    // Get inventory data
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { stock: 'asc' }
    });

    // Calculate inventory metrics
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock !== null && p.stock < 10);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    const totalStockValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0);

    // Group by category
    const categoryInventory = products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, totalStock: 0, totalValue: 0 };
      }
      acc[category].count += 1;
      acc[category].totalStock += product.stock || 0;
      acc[category].totalValue += (product.stock || 0) * (product.price || 0);
      return acc;
    }, {} as any);

    const reportContent = {
      summary: {
        totalProducts,
        lowStockProducts: lowStockProducts.length,
        outOfStockProducts: outOfStockProducts.length,
        totalStockValue
      },
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        price: p.price,
        category: p.category
      })),
      outOfStockProducts: outOfStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category
      })),
      categoryInventory,
      filters: filters || {}
    };

    // Save report to database
    const report = await prisma.report.create({
      data: {
        title: `Inventory Report ${new Date().toISOString().split('T')[0]}`,
        type: 'inventory',
        content: JSON.stringify(reportContent),
        filters: JSON.stringify(filters || {}),
        userId
      }
    });

    res.json({
      report,
      data: reportContent
    });
  } catch (error) {
    console.error("Error generating inventory report:", error);
    res.status(500).json({ error: "Failed to generate inventory report" });
  }
};

// Generate customer report
export const generateCustomerReport = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { filters } = req.body;

    // Get customer data
    const customers = await prisma.customer.findMany({
      where: { userId },
      include: {
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { totalSpent: 'desc' }
    });

    // Calculate customer metrics
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const vipCustomers = customers.filter(c => c.status === 'vip').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageOrderValue = totalRevenue / customers.filter(c => c._count.orders > 0).length || 0;

    // Customer segments
    const customerSegments = {
      vip: customers.filter(c => c.totalSpent >= 1000),
      regular: customers.filter(c => c.totalSpent >= 100 && c.totalSpent < 1000),
      new: customers.filter(c => c.totalSpent < 100)
    };

    // Geographic distribution
    const geographicDistribution = customers.reduce((acc, customer) => {
      const country = customer.country || 'Unknown';
      if (!acc[country]) {
        acc[country] = { count: 0, revenue: 0 };
      }
      acc[country].count += 1;
      acc[country].revenue += customer.totalSpent;
      return acc;
    }, {} as any);

    const reportContent = {
      summary: {
        totalCustomers,
        activeCustomers,
        vipCustomers,
        totalRevenue,
        averageOrderValue
      },
      customerSegments,
      geographicDistribution,
      topCustomers: customers.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        totalSpent: c.totalSpent,
        orderCount: c._count.orders,
        status: c.status
      })),
      filters: filters || {}
    };

    // Save report to database
    const report = await prisma.report.create({
      data: {
        title: `Customer Report ${new Date().toISOString().split('T')[0]}`,
        type: 'customer',
        content: JSON.stringify(reportContent),
        filters: JSON.stringify(filters || {}),
        userId
      }
    });

    res.json({
      report,
      data: reportContent
    });
  } catch (error) {
    console.error("Error generating customer report:", error);
    res.status(500).json({ error: "Failed to generate customer report" });
  }
};

// Delete report
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const report = await prisma.report.findFirst({
      where: { id, userId }
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    await prisma.report.delete({
      where: { id }
    });

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
};
