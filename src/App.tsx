import { useState, useEffect } from 'react'

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strYoutube: string;
  isSaved?: boolean;
}

function App() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [search, setSearch] = useState('')
  const [savedMeals, setSavedMeals] = useState<Meal[]>([])
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'random' | 'saved'>('home')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPopularMeals = async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      const data = await response.json()
      setMeals(data.meals || [])
    }
    fetchPopularMeals()
  }, [])

  const toggleSave = (meal: Meal) => {
    if (savedMeals.some(saved => saved.idMeal === meal.idMeal)) {
      setSavedMeals(savedMeals.filter(saved => saved.idMeal !== meal.idMeal))
    } else {
      setSavedMeals([...savedMeals, { ...meal, isSaved: true }])
    }
  }

  const searchMeals = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
      const data = await response.json()
      setMeals(data.meals || [])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRandomMeal = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      const data = await response.json()
      setMeals(data.meals || [])
      setActiveTab('random')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPopularMeals = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      const data = await response.json()
      setMeals(data.meals || [])
      setActiveTab('home')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center cursor-pointer" onClick={fetchPopularMeals}>
              <svg 
                className="h-10 w-10 mr-3 text-blue-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C8.43 2 5.23 3.54 3.01 6L12 22L20.99 6C18.77 3.54 15.57 2 12 2ZM12 17.92L5.51 6.36C7.32 4.85 9.62 4 12 4C14.38 4 16.68 4.85 18.49 6.36L12 17.92Z"/>
                <path d="M12 4C9.62 4 7.32 4.85 5.51 6.36L12 17.92L18.49 6.36C16.68 4.85 14.38 4 12 4Z" fill="white"/>
              </svg>
              <span className="text-2xl font-bold text-gray-800">Recipe Finder</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={fetchPopularMeals}
                className={`px-4 py-2 rounded ${
                  activeTab === 'home' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button 
                onClick={fetchRandomMeal}
                className={`px-4 py-2 rounded ${
                  activeTab === 'random' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Random Recipe
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'saved' ? 'bg-blue-600' : 'bg-blue-500'
                } text-white hover:bg-blue-600`}
              >
                {savedMeals.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mr-2">
                    {savedMeals.length}
                  </span>
                )}
                Saved Recipes
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home' && (
            <form onSubmit={searchMeals} className="mb-8 flex justify-center gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a meal..."
                className="px-4 py-2 border rounded-lg w-full max-w-md"
                disabled={isLoading}
              />
              <button 
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Search'}
              </button>
            </form>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'saved' ? (
            savedMeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMeals.map((meal) => (
                  <div 
                    key={meal.idMeal}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <img 
                      src={meal.strMealThumb} 
                      alt={meal.strMeal}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{meal.strMeal}</h2>
                      <p className="text-gray-600 mb-2">Category: {meal.strCategory}</p>
                      <p className="text-gray-600 mb-4">Origin: {meal.strArea}</p>
                      <a
                        href={meal.strYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Watch Recipe Video
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 mt-8">
                No saved recipes yet. Start saving some recipes!
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal) => (
                <div 
                  key={meal.idMeal}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img 
                    src={meal.strMealThumb} 
                    alt={meal.strMeal}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{meal.strMeal}</h2>
                    <p className="text-gray-600 mb-2">Category: {meal.strCategory}</p>
                    <p className="text-gray-600 mb-4">Origin: {meal.strArea}</p>
                    <div className="flex justify-between items-center">
                      <a
                        href={meal.strYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Watch Recipe Video
                      </a>
                      <button
                        onClick={() => toggleSave(meal)}
                        className={`px-4 py-2 rounded ${
                          savedMeals.some(saved => saved.idMeal === meal.idMeal)
                            ? 'bg-red-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {savedMeals.some(saved => saved.idMeal === meal.idMeal)
                          ? 'Unsave'
                          : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App