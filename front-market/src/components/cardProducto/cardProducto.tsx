import React from 'react';
import { IonCard, IonCardHeader, IonCardContent, IonImg, IonText } from '@ionic/react';
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
      <IonImg className='imgProducto' src={producto.img} />
      <IonCardHeader>
        <IonText className="product-name">{producto.nombre}</IonText>
      </IonCardHeader>
      <IonCardContent>
        <IonText className="product-description">{producto.descripcion}</IonText>
        <IonText className="product-price">${producto.precio}</IonText>
        <IonText className="product-category">Category: {producto.categoria}</IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default CardProducto;