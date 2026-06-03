// Database configuration - using mock data mode
// Prisma is only imported when actually needed (when using real database)

let prisma = null;

// Test database connection
export async function connectDatabase() {
  try {
    // Only import Prisma when actually connecting to database
    if (!prisma) {
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient();
    }
    await prisma.$connect();
    console.log('Database connected successfully');
    return prisma;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Disconnect database
export async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
  }
}

// Export a getter that only creates PrismaClient when needed
export default new Proxy({}, {
  get(target, prop) {
    if (!prisma) {
      throw new Error('Database not initialized. Call connectDatabase() first, or use mock data mode.');
    }
    return prisma[prop];
  }
});

