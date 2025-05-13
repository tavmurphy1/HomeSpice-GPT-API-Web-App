import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import RecipesPage from './pages/RecipesPage';
import RecipeIndividualPage from './pages/RecipeIndividualPage';
import AboutPage from './pages/AboutPage';
import PantryPage from './pages/PantryPage'; 
import Footer from './pages/Footer';
import Layout from './components/Layout';
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />

        {/* Protected Items - Required auth - Include Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipe/:recipeId" element={<RecipeIndividualPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pantry" element={<PantryPage />} /> 
            <Route path="/recipes" element={<RecipesPage />} />
        </Route>
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;