import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">
                    ⚽ Football Shirt Collection
                  </h1>
                  <p className="text-muted-foreground">
                    Frontend setup complete!
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
