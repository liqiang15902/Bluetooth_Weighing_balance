import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

if(uni.getStorageSync('webserve') != ''){
				Vue.prototype.$webserve_gol = uni.getStorageSync('webserve')
			}else {
				Vue.prototype.$webserve_gol = '请设置ip'
			}


App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif