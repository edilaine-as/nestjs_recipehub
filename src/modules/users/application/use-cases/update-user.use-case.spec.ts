import { User } from '../../domain/entities/user.entity'
import { UserRepositoryInMemory } from '../../tests/repositories/user.repository.in-memory'
import { UpdateUserUseCase } from './update-user.use-case'

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase
  let repository: UserRepositoryInMemory

  beforeEach(() => {
    repository =
      new UserRepositoryInMemory()
    useCase = new UpdateUserUseCase(
      repository,
    )
  })
  it('should update and persist user', async () => {
    const user = await User.create({
      name: 'ana',
      email: 'ana@gmail.com',
      password: '123456',
    })

    await repository.save(user)

    await useCase.execute(
      user.getId(),
      {
        name: 'dila',
        email: 'dila@gmail.com',
      },
    )

    const updatedUser =
      await repository.findById(
        user.getId(),
      )

    expect(updatedUser).toBeDefined()
    expect(updatedUser?.getName()).toBe(
      'dila',
    )
    expect(
      updatedUser?.getEmail(),
    ).toBe('dila@gmail.com')
  })
})
