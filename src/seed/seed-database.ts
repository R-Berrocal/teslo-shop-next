import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {
  //1. clean db
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.country.deleteMany();

  const { categories, products, users } = initialData;

  //Users
  await prisma.user.createMany({ data: users });

  //Categories
  const categoriesData = categories.map((name) => ({ name }));
  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDb = await prisma.category.findMany();

  const categoriesMap = categoriesDb.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  //Products
  products.forEach(async ({ images, type, ...product }) => {
    const dbProduct = await prisma.product.create({
      data: {
        ...product,
        categoryId: categoriesMap[type],
      },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  // Countries
  await prisma.country.createMany({
    data: countries,
  });

  console.log('Seeded successfully');
}

(() => {
  if (process.env.NODE_ENV == 'production') return;

  main();
})();
