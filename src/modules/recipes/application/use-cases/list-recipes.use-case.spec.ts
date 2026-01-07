import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { ListRecipesUseCase } from './list-recipes.use-case'

describe('ListRecipeUseCase', () => {
  let useCase: ListRecipesUseCase
  let recipeRepository: RecipeRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    useCase = new ListRecipesUseCase(
      recipeRepository,
    )
  })

  it('should return all recipes from user', async () => {
    const resultEmpty =
      await useCase.execute(userId)

    expect(resultEmpty).toEqual([])

    const recipe = Recipe.create({
      title: 'Pancake',
      category: RecipeCategory.DESSERT,
      userId,
    })

    await recipeRepository.save(recipe)

    const recipeReturnUseCase =
      await useCase.execute(userId)

    expect(
      recipeReturnUseCase![0].getTitle(),
    ).toBe('Pancake')
  })
})
