import { userStub } from '../tests/stubs/user.stub';

export const usersServiceMock = {
  findOne: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue([userStub()]),
  create: jest.fn().mockResolvedValue(userStub()),
  update: jest.fn().mockResolvedValue(userStub()),
  showAvatar: jest.fn().mockResolvedValue(userStub()),
  remove: jest.fn().mockResolvedValue(userStub()),
};
