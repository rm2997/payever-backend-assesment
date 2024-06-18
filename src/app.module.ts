import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './config/rabbitmq.config';
import mongoDBConfig from './config/mongoDB.config';
import mailerConfig from './config/mailer.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, mongoDBConfig, mailerConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: mongoDBConfig,
    }),
    MailerModule.forRootAsync({
      useFactory: mailerConfig,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
