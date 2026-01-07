import { IngredientRepositoryInMemory } from 'src/modules/ingredients/tests/repositories/ingredient.repository.in-memory'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { UpdateIngredientUseCase } from './update-ingredient.use-case'
import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'
import { IngredientType } from 'src/modules/ingredients/shared/enums/ingredient-type.enum'
import { RecipeIngredientUnit } from '../../shared/enums/recipe-ingredient-unit.enum'

describe('UpdateIngredientUseCase', () => {
  let useCase: UpdateIngredientUseCase
  let recipeRepository: RecipeRepositoryInMemory
  let ingredientRepository: IngredientRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    ingredientRepository =
      new IngredientRepositoryInMemory()
    useCase =
      new UpdateIngredientUseCase(
        recipeRepository,
        ingredientRepository,
      )
  })

  it('should update and persist ingredient', async () => {
    const recipe = Recipe.create({
      title: 'Pancake',
      category: RecipeCategory.DESSERT,
      userId,
    })

    const ingredient =
      Ingredient.create({
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId,
      })

    await ingredientRepository.save(
      ingredient,
    )

    recipe.addIngredient(
      ingredient,
      200,
      RecipeIngredientUnit.CUP,
    )

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe
        .getIngredients()[0]
        .getId(),
      {
        ingredientId:
          ingredient.getId(),
        quantity: 150,
        unit: RecipeIngredientUnit.MILLILITER,
      },
      userId,
    )

    expect(
      recipe
        .getIngredients()[0]
        .getQuantity(),
    ).toBe(150)
    expect(
      recipe
        .getIngredients()[0]
        .getUnit(),
    ).toBe(
      RecipeIngredientUnit.MILLILITER,
    )
  })

  it('should throw an error if the recipe ingredient not exists', async () => {
    await expect(
      useCase.execute('1', {}, userId),
    ).rejects.toThrow()
  })

  it('should throw an error if the ingredient not exists', async () => {
    await expect(
      useCase.execute('1', {}, userId),
    ).rejects.toThrow()
  })
})
