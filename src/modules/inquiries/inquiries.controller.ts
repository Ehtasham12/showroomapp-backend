import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  async create(@Body() dto: CreateInquiryDto) {
    return this.inquiriesService.create(dto);
  }

  @Get()
  async findByPhone(@Query('phone') phone?: string) {
    if (phone) {
      return this.inquiriesService.findByPhone(phone);
    }
    return [];
  }

  @Get('car/:carId')
  async findByCarId(@Param('carId') carId: string) {
    return this.inquiriesService.findByCarId(carId);
  }
}
