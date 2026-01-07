import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { IngredientRepositoryInMemory } from '../../tests/repositories/ingredient.repository.in-memory'
import { ListIngredientsUseCase } from './list-ingredients.use-case'

describe('ListIngredientsUseCase', () => {
  let useCase: ListIngredientsUseCase
  let ingredientRepository: IngredientRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    ingredientRepository =
      new IngredientRepositoryInMemory()
    useCase =
      new ListIngredientsUseCase(
        ingredientRepository,
      )
  })

  it('should list all ingredients from user', async () => {
    const ingredient1 =
      Ingredient.create({
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId,
      })

    const ingredient2 =
      Ingredient.create({
        name: 'Egg',
        type: IngredientType.PROTEIN,
        userId,
      })

    const otherUserIngredient =
      Ingredient.create({
        name: 'Sugar',
        type: IngredientType.SUGAR_SWEETENER,
        userId: 'other-user',
      })

    await ingredientRepository.save(
      ingredient1,
    )
    await ingredientRepository.save(
      ingredient2,
    )
    await ingredientRepository.save(
      otherUserIngredient,
    )

    const ingredientReturnUseCase =
      await useCase.execute(userId)

    expect(
      ingredientReturnUseCase,
    ).toHaveLength(2)
    expect(
      ingredientReturnUseCase!.map(
        (i) => i.getName(),
      ),
    ).toEqual(
      expect.arrayContaining([
        'Milk',
        'Egg',
      ]),
    )
  })
})
