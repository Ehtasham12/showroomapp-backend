import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  carId!: string;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits' })
  customerPhone!: string;

  @IsOptional()
  @IsString()
  message?: string;
}
