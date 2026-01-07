import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { IngredientRepositoryInMemory } from '../../tests/repositories/ingredient.repository.in-memory'
import { CreateIngredientUseCase } from './create-ingredient.use-case'

describe('CreateIngredientUseCase', () => {
  let useCase: CreateIngredientUseCase
  let ingredientRepository: IngredientRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    ingredientRepository =
      new IngredientRepositoryInMemory()
    useCase =
      new CreateIngredientUseCase(
        ingredientRepository,
      )
  })

  it('should create a new ingredient', async () => {
    const ingredient =
      await useCase.execute({
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId,
      })

    const storedIngredient =
      await ingredientRepository.findById(
        ingredient.getId(),
        userId,
      )

    expect(
      storedIngredient,
    ).not.toBeNull()
    expect(
      storedIngredient?.getName(),
    ).toBe('Milk')
    expect(
      storedIngredient?.getType(),
    ).toBe(IngredientType.DAIRY)
  })

  it('should throw an error if the ingredient already exists', async () => {
    const ingredient =
      Ingredient.create({
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId,
      })

    await ingredientRepository.save(
      ingredient,
    )

    await expect(
      useCase.execute({
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId,
      }),
    ).rejects.toThrow(
      'Ingredient already exists',
    )
  })
})
