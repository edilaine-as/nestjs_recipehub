import { NestFactory } from '@nestjs/core'
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app =
    await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('RecipeHub API')
    .setDescription(
      'API for managing recipes, users and ingredients',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    )
  SwaggerModule.setup(
    'api',
    app,
    document,
  )

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  await app.listen(
    process.env.PORT ?? 3000,
  )
}
bootstrap()
