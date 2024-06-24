import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { bcrypt, imageUtils, mailer, rabbitMQ } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly mailService: MailerService,
  ) {}

  async create(createUserDto: any, avatar: Express.Multer.File): Promise<User> {
    const password = bcrypt.encryptPassword(createUserDto.password);
    let fileB64 = '';
    if (avatar.buffer) {
      fileB64 = avatar.buffer.toString('base64');
    } else {
      throw new BadRequestException('Please set user avatar');
    }

    const newUser = new this.userModel({
      ...createUserDto,
      password,
      avatar: fileB64,
    });

    imageUtils.saveImage(newUser.id, fileB64);
    const savedUser = await newUser.save();
    savedUser.avatar = `data/avatars/${newUser.id}}.jpg`;
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

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user id');
    }
    const user: User = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found with given id');
    }
    user.avatar = `data/avatars/${id}.jpg`;

    return user;
  }

  async showAvatar(id: string) {
    const user = await this.userModel.findById(id);
    //return user.avatar;
    return {
      imageAddress: `data/avatars/${id}.jpg`,
      isExist: Boolean(user),
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('No user found');
    await this.userModel.findByIdAndDelete(id);
    imageUtils.deleteImage(id);
    return user;
  }
}
