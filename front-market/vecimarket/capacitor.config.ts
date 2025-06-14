import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.una.vecimarkey',
  appName: 'veciMarket',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
    androidScheme: 'http',

  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"]
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: [
        "google.com"
      ]
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    GoogleMaps: {
      apiKey: "AIzaSyBV35eS9s-QUwN0WcZWeK-XIoICekxqXwk",
    },
  }
};

export default config;
