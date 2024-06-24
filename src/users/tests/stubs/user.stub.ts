import { User } from 'src/users/entities/user.schema';

export const userStub = (): User => {
  const avatar = {
    originalname: 'avatar.png',
    buffer: Buffer.from('avatar data'),
  } as Express.Multer.File;
  const fileB64 = avatar.buffer.toString('base64');
  const user: any = {
    id: '61c0ccf11d7bf83d153d7c06',
    fullName: 'reza',
    email: 'rm2997@gmail.com',
    password: '123456',
    avatar: fileB64,
  } as User;
  return user;
};
