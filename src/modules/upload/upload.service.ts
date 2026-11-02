import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadService {
  private uploadsDir = join(process.cwd(), 'apps/backend/uploads');

  constructor() {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    if (!file) throw new BadRequestException('No file uploaded');

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    const ext = file.originalname.split('.').pop();
    const filename = `${randomBytes(16).toString('hex')}.${ext}`;
    const filepath = join(this.uploadsDir, filename);

    require('fs').writeFileSync(filepath, file.buffer);

    return {
      filename,
      url: `/uploads/${filename}`,
    };
  }
}
