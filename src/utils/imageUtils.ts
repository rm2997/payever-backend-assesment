import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

export function saveImage(userId: string, imageB64: string) {
  const base64Image = imageB64.split(';base64,').pop();
  const imagePath = `data/avatars/${userId}.jpg`;
  fs.writeFileSync(imagePath, base64Image, { encoding: 'base64' });
}

export function deleteImage(userId: string) {
  const userAvatarFile = `data/avatars/${userId}.jpg`;
  fs.unlink(userAvatarFile, (err) => {
    if (err) {
      throw new NotFoundException(
        `Can't find user image to delete, userid:${userId},`,
      );
    }
  });
}
