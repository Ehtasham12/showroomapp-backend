import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseInterceptors, UploadedFiles, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto, CarFiltersDto } from './dto';
import { ParseCarFormPipe } from './parse-car-form.pipe';
import * as fs from 'fs';
import * as path from 'path';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async findAll(@Query() filters: CarFiltersDto) {
    if (filters.phone) {
      return this.carsService.findByPhone(filters.phone);
    }
    return this.carsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
    }), ParseCarFormPipe) dto: CreateCarDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log('\n🚀 POST /cars CONTROLLER START');
    console.log('📝 DTO received:', {
      make: dto.make,
      model: dto.model,
      year: dto.year,
      yearType: typeof dto.year,
      price: dto.price,
      priceType: typeof dto.price,
      mileage: dto.mileage,
      mileageType: typeof dto.mileage,
      filesCount: files?.length || 0,
    });

    // Create car first
    const car = await this.carsService.create(dto);

    // Handle file uploads if present
    if (files && files.length > 0) {
      const uploadDir = path.join(process.cwd(), 'uploads');

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save files and create image records
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = Date.now();
        const filename = `${timestamp}-${i}-${file.originalname}`;
        const filepath = path.join(uploadDir, filename);

        // Save file to filesystem
        fs.writeFileSync(filepath, file.buffer);

        // Create image record in database
        await this.carsService.addImage(car.id, `/uploads/${filename}`, i);
      }
    }

    // Return car with images
    const result = await this.carsService.findOne(car.id);
    console.log('✅ POST /cars SUCCESS - returning car:', result.id);
    console.log('🚀 POST /cars CONTROLLER END\n');
    return result;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCarDto,
  ) {
    return this.carsService.update(id, dto.customerPhone, dto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('phone') phone: string,
  ) {
    return this.carsService.delete(id, phone);
  }
}
