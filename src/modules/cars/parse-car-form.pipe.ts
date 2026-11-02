import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseCarFormPipe implements PipeTransform {
  transform(value: any) {
    console.log('\n🔧 ParseCarFormPipe START');
    console.log('📥 Received value keys:', Object.keys(value || {}));
    console.log('📥 Received value:', JSON.stringify(value, null, 2));
    console.log('📥 year value:', value?.year, 'type:', typeof value?.year);
    console.log('📥 price value:', value?.price, 'type:', typeof value?.price);

    if (!value || typeof value !== 'object') {
      console.log('⚠️  Value is not an object, returning as-is');
      return value;
    }

    // Convert string fields to proper types
    if (value.year !== undefined && value.year !== '') {
      console.log(`📝 year: "${value.year}" (type: ${typeof value.year})`);
      if (typeof value.year === 'string') {
        const year = parseInt(value.year, 10);
        if (isNaN(year)) throw new BadRequestException('Year must be a valid number');
        value.year = year;
        console.log(`✅ Converted year to: ${year} (type: ${typeof year})`);
      }
    }

    if (value.mileage !== undefined && value.mileage !== '') {
      console.log(`📝 mileage: "${value.mileage}" (type: ${typeof value.mileage})`);
      if (typeof value.mileage === 'string') {
        const mileage = parseInt(value.mileage, 10);
        if (isNaN(mileage)) throw new BadRequestException('Mileage must be a valid number');
        value.mileage = mileage;
        console.log(`✅ Converted mileage to: ${mileage} (type: ${typeof mileage})`);
      }
    }

    if (value.price !== undefined && value.price !== '') {
      console.log(`📝 price: "${value.price}" (type: ${typeof value.price})`);
      if (typeof value.price === 'string') {
        const price = parseFloat(value.price);
        if (isNaN(price)) throw new BadRequestException('Price must be a valid number');
        value.price = price;
        console.log(`✅ Converted price to: ${price} (type: ${typeof price})`);
      }
    }

    console.log('📤 Pipe output:', { year: value.year, mileage: value.mileage, price: value.price });
    console.log('🔧 ParseCarFormPipe END\n');
    return value;
  }
}
