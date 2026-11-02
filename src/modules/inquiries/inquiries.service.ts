import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInquiryDto } from './dto';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInquiryDto) {
    return this.prisma.inquiry.create({
      data: {
        carId: dto.carId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        message: dto.message || null,
        status: 'PENDING',
      },
      include: {
        car: { select: { id: true, make: true, model: true, year: true, price: true } },
      },
    });
  }

  async findByCarId(carId: string) {
    return this.prisma.inquiry.findMany({
      where: { carId },
      select: {
        id: true,
        customerName: true,
        customerPhone: true,
        message: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.inquiry.findMany({
      where: { customerPhone: phone },
      include: {
        car: { select: { id: true, make: true, model: true, year: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.inquiry.update({
      where: { id },
      data: { status },
    });
  }
}
