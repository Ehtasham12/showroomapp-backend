require('module-alias/register');

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log all requests (middleware)
  app.use((req: any, res: any, next: any) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.path === '/cars') {
      console.log('🔍 Raw request body keys:', Object.keys(req.body || {}));
      console.log('🔍 Raw request body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Allow extra fields from frontend forms
      forbidNonWhitelisted: false, // Don't reject unknown properties
      transform: true,
    }),
  );

  // Static file serving for uploads and images (Express adapter)
  const express = require('express');
  const uploadsDir = join(process.cwd(), 'uploads');
  const imagesDir = join(process.cwd(), 'images');
  (app as any).use('/uploads', express.static(uploadsDir));
  (app as any).use('/images', express.static(imagesDir));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Server running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap error:', err);
  process.exit(1);
});
