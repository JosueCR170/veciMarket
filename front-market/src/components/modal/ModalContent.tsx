import { createAnimation, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { arrowBackOutline, chevronForwardOutline, shieldHalf, star, trendingUp, lockClosed,bagHandle, eye } from 'ionicons/icons';
import {LogoutButton }  from "../authentication/logOut";
import '../../pages/perfil.css'
interface ModalContentProps {
  isOpen: boolean;
  onClose: () => void;
}


const ModalContent: React.FC <ModalContentProps> = ({ isOpen, onClose }) =>{
    
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
     <IonModal isOpen={isOpen} onDidDismiss={onClose} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation} className="custom-font">

       <div>
      <IonToolbar style={{ '--background':'#eeee',color:'black', boxShadow: 'none', '--ion-color-step-100': '#fff', '--padding-start': '16px', '--padding-end': '16px'  }}>
        <IonTitle style={{ fontSize: '18px',  textAlign: 'center', fontFamily: "Poppins, sans-serif"}} >Configuracion</IonTitle>
        <span slot="start" onClick={onClose} style={{ cursor: 'pointer'}}>
        <IonIcon icon={arrowBackOutline} style={{fontSize: '24px', stroke: '#0003c9'}}/>
       </span>
      </IonToolbar>
      

      <div style={{ height: '1px', backgroundColor: '#ccc', width: '100%' }}></div>
      </div>
        
      <IonContent >
        <IonList>
      <IonItemGroup>
        <IonItem className='contenido-Titulo'lines="none">   
          <IonLabel>Como usas ViceMarket</IonLabel>
        </IonItem>
        <IonItem className='contenido-ItemContenido' lines="none"> 
            <div style={{ display: 'flex', alignItems: 'center' }}>
             <IonIcon icon={shieldHalf} slot='start' style={{ fontSize: '16px', marginRight: '10px' }} />
             <IonLabel>Actualizacion de seguridad</IonLabel>   
            </div>
          <IonIcon style={{color: "black"}}  icon={chevronForwardOutline} slot="end" />
        </IonItem>
        <IonItem lines="none" className='contenido-ItemContenido'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IonIcon icon={star} slot='start' style={{ fontSize: '16px', marginRight: '10px' }} />
                <IonLabel>Productos favoritos</IonLabel>
            </div>
          <IonIcon style={{color: "black"}}  icon={chevronForwardOutline} slot="end" />
        </IonItem>
        <IonItem lines="none" className='contenido-ItemContenido' >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IonIcon icon={trendingUp} slot='start' style={{ fontSize: '16px', marginRight: '10px' }} />
                <IonLabel>Tu actividad</IonLabel>
            </div>
          <IonIcon style={{color: "black"}}  icon={chevronForwardOutline} slot="end" />
        </IonItem>
      </IonItemGroup>
         <div style={{ height: '3px', backgroundColor: '#7c7c7c', width: '100%' }}/>
  
      <IonItemGroup>
         <IonItem className='contenido-Titulo' lines="none">
          <IonLabel>Como ven tu contenido</IonLabel>
        </IonItem>
        <IonItem lines="none" className='contenido-ItemContenido'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IonIcon icon={lockClosed} slot='start' style={{ fontSize: '16px', marginRight: '10px' }} />
                <IonLabel>Privacidad de contenido</IonLabel>
            </div>
          <IonIcon style={{color: "black"}}  icon={chevronForwardOutline} slot="end" />
        </IonItem>
        <IonItem lines="none"className='contenido-ItemContenido'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IonIcon icon={bagHandle} slot='start' style={{ fontSize: '16px', marginRight: '10px' }} />
            <IonLabel>Tus productos vendidos</IonLabel>
          </div>
          <IonIcon style={{color: "black"}} icon={chevronForwardOutline} slot="end" />
        </IonItem>
        <IonItem lines="none" className='contenido-ItemContenido'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IonIcon icon={eye} slot='start' style={{ fontSize: '16px', marginRight: '10px' }} />
            <IonLabel>Contenido mas visto</IonLabel>
          </div>
          <IonIcon style={{color: "black"}}   icon={chevronForwardOutline} slot="end" />
        </IonItem>
      </IonItemGroup>
       <div style={{ height: '3px', backgroundColor: '#7c7c7c', width: '100%'}}></div>
     
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
    </IonModal>
    </>
  );
};

export default ModalContent;