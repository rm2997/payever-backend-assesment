import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;
  const mockUser = {
    _id: 'some-user-id',
    fullName: 'reza',
    email: 'rm2997@gmail.com',
    password: '123456',
    avatar: 'sdsdsd',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            deleteOne: jest.fn(),
            // ...other methods
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  // ...tests (use `model` to mock database operations)
});
