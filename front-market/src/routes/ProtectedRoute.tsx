import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  isAuthenticated: boolean;
  allowedRoles?: string[];
  userRole?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  
  component: Component,
  isAuthenticated,
  allowedRoles,
  userRole,
  ...rest
}) => (
  
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated && (!allowedRoles || allowedRoles.includes(userRole || '')) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/home" />
      )
    }
  />
);

export default ProtectedRoute;