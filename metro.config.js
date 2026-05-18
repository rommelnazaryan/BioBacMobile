const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
    // Allow imports like: import X from '@/...'
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Make sure Metro can resolve `@/something` even if Babel cache is stale.
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith('@/')) {
        const mapped = path.resolve(__dirname, 'src', moduleName.slice(2));
        return context.resolveRequest(context, mapped, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  watchFolders: [path.resolve(__dirname, 'src')],
};

module.exports = mergeConfig(defaultConfig, config);
