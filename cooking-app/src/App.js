import React, { useState, useEffect, createContext, useRef } from 'react';
import RecipeList from './components/RecipeList';

import uuidv4 from 'uuid/dist/v4';
import RecipeEdit from './components/RecipeEdit';

const sampleRecipes = [
  {
    id: 1,
    name: 'Plain Chicken',
    servings: 3,
    cookTime: '1:45',
    instructions:
      '1. Put salt on chicken\n2. Put chicken in oven\n3. Eat chicken',
    ingredients: [
      {
        id: 1,
        name: 'Chicken',
        amount: '2 Pounds',
      },
      {
        id: 2,
        name: 'Salt',
        amount: '1 Tbs',
      },
    ],
  },
  {
    id: 2,
    name: 'Plain Pork',
    servings: 5,
    cookTime: '0:45',
    instructions: '1. Put paprika on pork\n2. Put pork in oven\n3. Eat pork',
    ingredients: [
      {
        id: 1,
        name: 'Pork',
        amount: '3 Pounds',
      },
      {
        id: 2,
        name: 'Paprika',
        amount: '2 Tbs',
      },
    ],
  },
];

export const RecipeContext = createContext();
const LOCAL_STORAGE_KEY = 'cookingWithReact.recipes';

function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState();
  const [recipes, setRecipes] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || sampleRecipes
  );

  const isFirstRender = useRef(true);

  const selectedRecipe = recipes.find(
    (recipe) => recipe.id === selectedRecipeId
  );

  // this will run before the component has be re-rendered by previous useEffect set state
  // so in the first render recipes will have the initial value that we have give and local storage will get set to that
  useEffect(() => {
    // if it is first render then we don't want to run it and we don't want to over-ride it
    if (!isFirstRender.current) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
    } else {
      isFirstRender.current = false;
    }
  }, [recipes]);

  const recipeContextValue = {
    handleRecipeAdd,
    handleRecipeDelete,
    handleRecipeSelect,
    resetData,
    handleRecipeChange,
  };

  function handleRecipeSelect(id) {
    setSelectedRecipeId(id);
  }
  function resetData() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setRecipes(sampleRecipes);
  }

  function handleRecipeAdd() {
    const newRecipe = {
      id: uuidv4(),
      name: 'New',
      servings: 1,
      cookTime: '1:00',
      instructions: 'Instr.',
      ingredients: [{ id: uuidv4(), name: 'Name', amount: '1 Tbs' }],
    };

    setRecipes([...recipes, newRecipe]);
    setSelectedRecipeId(newRecipe.id);
  }

  function handleRecipeChange(id, recipe) {
    const newRecipes = [...recipes];
    const index = newRecipes.findIndex((r) => r.id === id);
    newRecipes[index] = recipe;
    setRecipes(newRecipes);
  }

  function handleRecipeDelete(id) {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  }

  return (
    <RecipeContext.Provider value={recipeContextValue}>
      <RecipeList recipes={recipes} />
      {selectedRecipe && <RecipeEdit recipe={selectedRecipe} />}
    </RecipeContext.Provider>
  );
}

export default App;
