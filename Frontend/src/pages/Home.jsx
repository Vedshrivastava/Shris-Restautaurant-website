import React, { useState } from 'react'
import '../styles/Home.css'
import Header from '../components/Header'
import ExploreMenu from '../components/ExploreMenu'
import FoodDisplay from '../components/FoodDisplay'

const Home = () => {

  const [category, setCategory] = useState("All")

  return (
    <div>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory} />
      {/* when the user selects a category in ExploreMenu, it updates the category in the parent component, and FoodDisplay reflects these changes.*/}
      <FoodDisplay category={category} />
    </div>
  )
}

export default Home