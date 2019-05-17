var actions = {
	setI18n({
		commit,
		state,
		dispatch
	}, i18n) {
		state.i18n = i18n;
		commit('init');
	},
	logout({
		commit,
		state,
		dispatch
	}) {
		commit('logout');
		commit('init');
	},
	login({
		commit,
		state,
		dispatch
	}, {
		vueInstance,
		userInfo
	}) {
		commit('login', userInfo);
		state.i18n.locale = userInfo.language;
		dispatch('changeLanguage', vueInstance)
	},
	changeLanguage({
		commit,
		state
	}, vueInstance) {
		uni.setTabBarItem({
			index: 0,
			text: vueInstance.$t('index.tabBarTitle')
		});
		uni.setTabBarItem({
			index: 1,
			text: vueInstance.$t('kanban.tabBarTitle')
		});
		uni.setTabBarItem({
			index: 2,
			text: vueInstance.$t('account.tabBarTitle')
		});
		uni.setTabBarItem({
			index: 3,
			text: vueInstance.$t('my.tabBarTitle')
		});
	}
}
export default actions;
