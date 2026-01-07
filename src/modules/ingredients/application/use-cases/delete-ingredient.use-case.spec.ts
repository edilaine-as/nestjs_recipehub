import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { IngredientRepositoryInMemory } from '../../tests/repositories/ingredient.repository.in-memory'
import { DeleteIngredientUseCase } from './delete-ingredient.use-case'

describe('DeleteIngredientUseCase', () => {
  let useCase: DeleteIngredientUseCase
  let ingredientRepository: IngredientRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    ingredientRepository =
      new IngredientRepositoryInMemory()
    useCase =
      new DeleteIngredientUseCase(
        ingredientRepository,
      )
  })

  it('should delete ingredient', async () => {
    const ingredient =
      Ingredient.create({
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId,
      })

    await ingredientRepository.save(
      ingredient,
    )

    await useCase.execute(
      ingredient.getId(),
      userId,
    )

    const savedIngredient =
      await ingredientRepository.findById(
        ingredient.getId(),
        userId,
      )

    expect(savedIngredient).toBeNull()
  })

  it('should throw an error if the ingredient not exists', async () => {
    await expect(
      useCase.execute('1', userId),
    ).rejects.toThrow(
      'Ingredient not found',
    )
  })
})
