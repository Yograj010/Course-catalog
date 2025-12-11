import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './helpers/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.serverPort);
}
bootstrap();
