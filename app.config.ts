import { COLOR } from '@life-os/tokens';
import type { ExpoConfig } from 'expo/config';

// Expo config as TypeScript rather than app.json so the splash and adaptive-icon
// grounds come from the token module. A hex here would be a second definition of
// a design value, which 4.7 §11 forbids as flatly as it forbids one in a component.
const config: ExpoConfig = {
  name: 'Life OS',
  // The slug and projectId together are what EAS resolves this app to. Renaming
  // the slug would orphan the EAS project, so the display name above carries the
  // brand and the slug stays as EAS already knows it.
  slug: 'life-os-v2',
  owner: 'urban-jungle-goddess',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'lifeosv2',
  // One theme exists: dark base (4.7). Light and high-contrast are FUTURE-STATE,
  // which the semantic layer is built to make possible later.
  userInterfaceStyle: 'dark',
  backgroundColor: COLOR['bg-base'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.urbanjunglegoddess.lifeosv2',
    icon: './assets/expo.icon',
  },
  android: {
    package: 'com.urbanjunglegoddess.lifeosv2',
    adaptiveIcon: {
      backgroundColor: COLOR['bg-base'],
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    // The journal gate (rule 6). iOS refuses Face ID without a usage string, and
    // the refusal surfaces as a generic authentication failure rather than as a
    // missing-permission error — so the gate would simply never open.
    //
    // Config plugins do not apply under Expo Go, so the gate only behaves
    // correctly from a development build onward. Everything else runs in Go.
    [
      'expo-local-authentication',
      {
        faceIDPermission:
          'Life OS asks Face ID before opening your journal, every time you come back to it.',
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        backgroundColor: COLOR['bg-base'],
        imageWidth: 160,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: 'f1db8bba-961e-47fe-866f-93a7b0c5a6db',
    },
  },
};

export default config;
