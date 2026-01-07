import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { DeleteRecipeUseCase } from './delete-recipe.use-case'

describe('DeleteRecipeUseCase', () => {
  let useCase: DeleteRecipeUseCase
  let recipeRepository: RecipeRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    useCase = new DeleteRecipeUseCase(
      recipeRepository,
    )
  })

  it('should delete recipe', async () => {
    const recipe = Recipe.create({
      title: 'Pancake',
      category: RecipeCategory.DESSERT,
      userId,
    })

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe.getId(),
      userId,
    )

    const savedRecipe =
      await recipeRepository.findById(
        recipe.getId(),
        userId,
      )

    expect(savedRecipe).toBeNull()
  })

  it('should throw an error if the recipe not exists', async () => {
    await expect(
      useCase.execute('1', userId),
    ).rejects.toThrow()
  })
})
