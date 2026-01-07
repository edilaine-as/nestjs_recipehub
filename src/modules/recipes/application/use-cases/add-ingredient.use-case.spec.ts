import { IngredientRepositoryInMemory } from 'src/modules/ingredients/tests/repositories/ingredient.repository.in-memory'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { AddIngredientUseCase } from './add-ingredient.use-case'
import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { IngredientType } from 'src/modules/ingredients/shared/enums/ingredient-type.enum'
import { RecipeIngredientUnit } from '../../shared/enums/recipe-ingredient-unit.enum'

describe('AddIngredientUseCase', () => {
  let useCase: AddIngredientUseCase
  let recipeRepository: RecipeRepositoryInMemory
  let ingredientRepository: IngredientRepositoryInMemory

  const userId = 'user-1'
  const recipeInput = {
    title: 'Pancake',
    category: RecipeCategory.DESSERT,
    userId,
  }
  const ingredientInput = {
    name: 'Oil',
    type: IngredientType.FAT_OIL,
    quantity: 0.5,
    unit: RecipeIngredientUnit.CUP,
  }

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    ingredientRepository =
      new IngredientRepositoryInMemory()
    useCase = new AddIngredientUseCase(
      recipeRepository,
      ingredientRepository,
    )
  })

  it('it should add ingredient to recipe', async () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe.getId(),
      ingredientInput,
      userId,
    )

    const savedRecipe =
      await recipeRepository.findById(
        recipe.getId(),
        userId,
      )

    expect(savedRecipe).not.toBeNull()
    expect(
      savedRecipe?.getIngredients(),
    ).toHaveLength(1)
    expect(
      savedRecipe
        ?.getIngredients()[0]
        .getQuantity(),
    ).toBe(0.5)
  })

  it('should throw an error if the ingredient already exists in the recipe', async () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe.getId(),
      ingredientInput,
      userId,
    )

    await expect(
      useCase.execute(
        recipe.getId(),
        ingredientInput,
        userId,
      ),
    ).rejects.toThrow()
  })

  it('should throw an error if the recipe not exists', async () => {
    await expect(
      useCase.execute(
        '1',
        ingredientInput,
        userId,
      ),
    ).rejects.toThrow()
  })
})
