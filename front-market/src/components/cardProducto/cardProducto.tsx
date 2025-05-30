import React from 'react';
import { IonCard, IonCardHeader, IonCardContent, IonImg, IonText, IonTextarea } from '@ionic/react';
import './cardProducto.css';

interface Producto {
  img: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
}

interface CardProductoProps {
  producto: Producto;
}

const CardProducto: React.FC<CardProductoProps> = ({ producto }) => {
  return (
    <IonCard className="product-card">
      <div className="text-container"> 
      <div className="image-wrapper">
        <IonImg className="imgProducto" src={producto.img} />
      </div>
      
        <div className="text-content">
          <IonCardHeader>
            <IonText className="product-name">{producto.nombre}</IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonText className="product-info">
              ${producto.precio} - {producto.categoria}
            </IonText>
          </IonCardContent>
        </div>
      </div>
    </IonCard>
  );
};

export default CardProducto;