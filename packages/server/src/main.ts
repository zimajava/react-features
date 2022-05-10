import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
// import { config } from 'aws-sdk';

import CustomLogger from './logger/customLogger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(CustomLogger));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  // config.update({
  //   accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
  //   secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
  //   region: configService.get('AWS_REGION'),
  // });

  // var whitelist = ['https://website.com', 'https://www.website.com'];
  // app.enableCors({
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       console.log("allowed cors for:", origin)
  //       callback(null, true)
  //     } else {
  //       console.log("blocked cors for:", origin)
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   },
  //   allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  //   methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
  //   credentials: true,
  // });
  app.enableCors({ origin: configService.get('FRONTEND_URL'), credentials: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API with NestJS')
    .setDescription('API developed throughout the API with NestJS course')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT') ?? 8080;

  await app.listen(port);
}
bootstrap();
