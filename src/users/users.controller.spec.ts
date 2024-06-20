import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './entities/user.schema';
import { ClientProxy } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from './dto/create-user.dto';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;
  let mailerService: MailerService;
  let clientProxy: ClientProxy;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    sendToQueue: jest.fn(),
    sendAnEmail: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    // mailerService = moduleRef.get<MailerService>(MailerService);
    // clientProxy = moduleRef.get<ClientProxy>('RABBITMQ_SERVICE');
  });

  it('Should be defined', () => {
    expect(usersController).toBeDefined();
  });

  //Create user test
  describe('createUser', () => {
    it('Should create a user', async () => {
      const userDto: CreateUserDto = {
        fullName: 'reza',
        email: 'rm2997@gmail.com',
        password: '123456',
      };
      const avatar: Express.Multer.File = {
        originalname: 'avatar.png',
        buffer: Buffer.from('avatar data'),
      } as any;

      const result = { id: '123', ...userDto };

      mockUserService.create.mockResolvedValue(result);
      mockUserService.sendToQueue.mockResolvedValue(true);
      mockUserService.sendAnEmail.mockResolvedValue(true);

      expect(await usersController.create(userDto, avatar)).toBe(result);

      expect(mockUserService.create).toHaveBeenCalledWith(
        userDto,
        avatar.buffer,
      );

      // expect(mockUserService.sendToQueue).toHaveBeenCalledWith(
      //   'users',
      //   'New user added',
      // );

      // expect(mockUserService.sendAnEmail).toHaveBeenCalledWith(
      //   'rm2997@gmail.com',
      //   'rm2997@gmail.com',
      //   'New user added',
      //   `New user id:${result.id}`,
      // );

      // expect(mockMailerService.sendMail).toHaveBeenCalledWith({
      //   to: 'rm2997@gmail.com',
      //   from: 'rm2997@gmail.com',
      //   subject: 'New user added',
      //   message: `New user id:${result.id}`,
      // });
      // expect(mockClientProxy.emit).toHaveBeenCalledWith(
      //   'users',
      //   'New user added',
      // );
    });
  });

  //Find all users test
  describe('findAll', () => {
    it('Should return a string', async () => {
      const result = 'This action returns all users';
      mockUserService.findAll.mockResolvedValue(result);
      expect(await usersController.findAll()).toBe(result);
    });
  });

  //Find a user by id
  describe('findUserById', () => {
    it('Should return a user', async () => {
      const userId = '123';
      const result = {
        id: userId,
        name: 'reza',
        email: 'rm2997@gmail.com',
        password: '123456',
        avatar: '',
      };
      mockUserService.findOne.mockResolvedValue(result);
      expect(await usersController.findOne(userId)).toBe(result);
    });
  });

  //Update user

  //Remove user
  describe('removeUser', () => {
    it('should remove a user', async () => {
      const userId = '123';
      const result = `User ${userId} removed.`;

      mockUserService.remove.mockResolvedValue(result);
      expect(await usersController.remove(userId)).toBe(result);
      expect(mockUserService.remove).toHaveBeenCalledWith(userId);
    });
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('Should return a list of users', async () => {
    const result = 'This action returns all users';
    expect(await usersController.findAll()).toEqual(result);
  });
});
