import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { IngredientRepositoryInMemory } from '../../tests/repositories/ingredient.repository.in-memory'
import { GetIngredientByIdUseCase } from './get-ingredient-by-id.use-case'

describe('GetIngredientByIdUseCase', () => {
  let useCase: GetIngredientByIdUseCase
  let ingredientRepository: IngredientRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    ingredientRepository =
      new IngredientRepositoryInMemory()
    useCase =
      new GetIngredientByIdUseCase(
        ingredientRepository,
      )
  })

  it('should get ingredient by id', async () => {
    const ingredient =
      Ingredient.create({
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId,
      })

    await ingredientRepository.save(
      ingredient,
    )

    const ingredientReturnUseCase =
      await useCase.execute(
        ingredient.getId(),
        userId,
      )

    expect(
      ingredientReturnUseCase.getName(),
    ).toBe('Milk')
    expect(
      ingredientReturnUseCase.getType(),
    ).toBe(IngredientType.DAIRY)
    expect(
      ingredientReturnUseCase.getUserId(),
    ).toBe(userId)
  })

  it('should throw an error if the ingredient not exists', async () => {
    await expect(
      useCase.execute('1', userId),
    ).rejects.toThrow(
      'Ingredient not found',
    )
  })
})
