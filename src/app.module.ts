import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { RecipesModule } from './modules/recipes/recipes.module'
import { IngredientsModule } from './modules/ingredients/ingredients.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), // disponibiliza process.env em todo o app
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(
        process.env.POSTGRES_PORT!,
      ),
      username:
        process.env.POSTGRES_USER,
      password:
        process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        `${
          __dirname
        }/**/*.entity{.ts,.js}`,
      ],
      autoLoadEntities: true,
      synchronize: true, // remover em produção
    }),
    UsersModule,
    AuthModule,
    RecipesModule,
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
