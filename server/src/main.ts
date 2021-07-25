import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validateAllVariables } from './config/configuration';

async function bootstrap() {
  validateAllVariables();

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('Simple Stock - API Documentations')
    .setDescription('List of all API requests.')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.get('server.port'));

  Logger.log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
