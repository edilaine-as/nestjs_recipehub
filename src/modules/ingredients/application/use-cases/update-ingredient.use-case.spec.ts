import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { IngredientRepositoryInMemory } from '../../tests/repositories/ingredient.repository.in-memory'
import { UpdateIngredientUseCase } from './update-ingredient.use-case'

describe('UpdateIngredientUseCase', () => {
  let useCase: UpdateIngredientUseCase
  let ingredientRepository: IngredientRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    ingredientRepository =
      new IngredientRepositoryInMemory()
    useCase =
      new UpdateIngredientUseCase(
        ingredientRepository,
      )
  })

  it('should update ingredient', async () => {
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
      {
        name: 'Leite',
        type: IngredientType.PROTEIN,
      },
      userId,
    )

    expect(ingredient.getName()).toBe(
      'Leite',
    )
    expect(ingredient.getType()).toBe(
      IngredientType.PROTEIN,
    )
  })

  it('should throw an error if the ingredient not exists', async () => {
    await expect(
      useCase.execute('1', {}, userId),
    ).rejects.toThrow(
      'Ingredient not found',
    )
  })
})
