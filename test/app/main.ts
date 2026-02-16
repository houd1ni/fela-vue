import { createApp as createClientApp, createSSRApp } from 'vue'
import App from './App.vue'

const ssr = Boolean(false)

const createApp = ssr ? createSSRApp : createClientApp
const getApp = async () => {
  const app = createApp(App)
  if(ssr) {
    return app
  } else {
    app.mount('#app')
  }
}

if(!ssr) getApp()
export default getApp