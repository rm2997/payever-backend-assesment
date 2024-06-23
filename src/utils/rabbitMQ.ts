import { ClientProxy } from '@nestjs/microservices';

export async function sendToQueue(
  client: ClientProxy,
  message: string,
  queueName: string,
) {
  try {
    client.emit(queueName, message);
  } catch (error) {
    console.log(error);
  }
}
