import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import AddShirt from "./pages/AddShirt";
import EditShirt from "./pages/EditShirt";
import ShirtDetail from "./pages/ShirtDetail";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/collection" /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/collection" /> : <Register />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shirts/add"
          element={
            <ProtectedRoute>
              <AddShirt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shirts/edit/:id"
          element={
            <ProtectedRoute>
              <EditShirt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shirts/:id"
          element={
            <ProtectedRoute>
              <ShirtDetail />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/collection" : "/login"} />}
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
