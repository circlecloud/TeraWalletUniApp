import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

var messages = {
	'en_US': require('./en_US'),
	'zh_CN': require('./zh_CN')
}

const i18n = new VueI18n({
	locale: 'en_US',
	fallbackLocale: 'en_US',
	messages
})

export default i18n
