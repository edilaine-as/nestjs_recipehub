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

    const recipe1 = Recipe.create({
      title: 'Pancake',
      category: RecipeCategory.DESSERT,
      userId,
    })

    const recipe2 = Recipe.create({
      title: 'Omelette',
      category:
        RecipeCategory.MAIN_DISH,
      userId,
    })

    const otherUserRecipe =
      Recipe.create({
        title: 'Pizza',
        category:
          RecipeCategory.MAIN_DISH,
        userId: 'other-user',
      })

    await recipeRepository.save(recipe1)
    await recipeRepository.save(recipe2)
    await recipeRepository.save(
      otherUserRecipe,
    )

    const recipeReturnUseCase =
      await useCase.execute(userId)

    expect(
      recipeReturnUseCase,
    ).toHaveLength(2)
    expect(
      recipeReturnUseCase!.map((r) =>
        r.getTitle(),
      ),
    ).toEqual(
      expect.arrayContaining([
        'Pancake',
        'Omelette',
      ]),
    )
  })
})
