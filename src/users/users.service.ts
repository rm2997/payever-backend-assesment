import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import * as fs from 'fs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly mailService: MailerService,
  ) {}

  async create(createUserDto: any, fileBuffer: Buffer): Promise<User | string> {
    let fileB64 = '';
    if (fileBuffer) {
      fileB64 = fileBuffer.toString('base64');
    } else {
      return 'Please set user avatar';
    }

    const newUser = new this.userModel({
      ...createUserDto,
      avatar: fileB64,
    });

    this.saveImage(newUser.id, fileB64);
    const savedUser = await newUser.save();

    await this.sendToQueue('users', 'New user added');
    await this.sendAnEmail(
      'rm2997@gmail.com',
      'rm2997@gmail.com',
      'New user added',
      `New user id:${newUser.id}`,
    );

    return savedUser;
  }

  async sendToQueue(message: string, queueName: string) {
    this.client.emit(queueName, message);
  }

  async sendAnEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    message: string,
  ) {
    await this.mailService.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      text: message,
    });
  }
  saveImage(userId: string, imageB64: string) {
    const base64Image = imageB64.split(';base64,').pop();
    const imagePath = `data/avatars/${userId}.jpg`;
    fs.writeFileSync(imagePath, base64Image, { encoding: 'base64' });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (user) return user;
    else return 'No user found';
  }

  async showAvatar(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user.avatar;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) return 'No user found';
    await this.userModel.findByIdAndDelete(id);
    const userAvatarFile = `data/avatars/${id}.jpg`;
    fs.unlink(userAvatarFile, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });
    return `User ${id} removed.`;
  }
}
