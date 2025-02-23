// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // @ts-ignore
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  ssr: false,
  css: ['~/assets/styles/fonts.css']
  // routeRules: {
  //   '/': {
  //     ssr: false,
  //   },
  // },
})
