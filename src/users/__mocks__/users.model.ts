import { userStub } from '../tests/stubs/user.stub';

export const usersModelMock = {
  save: jest.fn().mockReturnValue(userStub()),
  find: jest.fn().mockReturnValue([userStub()]),
  findById: jest.fn().mockImplementation(() => ({
    exec: jest.fn(),
  })),
  findByIdAndDelete: jest.fn().mockResolvedValue(userStub()),
};
