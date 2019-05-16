import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		i18n: {},
		isLogin: false,
		userInfo: {
			nickName: '',
			gender: 1,
			language: "",
			city: "",
			province: "",
			country: "",
			avatarUrl: "/static/images/tera.png"
		}
	},
	mutations: {
		setI18n(state, i18n) {
			state.i18n = i18n;
			state.language = i18n.locale;
			state.userInfo.nickName = i18n.messages[state.language].my.noLogin;
		},
		login(state, userInfo) {
			state.isLogin = true;
			state.userInfo = userInfo;
			state.i18n.locale = userInfo.language;
		}
	},
	actions: {

	}
})

export default store
