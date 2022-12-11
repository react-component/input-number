import { createConfig, type Config } from '@umijs/test';

const defaultConfig = createConfig({
  target: 'browser',
  jsTransformer: 'swc'
});

const config: Config.InitialOptions = {
  ...defaultConfig,
  setupFiles: [
    ...defaultConfig.setupFiles,
    './tests/setup.js'
  ]
};

export default config;
