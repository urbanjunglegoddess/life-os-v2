const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// inlineRem 16 keeps any stock rem-based utility on the same 16px root as the
// web, instead of NativeWind's default of 14.
module.exports = withNativeWind(config, {
  input: './src/global.css',
  inlineRem: 16,
});
