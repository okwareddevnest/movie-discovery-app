import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { 
        index: true, 
        element: <Home />
      },
      { 
        path: 'search', 
        element: <SearchPage />
      },
      { 
        path: 'movie/:id', 
        element: <MovieDetails />
      },
      { 
        path: 'favorites', 
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        )
      },
      { 
        path: 'login', 
        element: <Login />
      },
      { 
        path: 'signup', 
        element: <SignUp />
      },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      { 
        path: '*', 
        element: <NotFound />
      }
    ]
  }
]);

export default router; 