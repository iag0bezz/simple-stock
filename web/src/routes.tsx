import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './contexts/auth.context'
import ProtectedRoute from './middlewares/auth.middleware'

import {
  Authentication,
  Dashboard
} from './pages'

export default function Routes() {
  return (
    <BrowserRouter>
      <Toaster />
      <AuthContextProvider>
        <Switch>
          <ProtectedRoute component={Dashboard} path='/dashboard' />
          <Route exact path='/' component={Authentication} />

          <Redirect from='*' to='/' />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  )
}