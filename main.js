import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'

Vue.prototype._i18n = i18n
Vue.prototype.$store = store

store.commit('setI18n', i18n);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
	...App
})

app.$mount()
