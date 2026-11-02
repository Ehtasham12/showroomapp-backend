import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShowroomsService } from './showrooms.service';

@Controller('showrooms')
export class ShowroomsController {
  constructor(private readonly showroomsService: ShowroomsService) {}

  @Get()
  findAll() {
    return this.showroomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showroomsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createShowroomDto: any) {
    return this.showroomsService.create(createShowroomDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateShowroomDto: any) {
    return this.showroomsService.update(id, updateShowroomDto);
  }
}
