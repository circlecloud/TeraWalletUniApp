import defaultInfo from './default-info'
var mutations = {
	init(state) {
		defaultInfo.language = state.i18n.locale;
		defaultInfo.nickName = state.i18n.messages[state.i18n.locale].my.noLogin;
		state.userInfo = {
			...defaultInfo
		}
	},
	login(state, userInfo) {
		state.isLogin = true;
		state.userInfo = userInfo;
	},
	logout(state) {
		state.isLogin = false;
	}
}
export default mutations;
