// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, useRoutes} from 'react-router-dom';
import routes from "./routes/routes";
import {ErrorProvider} from "./contexts/ErrorContext";

const AppRoutes = () => {
    return useRoutes(routes);
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
          <ErrorProvider>
              <AppRoutes />
          </ErrorProvider>
      </div>
    </Router>
  );
};

export default App;
