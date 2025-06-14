import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonText,
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
    <IonCard className="product-card" onClick={() => onClick(producto)}>
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