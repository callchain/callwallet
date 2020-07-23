import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// 字体图标
import '@mdi/font/css/materialdesignicons.css'

// 中文
import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/zh-Hans'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    current: 'zhHans',
    locales: { en, zhHans },
  },
  theme: {
    themes: {
      light: {
        primary: '#c91c46',
        header: '#EEEEEE',
        cardHover: '#f63665',
        btnHover: '#E53935',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
})
