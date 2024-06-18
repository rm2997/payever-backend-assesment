import { MongooseModuleOptions } from '@nestjs/mongoose';

export default (): MongooseModuleOptions => ({
  uri: process.env.MONGODB_ADDRESS,
});
