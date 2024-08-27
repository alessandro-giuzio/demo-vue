import { fileURLToPath, URL } from 'node:url'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'

import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VueRouterAutoImports } from 'unplugin-vue-router'
import Components from 'unplugin-vue-components/vite'
// Vite configuration file
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Automatically import components as they are used
    Components({ /* options */ }),
    // Automatically import specified libraries and utilities
    AutoImport({ include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    imports: [
      'vue', // Automatically import Vue functions
      VueRouterAutoImports, // Automatically import Vue Router functions
      {
        'pinia': ['defineStore', 'storeToRefs','acceptHMRUpdate']
      }
    ],
      dts: true, // Generate TypeScript declaration files for auto-imports
      viteOptimizeDeps: true, // Optimize dependencies for faster builds
      dirs: ['src/stores'] // Specify directories to include for auto-imports
  }),
    // Plugin for Vue Router, handles Vue Router setup
    VueRouter(),
    // Vue plugin with custom template compiler options
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (element) => element.startsWith('iconify-icon')
        }
      }
    })
  ],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()], // PostCSS plugins for Tailwind CSS and autoprefixing
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // Alias '@' to the 'src' directory for easier imports
    }
  }
})
