import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './helpers/config';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("config:==",config);
  await app.listen(config.serverPort);
}
bootstrap();
