import { Module } from '@nestjs/common';
import { ShowroomsService } from './showrooms.service';
import { ShowroomsController } from './showrooms.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShowroomsController],
  providers: [ShowroomsService],
  exports: [ShowroomsService],
})
export class ShowroomsModule {}
