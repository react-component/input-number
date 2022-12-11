import { defineConfig } from 'dumi';

export default defineConfig({
  favicons: [
    'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  ],
  themeConfig: {
    name: 'InputNumber',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'
  },
  outputPath: '.doc',
  exportStatic: {},
  styles: [`body .dumi-default-header-left { width: 230px; } body .dumi-default-hero-title { font-size: 100px; }`],
});
