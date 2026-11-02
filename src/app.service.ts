import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🚗 Welcome to Showroom App API v0.1.0';
  }
}
