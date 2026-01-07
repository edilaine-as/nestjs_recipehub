import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { UpdateRecipeUseCase } from './update-recipe.use-case'

describe('UpdateRecipeUseCase', () => {
  let useCase: UpdateRecipeUseCase
  let recipeRepository: RecipeRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    useCase = new UpdateRecipeUseCase(
      recipeRepository,
    )
  })

  it('should update recipe', async () => {
    const recipe = Recipe.create({
      title: 'Pancake',
      category: RecipeCategory.DESSERT,
      userId,
    })

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe.getId(),
      {
        title: 'Panqueca',
        category: RecipeCategory.SNACK,
      },
      userId,
    )

    expect(recipe.getTitle()).toBe(
      'Panqueca',
    )
    expect(recipe.getCategory()).toBe(
      RecipeCategory.SNACK,
    )
  })

  it('should throw an error if the recipe not exists', async () => {
    await expect(
      useCase.execute('1', {}, userId),
    ).rejects.toThrow()
  })
})
