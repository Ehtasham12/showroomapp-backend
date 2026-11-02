import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShowroomsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.showroom.findMany({
      include: {
        cars: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.showroom.findUnique({
      where: { id },
      include: {
        cars: true,
        staff: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(createShowroomDto: any) {
    return this.prisma.showroom.create({
      data: createShowroomDto,
    });
  }

  async update(id: string, updateShowroomDto: any) {
    return this.prisma.showroom.update({
      where: { id },
      data: updateShowroomDto,
    });
  }
}
