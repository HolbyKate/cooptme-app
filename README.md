# Cooopt.me
https://github.com/user-attachments/assets/c5b58cdf-f55f-48c5-ad36-e16cb6a54c02

Cooptme is a professional networking mobile application that integrates with LinkedIn to facilitate and optimize the management of professional contacts at events. The application scans QR codes on attendees' badges to automatically retrieve and categorize their LinkedIn profiles.


## Installation

Install my-project with npx
bash
```
npx create-expo-app@latest myApp --template
cd myApp

```
### Install react-native-webview, expo-device plugin and expo-constants plugin

1. install react-native-webview
``` npm
npm install --save react-native-webview
```

2. install expo-device
``` npm
npm install --save expo-device
```

3. install expo-constants
``` npm
npm install --save expo-constants
```

## Add librairies
bash
```
### Navigation
npm install @react-navigation/native react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-get-random-values

### Stack Navigation
npm install @react-navigation/native-stack

### TypeScript support
npm install --save-dev typescript @types/react @types/react-native

### Axios for API
npm install axios

### Expo Document Picker (upload de fichiers)
npm install expo-document-picker

### Expo Camera (for qrcode scanner)
npm install expo-camera

### PapaParse (parsing CSV)
npm install papaparse

### Lucide Icons
npm install lucide-react-native

### Async Storage (Manage tokens)
npm install @react-native-async-storage/async-storage

### Gestion des variables d'environnement
npm install react-native-dotenv
```

Scripts NPM:
```
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write .",
  "build": "expo build"
}
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Configuration for using variables
Install react-native-dotenv :

bash
```
npm install react-native-dotenv
```

add babel.config.js Configuration
```
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        "moduleName": "@env",
        "path": ".env",
        "allowUndefined": false,
      }],
      'react-native-reanimated/plugin'
    ],
  };
};
```

## Deployment

### Steps for Deploying Prisma Backend:

Sync the database schema:
```bash
npx prisma migrate deploy
```
Generate the Prisma Client:
```bash
npx prisma generate
```
Start the server:
```bash
npm run start
```

## Technologies Used

|   Technology  | Purpose       |
| ------------- | ------------- |
| Expo          | Project management for React Native.  |
| React Native  | Mobile application framework. |
| TypeScript | Static typing for JavaScript. |
| Axios | HTTP API calls. |
| Prisma| ORM for managing the database. |
| PostgreSQL | Main database. |
| AsyncStorage | Local storage for tokens. |
| Expo Camera | QR code scanning. |
| PapaParse |Parsing CSV files.|
| Lucide React Native | Modern icons for UI. |
| React Navigation | Managing navigation between screens. |

## API reference:

5.2 Profiles
|   Endpoint|   Method  | Description    |
| ------------- | ------------- |-------------
|   /profiles|   GET  | List all profiles   |
|   /profiles/:id|   GET  | Retrieve profile details   |
|   /profiles|   POST  | Create a new profile  |
|   /profiles/:id|   PUT  | Update an existing profile   |
|   /profiles/:id|   DELETE  | Delete a profile  |


## Authors

- [@HolbyKate](https://www.github.com/holbykate)
