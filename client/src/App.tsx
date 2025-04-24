import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import RecipesPage from './pages/RecipesPage';
import RecipeIndividualPage from './pages/RecipeIndividualPage';
import AboutPage from './pages/AboutPage';
import PantryPage from './pages/PantryPage'; 
import Footer from './pages/Footer'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipe/:recipeId" element={<RecipeIndividualPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pantry" element={<PantryPage />} /> 
        <Route path="/recipes" element={<RecipesPage />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;