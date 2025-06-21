import { createAnimation, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/react';

import { useState, useEffect } from 'react';

import { arrowBackOutline, chevronForwardOutline, shieldHalf, star, trendingUp, lockClosed, bagHandle, eye, compass, cube } from 'ionicons/icons';
import { LogoutButton } from "../authentication/logOut";
import { TipoCuenta } from './submenus/tipoCuenta';
import { useAuth } from '../../context/contextUsuario';
import { SubmodalHeader } from './submenus/submodalHeader';
// import { CambiarUbicacion } from './submenus/cambiarUbicacion';
import { useHistory } from 'react-router';
import { EliminarProducto } from './submenus/eliminarProducto';
interface ModalContentProps {
  isOpen: boolean;
  onClose: () => void;
}
const ModalContent: React.FC<ModalContentProps> = ({ isOpen, onClose }) => {
  const { rol } = useAuth();
  const [submenuActivo, setSubmenuActivo] = useState<string | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const history = useHistory();



  const abrirSubmenu = (id: string) => {
    setSubmenuActivo(id);
  };

  const cerrarSubmenu = () => {
    setSubmenuActivo(null);
  };

  useEffect(() => {
    if (submenuActivo === "cambiar-ubicacion") {
      history.replace('/cambiar-ubicacion');
    }
  }, [submenuActivo]);


  const configuraciones = [
    {
      titulo: 'Como usas ViceMarket',
      items: [
        { id: 'cuenta', icon: shieldHalf, label: 'Tipo de cuenta' },
        { id: 'favoritos', icon: star, label: 'Productos favoritos' },
        { id: 'actividad', icon: trendingUp, label: 'Tu actividad' },
      ]
    },

    ...(rol === 'ejecutivo'
      ? [{
        titulo: 'Como ven tu contenido',
        items: [
          { id: 'privacidad', icon: lockClosed, label: 'Privacidad de contenido' },
          { id: 'tus-productos', icon: cube, label: 'Tus productos' },
          { id: 'vendidos', icon: bagHandle, label: 'Tus productos vendidos' },
          { id: 'mas-visto', icon: eye, label: 'Contenido más visto' },
        ]
      }]
      : []
    ),
    {
      titulo: 'Cuenta',
      items: rol === 'ejecutivo'
        ? [{ id: 'cambiar-ubicacion', icon: compass, label: 'Cambiar Ubicación' }]
        : []
    },
  ];


  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot || baseEl;
    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, transform: 'translateX(100%)', opacity: '0' },
        { offset: 1, transform: 'translateX(0)', opacity: '1' },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(300)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot || baseEl;

    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', 'var(--backdrop-opacity)', '0');

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, transform: 'translateX(0)', opacity: '1' },
        { offset: 1, transform: 'translateX(100%)', opacity: '0' },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-in')
      .duration(300)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  return (
    <>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={onClose}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
        backdropDismiss={true}
        className="custom-font">
        <div>
          <IonToolbar className='tootalModalConfiguracion' >
            <IonTitle className='tituloModalConfig'>Configuración</IonTitle>

            <span slot="start" onClick={onClose} style={{ cursor: 'pointer' }}>
              <IonIcon icon={arrowBackOutline} style={{ fontSize: '24px', stroke: '#0003c9' }} />
            </span>
          </IonToolbar>
          <div style={{ height: '1px', backgroundColor: '#ccc', width: '100%' }}></div>
        </div>
        <IonContent >
          <IonList>
            {configuraciones.map((grupo, index) => (
              <IonItemGroup key={index}>
                <IonItem className="contenido-Titulo" lines="none">
                  <IonLabel>{grupo.titulo}</IonLabel>
                </IonItem>
                {grupo.items.filter(item => !(rol === 'ejecutivo' && item.id === 'cuenta')).map((item, idx) => (

                  <IonItem className="contenido-ItemContenido" lines="none" key={idx} onClick={() => abrirSubmenu(item.id)} >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <IonIcon icon={item.icon} slot="start" style={{ fontSize: '16px', marginRight: '10px' }} />
                      <IonLabel>{item.label}</IonLabel>
                    </div>
                    <IonIcon style={{ color: 'black' }} icon={chevronForwardOutline} slot="end" />

                    {/* <SubmodalHeader titulo={item.id} onClose={cerrarSubmenu} /> */}

                  </IonItem>
                ))}
                <div style={{ height: '3px', backgroundColor: '#7c7c7c', width: '100%' }} />
              </IonItemGroup>
            ))}
            <IonItemGroup>
              <IonItem className='contenido-Titulo' lines="none">
                <IonLabel>Inicio de sesión</IonLabel>
              </IonItem>
              <IonItem
                lines="none"
                style={{
                  '--padding-start': 0,
                  '--inner-padding-top': 0,
                  '--inner-padding-bottom': 0,
                  '--inner-padding-start': 0,
                  '--inner-padding-end': 0,
                } as React.CSSProperties}
              >
                <LogoutButton />
              </IonItem>
            </IonItemGroup>
          </IonList>
        </IonContent>
        <IonModal
          isOpen={!!submenuActivo}
          onDidDismiss={() => {
            cerrarSubmenu();
            setModalAbierto(false);
          }}
          enterAnimation={enterAnimation}
          leaveAnimation={leaveAnimation}
          className="custom-font"
          backdropDismiss={false}
          onDidPresent={() => setModalAbierto(true)}
        >
          {submenuActivo === "cuenta" && <TipoCuenta onClose={cerrarSubmenu} />}

          {submenuActivo === "favoritos" && <SubmodalHeader titulo='Productos Favoritos' onClose={cerrarSubmenu} />}
          {submenuActivo === "actividad" && <SubmodalHeader titulo='Tu actividad' onClose={cerrarSubmenu} />}
          {submenuActivo === "privacidad" && <SubmodalHeader titulo='Privacidad de contenido' onClose={cerrarSubmenu} />}

          {submenuActivo === "tus-productos" && <EliminarProducto onClose={cerrarSubmenu} />}

          {submenuActivo === "vendidos" && <SubmodalHeader titulo='Tus productos vendidos' onClose={cerrarSubmenu} />}
          {submenuActivo === "mas-visto" && <SubmodalHeader titulo='Contenido más visto' onClose={cerrarSubmenu} />}

          {/* {submenuActivo === "cambiar-ubicacion" && <CambiarUbicacion />} */}

        </IonModal>
      </IonModal>
    </>
  );
};

export default ModalContent;