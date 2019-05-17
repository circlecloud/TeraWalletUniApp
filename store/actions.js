import rpc from '@/rpc';

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
	}, {
		vueInstance
	}) {
		commit('logout');
		dispatch('changeLanguage', {
			vueInstance
		})
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
		dispatch('changeLanguage', {
			vueInstance,
			locale: userInfo.language
		})
	},
	changeNotidy({
		state
	}) {
		rpc.request('notify', state.i18n.messages[state.i18n.locale].env).then(result => (state.notify = result.data));
	},
	changeLanguage({
		commit,
		state,
		dispatch
	}, {
		vueInstance,
		locale
	}) {
		state.i18n.locale = locale || state.i18n.fallbackLocale;
		dispatch('changeNotidy');
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
