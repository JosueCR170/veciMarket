import React, { useState } from 'react';
import { IonButton, IonInput, IonLabel, IonToast, IonImg, IonSelect, IonSelectOption } from '@ionic/react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { pencilOutline, closeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react'; // Asegúrate de tener esto también
import { Filesystem, Directory } from '@capacitor/filesystem';

import { useAuth } from '../../context/contextUsuario';

import { uploadProductImage, saveProductData } from '../../services/firebase/productService';

import './agregarProducto.css';
import { auth } from '../../services/firebase/config/firebaseConfig';

const AgregarProducto: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const {user}= useAuth();

    const categories = [
        { value: 'electrónica', label: 'Electrónica' },
        { value: 'ropa', label: 'Ropa' },
        { value: 'hogar', label: 'Hogar' },
        { value: 'alimentos', label: 'Alimentos' },
        { value: 'otro', label: 'Otro' }
    ];

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!productName || !description || !price || !category || !image) {
            setErrorMessage('Todos los campos son obligatorios.');
            setShowToast(true);
            return;
        }

        setIsUploading(true);
        try {
            if(!user || !user.uid) {
                setErrorMessage(`Error al agregar producto: Usuario no autenticado.`);
                return
            }

            const imageUrl = await uploadProductImage(productName, image);

            await saveProductData({
                nombre: productName,
                descripcion: description,
                precio: price,
                categoria: category,
                img: imageUrl,
                idVendedor: user?.uid
            });

            setProductName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage(null);
            setSuccessMessage('Producto agregado con éxito.');
            setShowToast(true);
        } catch (error: any) {
            console.error('Error al agregar producto:', error);
            setErrorMessage(`Error al agregar producto: ${error.message}`);
            setShowToast(true);
        } finally {
            setIsUploading(false);
        }
    };

    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
        });

        if (image && image.dataUrl) {
            setImage(image.dataUrl);
        }
    };

    return (
        <div className="add-product-container">
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div
                    className={`add-product-image-placeholder${isUploading ? ' add-product-image-placeholder--disabled' : ''}`}
                    onClick={!isUploading && !image ? takePicture : undefined}
                    style={isUploading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                >
                    {image ? (
                        <div className="add-product-image-wrapper">
                            <IonImg src={image} className="add-product-image-preview" />
                            <IonButton
                                fill="clear"
                                size="small"
                                className="icon-button edit-icon"
                                onClick={() => !isUploading && takePicture()}
                                disabled={isUploading}
                            >
                                <IonIcon icon={pencilOutline} />
                            </IonButton>

                            <IonButton
                                fill="clear"
                                size="small"
                                className="icon-button delete-icon"
                                onClick={() => !isUploading && setImage(null)}
                                disabled={isUploading}
                            >
                                <IonIcon icon={closeOutline} />
                            </IonButton>

                        </div>
                    ) : (
                        <div className="add-product-image-placeholder-text">Toca para agregar imagen</div>
                    )}

                </div>

                <div className='add-product-input-group'>
                    <IonLabel className='add-product-label'>Nombre del producto</IonLabel>
                    <IonInput
                        className='add-product-input'
                        value={productName}
                        onIonChange={e => setProductName(e.detail.value!)}
                        required
                        disabled={isUploading}
                    />
                </div>

                <div className='add-product-input-group'>
                    <IonLabel className='add-product-label'>Descripción</IonLabel>
                    <IonInput
                        className='add-product-input'
                        value={description}
                        onIonChange={e => setDescription(e.detail.value!)}
                        required
                        disabled={isUploading}
                    />
                </div>

                <div className='add-product-input-group'>
                    <IonLabel className='add-product-label'>Precio</IonLabel>
                    <IonInput
                        className='add-product-input'
                        type="number"
                        value={price}
                        onIonChange={e => setPrice(e.detail.value!)}
                        required
                        disabled={isUploading}
                    />
                </div>

                <div className='add-product-input-group'>
                    <IonLabel className='add-product-label'>Categoría</IonLabel>
                    <IonSelect
                        className='add-product-input'
                        value={category}
                        onIonChange={e => setCategory(e.detail.value!)}
                        interface="popover"
                        disabled={isUploading}
                    >
                        {categories.map(cat => (
                            <IonSelectOption key={cat.value} value={cat.value}>
                                {cat.label}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </div>

                <IonButton className="add-product-button" expand='full' type='submit' disabled={isUploading}>
                    {isUploading ? 'Agregando...' : 'Publicar'}
                </IonButton>
            </form>
            <IonToast
                position="top"
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={errorMessage}
                duration={3000}
                color="danger"
            />
               <IonToast
                position="top"
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={successMessage}
                duration={3000}
                color="success"
            />
        </div>
    );
};

export default AgregarProducto;