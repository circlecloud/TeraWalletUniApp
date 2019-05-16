import Vue from 'vue'
import VueI18n from 'vue-i18n'

import zhCN from './zh_CN'
import enUS from './en_US'

Vue.use(VueI18n)

var messages = {
	'en_US': enUS,
	'zh_CN': zhCN
}

const i18n = new VueI18n({
	locale: 'en_US',
	fallbackLocale: 'zh_CN',
	messages
})

export default i18n
