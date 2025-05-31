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
import { useAuth } from './context/AuthContext';

function App() {
  // Get the user from the AuthContext
  const { loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Items - No auth required */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route element={<Layout />}>
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Protected Items - Required auth - Include Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:recipeId" element={<RecipeIndividualPage />} />
            <Route path="/pantry" element={<PantryPage />} /> 
          </Route>
        </Route>
      </Routes>

      {/* Footer always visible */}
      <Footer/>
    </BrowserRouter>
  );
}

export default App;