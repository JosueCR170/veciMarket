// import { collection, doc, writeBatch } from "firebase/firestore";
// import { ref, uploadString, getDownloadURL } from "firebase/storage";
// import { firestore, storage } from "./firebase"; // tu archivo de configuración
// import { getAuth } from "firebase/auth";

// const agregarProductoConImagenYActualizarVendedor = async ({ productName, description, price, category, image }) => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) {
//     throw new Error("Usuario no autenticado");
//   }

//   try {
//     const uid = user.uid;

//     // 1. Subir imagen a Firebase Storage
//     const imageRef = ref(storage, `productos/${Date.now()}-${productName}.jpeg`);
//     await uploadString(imageRef, image, 'data_url');
//     const downloadURL = await getDownloadURL(imageRef);

//     // 2. Preparar referencias a Firestore
//     const productosRef = collection(firestore, 'productos');
//     const nuevoProductoRef = doc(productosRef); // genera un nuevo ID

//     const productoData = {
//       nombre: productName,
//       descripcion: description,
//       precio: price,
//       categoria: category,
//       img: downloadURL,
//       creadoEn: new Date(),
//       vendedorId: uid,
//     };

//     // Subcolección del vendedor
//     const vendedorProductoRef = doc(firestore, `vendedores/${uid}/productos/${nuevoProductoRef.id}`);

//     // 3. Crear y ejecutar batch
//     const batch = writeBatch(firestore);
//     batch.set(nuevoProductoRef, productoData);
//     batch.set(vendedorProductoRef, productoData);

//     await batch.commit();
//     console.log("Producto agregado y registrado en la cuenta del vendedor");
//   } catch (error) {
//     console.error("Error al agregar producto con imagen:", error);
//   }
// };
