// Single-root Expo app, so Metro needs no workspace wiring — only the NativeWind
// wrapper, which compiles `src/global.css` through Tailwind and hands the result
// to the style engine. Without this the `className` props are inert strings and
// every screen renders unstyled.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

module.exports = withNativeWind(getDefaultConfig(__dirname), {
  input: './src/global.css',
});
