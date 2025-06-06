import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
} from '@ionic/react';
import './cardProducto.css';


interface Producto {
  id: string;
  img: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  idVendedor?: string;
  contacto: React.ReactNode; 
}

interface CardProductoProps {
  producto: Producto;
  onClick: (producto: Producto) => void;
}

const CardProducto: React.FC<CardProductoProps> = ({ producto, onClick }) => {
  return (
    <IonCard onClick={() => onClick(producto)} style={{ cursor: 'pointer' }}>
      <IonImg src={producto.img} alt={producto.nombre} />
      <IonCardHeader>
        <IonCardTitle>{producto.nombre}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>${producto.precio}</p>
        <p>{producto.descripcion}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default CardProducto;