import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // FIXME: Check the in-method pipe validation and delete this one
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );

  await app.listen(process.env.APPLICATION_PORT || 3000);
}
bootstrap();
