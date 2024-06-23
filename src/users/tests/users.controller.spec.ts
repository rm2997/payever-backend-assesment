import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

import { userStub } from './stubs/user.stub';
import { usersServiceMock } from '../__mocks__/users.service';

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(usersController).toBeDefined();
  });

  //Create user test
  describe('createUser', () => {
    it('Should create a user', async () => {
      const avatar = {
        originalname: 'avatar.png',
        buffer: Buffer.from('avatar data'),
      } as Express.Multer.File;

      usersServiceMock.create.mockResolvedValue(userStub());
      const result = await usersController.create(userStub(), avatar);
      expect(result).toEqual(userStub());
    });
  });

  //Find all users test
  describe('findAll', () => {
    it('Should return all users', async () => {
      usersServiceMock.findAll.mockResolvedValue([userStub()]);
      const result = await usersController.findAll();
      expect(result).toEqual([userStub()]);
    });
  });

  //Find a user by id
  describe('findOne', () => {
    it('Should return a user', async () => {
      usersServiceMock.findOne.mockResolvedValue(userStub());
      expect(await usersController.findOne(userStub().userId)).toEqual(
        userStub(),
      );
    });
  });

  //Update user

  //Remove user
  describe('removeUser', () => {
    it('should remove a user', async () => {
      const result = `User ${userStub().userId} removed.`;

      usersServiceMock.remove.mockResolvedValue(result);
      expect(await usersController.remove(userStub().userId)).toBe(result);
      expect(usersServiceMock.remove).toHaveBeenCalledWith(userStub().userId);
    });
  });
});
