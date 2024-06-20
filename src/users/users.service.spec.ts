import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let userService: UsersService;
  let userModel: Model<User>;
  let mailerService: MailerService;
  let clientProxy: ClientProxy;

  const mockUserModel = {
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
  };

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
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

    userService = moduleRef.get<UsersService>(UsersService);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
    mailerService = moduleRef.get<MailerService>(MailerService);
    clientProxy = moduleRef.get<ClientProxy>('RABBITMQ_SERVICE');
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user, send a confirmation email, and notify via RabbitMQ', async () => {
      const userDto: CreateUserDto = {
        fullName: 'Test User',
        email: 'rm2997@gmail.com',
        password: '123456',
      };
      const avatar = {
        originalname: 'avatar.png',
        buffer: Buffer.from('avatar data'),
      } as any;
      const savedUser = { id: '123', ...userDto };

      mockUserModel.save.mockResolvedValue(savedUser);
      jest
        .spyOn(userModel.prototype, 'save')
        .mockImplementationOnce(() => savedUser);
      jest.spyOn(userService, 'sendAnEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'sendToQueue').mockResolvedValue(null);

      const createdUser = await userService.create(userDto, avatar);

      expect(createdUser).toBe(savedUser);
      expect(userModel.prototype.save).toHaveBeenCalled();
      expect(userService.sendAnEmail).toHaveBeenCalledWith(
        'no-reply@ourplatform.com',
        userDto.email,
        'Welcome to Our Platform',
        'Thank you for signing up!',
      );
      expect(userService.sendToQueue).toHaveBeenCalledWith(
        savedUser,
        'user.created',
      );
    });
  });

  describe('sendAnEmail', () => {
    it('should send an email', async () => {
      const fromEmail = 'no-reply@ourplatform.com';
      const toEmail = 'test@example.com';
      const subject = 'Welcome to Our Platform';
      const message = 'Thank you for signing up!';

      await userService.sendAnEmail(fromEmail, toEmail, subject, message);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        from: fromEmail,
        to: toEmail,
        subject,
        text: message,
      });
    });
  });

  describe('sendToQueue', () => {
    it('should send a message to the queue', async () => {
      const message = 'New user added';
      const queueName = 'users';

      await userService.sendToQueue(message, queueName);

      expect(clientProxy.emit).toHaveBeenCalledWith(queueName, message);
    });
  });
});