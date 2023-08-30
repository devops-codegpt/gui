import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: 
  [
    vue({
      template: { transformAssetUrls }
    }),
    crx({ manifest }),
    quasar({
      sassVariables: 'src/assets/scss/quasar-variables.scss'
    })
  ],
})
