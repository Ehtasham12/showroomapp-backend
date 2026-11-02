import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarDto, UpdateCarDto, CarFiltersDto } from './dto';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: Partial<CarFiltersDto>) {
    const where: any = {};
    filters = filters || {};

    if (filters.make) where.make = { contains: filters.make, mode: 'insensitive' };
    if (filters.model) where.model = { contains: filters.model, mode: 'insensitive' };
    if (filters.minPrice) where.price = { gte: filters.minPrice };
    if (filters.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };
    if (filters.year) where.year = filters.year;
    if (filters.status) where.status = filters.status;
    else where.status = 'AVAILABLE';

    return this.prisma.car.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.car.findMany({
      where: { customerPhone: phone },
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        inquiries: { select: { id: true, customerName: true, customerPhone: true, message: true, status: true, createdAt: true } },
      },
    });

    if (!car) throw new NotFoundException(`Car #${id} not found`);
    return car;
  }

  async create(dto: CreateCarDto) {
    console.log('📦 CarsService.create() called with DTO:', {
      make: dto.make,
      model: dto.model,
      year: dto.year,
      yearType: typeof dto.year,
      price: dto.price,
      priceType: typeof dto.price,
      mileage: dto.mileage,
      mileageType: typeof dto.mileage,
    });

    // Ensure numeric fields are numbers (handle FormData strings)
    const year = typeof dto.year === 'string' ? parseInt(dto.year, 10) : dto.year;
    const price = typeof dto.price === 'string' ? parseFloat(dto.price) : dto.price;
    const mileage = dto.mileage ? (typeof dto.mileage === 'string' ? parseInt(dto.mileage, 10) : dto.mileage) : 0;

    console.log('✅ After conversion:', {
      year,
      yearType: typeof year,
      price,
      priceType: typeof price,
      mileage,
      mileageType: typeof mileage,
    });

    // Build specifications from individual fields (Phase 1D format)
    // or use existing specifications if provided (legacy format)
    let specifications;
    if (dto.specifications) {
      specifications = dto.specifications;
    } else {
      specifications = JSON.stringify({
        mileage,
        transmission: dto.transmission || '',
        fuelType: dto.fuelType || '',
        condition: dto.condition || '',
        features: dto.features || [],
        description: dto.description || '',
      });
    }

    // Support both Phase 1D format (sellerName/sellerPhone) and legacy format (customerName/customerPhone)
    const customerName = dto.sellerName || dto.customerName || '';
    const customerPhone = dto.sellerPhone || dto.customerPhone || '';

    console.log('💾 Creating car in database with:', {
      make: dto.make,
      model: dto.model,
      year,
      price,
      customerName,
      customerPhone,
    });

    try {
      const result = await this.prisma.car.create({
        data: {
          make: dto.make,
          model: dto.model,
          year,
          price,
          specifications,
          customerName,
          customerPhone,
          status: 'AVAILABLE',
        },
        include: { images: true },
      });
      console.log('✅ Car created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ Error creating car:', error);
      throw error;
    }
  }

  async update(id: string, phone: string, dto: UpdateCarDto) {
    const car = await this.prisma.car.findUnique({ where: { id }, select: { customerPhone: true } });
    if (!car) throw new NotFoundException(`Car #${id} not found`);
    if (car.customerPhone !== phone) throw new BadRequestException('Phone does not match car owner');

    const { customerPhone, ...updateData } = dto;

    // Convert numeric fields if they're strings
    const data: any = { ...updateData };
    if (data.year && typeof data.year === 'string') {
      data.year = parseInt(data.year, 10);
    }
    if (data.price && typeof data.price === 'string') {
      data.price = parseFloat(data.price);
    }
    if (data.mileage && typeof data.mileage === 'string') {
      data.mileage = parseInt(data.mileage, 10);
    }

    return this.prisma.car.update({
      where: { id },
      data,
      include: { images: true },
    });
  }

  async delete(id: string, phone: string) {
    const car = await this.prisma.car.findUnique({ where: { id }, select: { customerPhone: true } });
    if (!car) throw new NotFoundException(`Car #${id} not found`);
    if (car.customerPhone !== phone) throw new BadRequestException('Phone does not match car owner');

    return this.prisma.car.delete({ where: { id } });
  }

  async addImage(carId: string, url: string, order: number) {
    return this.prisma.carImage.create({
      data: {
        carId,
        url,
        order,
      },
    });
  }
}
