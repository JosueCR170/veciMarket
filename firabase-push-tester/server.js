const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let firebaseInitialized = false;
let firebaseError = null;

function initializeFirebase() {
  if (admin.apps.length > 0) return;

  try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log('Firebase inicializado');
  } catch (err) {
    firebaseError = err.message;
    console.error('Error al inicializar Firebase:', err);
  }
}

initializeFirebase();

const checkFirebaseInitialized = (req, res, next) => {
  if (firebaseInitialized) return next();
  res.status(503).json({ success: false, message: 'Firebase no inicializado', error: firebaseError });
};

app.post('/api/send-notification', checkFirebaseInitialized, async (req, res) => {
  const { token, title, body, data } = req.body;
  if (!token || !title || !body) {
    return res.status(400).json({ success: false, message: 'token, title y body son requeridos' });
  }

  try {
    const message = {
      notification: { title, body },
      data: data || {},
      token
    };
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al enviar notificación', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
