import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { bcrypt, imageUtils, mailer, rabbitMQ } from '../utils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly mailService: MailerService,
  ) {}

  async create(
    createUserDto: any,
    avatar: Express.Multer.File,
  ): Promise<User | string> {
    const password = bcrypt.encryptPassword(createUserDto.password);
    let fileB64 = '';
    if (avatar.buffer) {
      fileB64 = avatar.buffer.toString('base64');
    } else {
      return 'Please set user avatar';
    }

    const newUser = new this.userModel({
      ...createUserDto,
      password,
      avatar: fileB64,
    });

    imageUtils.saveImage(newUser.id, fileB64);
    const savedUser = await newUser.save();

    await rabbitMQ.sendToQueue(this.client, 'users', 'New user added');
    await mailer.sendAnEmail(
      this.mailService,
      'rm2997@gmail.com',
      'rm2997@gmail.com',
      'New user added',
      `New user id:${newUser.id}`,
    );
    return savedUser;
  }

  async findAll(): Promise<any> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    const avatar = `data/avatars/${id}.jpg`;
    const result: CreateUserDto = {
      fullName: user.fullName,
      password: user.password,
      email: user.email,
      avatar,
    };

    return result;
  }

  async showAvatar(id: string) {
    const user = await this.userModel.findById(id).exec();
    //return user.avatar;
    return {
      imageAddress: `data/avatars/${id}.jpg`,
      isExist: Boolean(user),
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) return 'No user found';
    await this.userModel.findByIdAndDelete(id);
    imageUtils.deleteImage(id);
    return `User ${id} removed.`;
  }
}
