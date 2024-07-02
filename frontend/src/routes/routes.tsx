// src/routes/routes.tsx
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ImportSheet from '../screens/ImportSheet';
import VacationSheets from "../screens/VacationsSheets";
import ImportErrors from '../screens/ImportErrors';
import MainLayout from "../layouts/mainLayout";
import { routePaths } from './routePaths'; // Import route paths

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={routePaths.signIn} />,
  },
  {
    path: routePaths.signIn,
    element: <SignIn />,
  },
  {
    path: routePaths.signUp,
    element: <SignUp />,
  },
  {
    element: <MainLayout />, // Use layout for authenticated routes
    children: [
      {
        path: routePaths.importSheet,
        element: <ImportSheet />,
      },
      {
        path: routePaths.vacationsRegistered,
        element: <VacationSheets />,
      },
      {
        path: routePaths.importErrors,
        element: <ImportErrors />,
      },
    ],
  },
  // Add other routes here
];

export default routes;

