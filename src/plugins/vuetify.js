import Vue from 'vue'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar'

// 字体图标
import '@mdi/font/css/materialdesignicons.css'

// 中文
import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/zh-Hans'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
})

const VuetifyObj = new Vuetify({
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

Vue.use(VuetifyToast, {
  $vuetify: VuetifyObj.framework,
  x: 'right',
  y: 'bottom',
  timeout: 3000,
  multiLine: true,
  showClose: false
})

export default VuetifyObj



