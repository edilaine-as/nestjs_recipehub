import { Module } from '@nestjs/common'
import { UsersController } from './interface/users.controller'
import { CreateUserUseCase } from './application/use-cases/create-user.use-case'
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case'
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl'
import { UserOrmEntity } from './infrastructure/entities/user.orm-entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
  ],
  exports: ['UserRepository'],
})
export class UsersModule {}
