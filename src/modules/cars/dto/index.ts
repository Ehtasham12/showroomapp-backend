import { IsString, IsNotEmpty, IsInt, Min, Max, IsNumber, IsOptional, Matches, IsArray, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  make!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsNotEmpty()
  year!: number | string;

  @IsOptional()
  mileage?: number | string;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  price!: number | string;

  // Accept either Phase 1D format (sellerName/sellerPhone) or legacy format (customerName/customerPhone)
  @IsOptional()
  @IsString()
  sellerName?: string;

  @IsOptional()
  @IsString()
  sellerPhone?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  specifications?: string;
}

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits' })
  customerPhone!: string;
}

export class CarFiltersDto {
  @IsOptional()
  @IsString()
  make!: string;

  @IsOptional()
  @IsString()
  model!: string;

  @IsOptional()
  @IsNumber()
  minPrice!: number;

  @IsOptional()
  @IsNumber()
  maxPrice!: number;

  @IsOptional()
  @IsInt()
  year!: number;

  @IsOptional()
  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  phone!: string;
}
