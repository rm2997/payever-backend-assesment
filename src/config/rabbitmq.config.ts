import { registerAs } from '@nestjs/config';
import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

export default registerAs(
  'rabbitmq.config',
  (): ClientsModuleOptions => [
    {
      name: process.env.RABBITMQ_SERVICE_NAME,
      transport: Transport.RMQ,
      options: {
        urls: [`${process.env.RABBITMQ_ADDRESS}:${process.env.RABBITMQ_PORT}`],
        queue: 'users_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  ],
);
