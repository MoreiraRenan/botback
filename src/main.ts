import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
const { version, description, name } = require("../package.json");
const cors = require('cors');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
  .setTitle(name)
  .setDescription(description)
  .setVersion(version)
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'JWT',
  )
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  app.use(cors());
  app.use(morgan('dev'))

  await app.listen(3330);
}
bootstrap();
