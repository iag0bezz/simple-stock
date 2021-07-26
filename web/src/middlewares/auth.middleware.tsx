import React, { FunctionComponent } from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hook';

import { HashLoader } from 'react-spinners';

interface ProtectedRouteProps extends RouteProps {
  component:
   | React.ComponentType<RouteComponentProps<any>>
   | React.ComponentType<any>
}

const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { loggedIn, checking } = useAuth();

  return (
    <Route
      {...rest}
      render={props => checking ? <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}><HashLoader color='#835afd' size={50} loading={checking} /></div> : loggedIn ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />}
    />
  )
}

export default ProtectedRoute;