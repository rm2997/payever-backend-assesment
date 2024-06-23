import { User } from 'src/users/entities/user.schema';

export const userStub = (): User => {
  const avatar = {
    originalname: 'avatar.png',
    buffer: Buffer.from('avatar data'),
  } as Express.Multer.File;
  const fileB64 = avatar.buffer.toString('base64');
  return {
    userId: '1',
    fullName: 'reza',
    email: 'rm2997@gmail.com',
    password: '123456',
    avatar: fileB64,
  };
};
