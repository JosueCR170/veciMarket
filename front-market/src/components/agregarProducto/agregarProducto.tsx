import React, { useState } from 'react';
import { IonButton, IonInput, IonLabel, IonToast, IonImg, IonSelect, IonSelectOption } from '@ionic/react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../services/firebase/config/firebaseConfig'; // Import Firebase app
import './agregarProducto.css';

const AgregarProducto: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const storage = getStorage(app); // Get Firebase Storage instance
    const firestore = getFirestore(app); // Get Firestore instance

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!productName || !description || !price || !category || !image) {
            setErrorMessage('Todos los campos son obligatorios.');
            setShowToast(true);
            return;
        }

        setIsUploading(true);
        try {
            // Upload image to Firebase Storage
            const storageRef = ref(storage, `productos/${new Date().getTime()}-${productName}.jpeg`);
            const uploadTask = await uploadString(storageRef, image, 'data_url');
            const downloadURL = await getDownloadURL(storageRef);

            // Save product details to Firestore
            await addDoc(collection(firestore, 'productos'), {
                nombre: productName,
                descripcion: description,
                precio: price,
                categoria: category,
                img: downloadURL,
            });

            // Reset form fields
            setProductName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage(null);
            setErrorMessage('Producto agregado con éxito.');
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
                {/* Image Placeholder */}
                <div
                    className={`add-product-image-placeholder${isUploading ? ' add-product-image-placeholder--disabled' : ''}`}
                    onClick={!isUploading ? takePicture : undefined}
                    style={isUploading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                >
                    {image ? (
                        <IonImg src={image} className="add-product-image-preview" />
                    ) : (
                        <div className="add-product-image-placeholder-text">Toca para agregar imagen</div>
                    )}
                </div>

                {/* Product Name Input */}
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

                {/* Description Input */}
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

                {/* Price Input */}
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

                {/* Category Select */}
                <div className='add-product-input-group'>
                    <IonLabel className='add-product-label'>Categoría</IonLabel>
                    <IonSelect
                        className='add-product-input'
                        value={category}
                        onIonChange={e => setCategory(e.detail.value!)}
                        interface="popover"
                        disabled={isUploading}
                    >
                        <IonSelectOption value="electronics">Electrónica</IonSelectOption>
                        <IonSelectOption value="clothing">Ropa</IonSelectOption>
                        <IonSelectOption value="home">Hogar</IonSelectOption>
                        <IonSelectOption value="food">Alimentos</IonSelectOption>
                        <IonSelectOption value="other">Otro</IonSelectOption>
                    </IonSelect>
                </div>

                {/* Publish Button */}
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
        </div>
    );
};

export default AgregarProducto;