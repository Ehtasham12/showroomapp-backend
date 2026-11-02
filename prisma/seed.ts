import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with dummy cars...');

  // Clear existing cars and images
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();
  console.log('Cleared existing cars and images');

  const carsWithImages = [
    {
      make: 'Honda',
      model: 'Civic 2020',
      year: 2020,
      price: 1200000,
      specs: { condition: 'Excellent', mileage: 45000, fuelType: 'Petrol', transmission: 'Automatic', color: 'Silver' },
      image: '/images/honda-civic.jpg',
    },
    {
      make: 'Toyota',
      model: 'Corolla 2019',
      year: 2019,
      price: 1100000,
      specs: { condition: 'Excellent', mileage: 52000, fuelType: 'Petrol', transmission: 'Manual', color: 'White' },
      image: '/images/toyota-corolla.jpg',
    },
    {
      make: 'Suzuki',
      model: 'Swift 2021',
      year: 2021,
      price: 950000,
      specs: { condition: 'Like New', mileage: 28000, fuelType: 'Petrol', transmission: 'Automatic', color: 'Red' },
      image: '/images/suzuki-swift.jpg',
    },
    {
      make: 'Hyundai',
      model: 'Elantra 2018',
      year: 2018,
      price: 850000,
      specs: { condition: 'Good', mileage: 78000, fuelType: 'Petrol', transmission: 'Automatic', color: 'Black' },
      image: '/images/hyundai-elantra.jpg',
    },
    {
      make: 'Kia',
      model: 'Picanto 2020',
      year: 2020,
      price: 650000,
      specs: { condition: 'Good', mileage: 34000, fuelType: 'Petrol', transmission: 'Manual', color: 'Blue' },
      image: '/images/kia-picanto.jpg',
    },
    {
      make: 'Toyota',
      model: 'Fortuner 2017',
      year: 2017,
      price: 2500000,
      specs: { condition: 'Good', mileage: 95000, fuelType: 'Diesel', transmission: 'Automatic', color: 'Silver' },
      image: '/images/toyota-fortuner.jpg',
    },
    {
      make: 'Honda',
      model: 'City 2021',
      year: 2021,
      price: 1350000,
      specs: { condition: 'Like New', mileage: 15000, fuelType: 'Petrol', transmission: 'Automatic', color: 'Gray' },
      image: '/images/honda-city.jpg',
    },
    {
      make: 'Mazda',
      model: '3 2019',
      year: 2019,
      price: 1400000,
      specs: { condition: 'Excellent', mileage: 48000, fuelType: 'Petrol', transmission: 'Automatic', color: 'White' },
      image: '/images/mazda-3.jpg',
    },
    {
      make: 'Nissan',
      model: 'X-Trail 2020',
      year: 2020,
      price: 1800000,
      specs: { condition: 'Excellent', mileage: 38000, fuelType: 'Petrol', transmission: 'Automatic', color: 'Brown' },
      image: '/images/nissan-xtrail.jpg',
    },
    {
      make: 'Mitsubishi',
      model: 'Attrage 2022',
      year: 2022,
      price: 1050000,
      specs: { condition: 'Like New', mileage: 8000, fuelType: 'Petrol', transmission: 'Manual', color: 'Silver' },
      image: '/images/mitsubishi-attrage.jpg',
    },
    {
      make: 'Volkswagen',
      model: 'Jetta 2018',
      year: 2018,
      price: 1250000,
      specs: { condition: 'Good', mileage: 65000, fuelType: 'Petrol', transmission: 'Automatic', color: 'Black' },
      image: '/images/volkswagen-jetta.jpg',
    },
    {
      make: 'Chevrolet',
      model: 'Cruze 2019',
      year: 2019,
      price: 1150000,
      specs: { condition: 'Excellent', mileage: 41000, fuelType: 'Petrol', transmission: 'Automatic', color: 'Blue' },
      image: '/images/chevrolet-cruze.jpg',
    },
  ];

  for (const car of carsWithImages) {
    const created = await prisma.car.create({
      data: {
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        specifications: JSON.stringify({
          description: `${car.make} ${car.model} with great features`,
          ...car.specs,
        }),
        status: 'AVAILABLE',
        images: {
          create: [
            { url: car.image, order: 0 },
          ],
        },
      },
      include: { images: true },
    });
    console.log(`✅ Created: ${created.make} ${created.model}`);
  }

  console.log(`\n🌱 Seed completed! Added ${carsWithImages.length} cars with images.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
