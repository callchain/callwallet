import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const messages = {
    'zh_CN': require('../i18n/zh_CN'),
    'en_US': require('../i18n/en_US')
}

export default new VueI18n({
    locale: 'en_US',
    messages: messages
})