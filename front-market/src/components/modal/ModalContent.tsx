import { createAnimation, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { arrowBackOutline, chevronForwardOutline, shieldHalf, star, trendingUp, lockClosed, bagHandle, eye } from 'ionicons/icons';
import { LogoutButton } from "../authentication/logOut";
import { TipoCuenta } from './submenus de modal/tipoCuenta';
import { ModelGeneral } from './submenus de modal/modelGeneral';
import { useAuth } from '../../context/contextUsuario';
interface ModalContentProps {
  isOpen: boolean;
  onClose: () => void;
}
const ModalContent: React.FC<ModalContentProps> = ({ isOpen, onClose }) => {
  const { rol } = useAuth();
  const [submenuActivo, setSubmenuActivo] = useState<string | null>(null);

  const abrirSubmenu = (id: string) => {
    setSubmenuActivo(id);
  };

  const cerrarSubmenu = () => {
    setSubmenuActivo(null);
  };

  const configuraciones = [
    {
      titulo: 'Como usas ViceMarket',
      items: [
        { id: 'cuenta', icon: shieldHalf, label: 'Tipo de cuenta' },
        { id: 'favoritos', icon: star, label: 'Productos favoritos' },
        { id: 'actividad', icon: trendingUp, label: 'Tu actividad' },
      ]
    },
    {
      titulo: 'Como ven tu contenido',
      items: [
        { id: 'privacidad', icon: lockClosed, label: 'Privacidad de contenido' },
        { id: 'vendidos', icon: bagHandle, label: 'Tus productos vendidos' },
        { id: 'mas-visto', icon: eye, label: 'Contenido más visto' },
      ]
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
            <IonTitle className='tituloModalConfig'  >Configuracion</IonTitle>
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
                  </IonItem>
                ))}
                <div style={{ height: '3px', backgroundColor: '#7c7c7c', width: '100%' }} />
              </IonItemGroup>
            ))}
            <IonItemGroup>
              <IonItem className='contenido-Titulo' lines="none">
                <IonLabel>Inicio de sesion</IonLabel>
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
          onDidDismiss={cerrarSubmenu}
          enterAnimation={enterAnimation}
          leaveAnimation={leaveAnimation}
          className="custom-font"
          backdropDismiss={false}
        >
          {submenuActivo === "cuenta" && <TipoCuenta onClose={cerrarSubmenu} />}
          {submenuActivo !== "cuenta" && <ModelGeneral onClose={cerrarSubmenu} />}
        </IonModal>
      </IonModal>
    </>
  );
};

export default ModalContent;