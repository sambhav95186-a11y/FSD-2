import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import ViewerDashboard from "./pages/ViewerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function Unauthorized() {

  return (

    <div className="unauthorized">

      <h1>🚫 Access Denied</h1>

      <p>
        You do not have permission to access
        this page.
      </p>

      <a href="/login">
        Go to Login
      </a>

    </div>
  );
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTE */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ADMIN ROUTE */}

        <Route
          path="/admin"
          element={

            <ProtectedRoute
              allowedRoles={["admin"]}
            >

              <AdminDashboard />

            </ProtectedRoute>

          }
        />

        {/* EDITOR ROUTE */}

        <Route
          path="/editor"
          element={

            <ProtectedRoute
              allowedRoles={["editor"]}
            >

              <EditorDashboard />

            </ProtectedRoute>

          }
        />

        {/* VIEWER ROUTE */}

        <Route
          path="/viewer"
          element={

            <ProtectedRoute
              allowedRoles={["viewer"]}
            >

              <ViewerDashboard />

            </ProtectedRoute>

          }
        />

        {/* UNAUTHORIZED */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* DEFAULT */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;