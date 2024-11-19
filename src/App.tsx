import { useState } from 'react'

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strYoutube: string;
}

function App() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [search, setSearch] = useState('')

  const searchMeals = async (e) => {
    e.preventDefault()
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
    const data = await response.json()
    setMeals(data.meals || [])
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Recipe Finder</h1>
        
        <form onSubmit={searchMeals} className="mb-8 flex justify-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a meal..."
            className="px-4 py-2 border rounded-lg w-full max-w-md"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </form>

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
      </div>
    </div>
  )
}

export default App