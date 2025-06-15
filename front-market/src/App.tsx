import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Agregar from './pages/Agregar';
import ChatTab from './pages/ChatTab';
import Perfil from './pages/Perfil'
import { CambiarUbicacion } from './pages/cambiarUbicacion';
import { Login } from './pages/Seguro/login'
import { useAuth } from './context/contextUsuario';
import { ButonNavegation } from './components/tabs/opciones';
import ProtectedRoute from './routes/ProtectedRoute';
import { StatusBar } from '@capacitor/status-bar';
import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect } from 'react';

setupIonicReact();

const App: React.FC = () => {

  const { user, rol, loading } = useAuth();

  console.log('user', user);
  useEffect(() => {
    const configureStatusBar = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });

      } catch (err) {
        console.warn('StatusBar plugin no disponible', err);
      }
    };

    configureStatusBar();
  }, []);


  if (loading) {
    return (
      <IonApp>
        <div className="centered-loading" style={{ height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IonSpinner name="crescent" />
        </div>
      </IonApp>
    );
  }

  return (
    <IonApp >
      <IonReactRouter>
        <Route exact path="/">
          <Redirect to={user ? '/home' : '/login'} />
        </Route>
        {user ? (
          <IonTabs>
            <IonRouterOutlet>
              <ProtectedRoute exact path="/home" component={Home} allowedRoles={['usuario', 'ejecutivo']} isAuthenticated={!!user} userRole={rol ?? undefined} />
              <ProtectedRoute exact path="/agregar" component={Agregar} allowedRoles={['ejecutivo']} isAuthenticated={!!user} userRole={rol ?? undefined} />
              <ProtectedRoute exact path="/chat" component={ChatTab} allowedRoles={['usuario', 'ejecutivo']} isAuthenticated={!!user} userRole={rol ?? undefined} />
              <ProtectedRoute exact path="/perfil" component={Perfil} allowedRoles={['usuario', 'ejecutivo']} isAuthenticated={!!user} userRole={rol ?? undefined} />
              
              <ProtectedRoute exact path="/cambiar-ubicacion" component={CambiarUbicacion} allowedRoles={['ejecutivo']} isAuthenticated={!!user} userRole={rol ?? undefined} />
              

            </IonRouterOutlet>
            {rol && <ButonNavegation />}
            <Route path="*">
              <Redirect to="/home" />
            </Route>
          </IonTabs>
        ) : (
          <>
            <Route exact path="/login" component={Login} />
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </>
        )
        }
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
