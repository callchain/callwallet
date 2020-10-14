<template>
  <div class="main mx-auto" style="width: 1200px;">
    <div style="width: 600px; position: relative;">
      <v-tabs
        v-model="tab"
        background-color="#f9f9f9"
        color="primary accent-4"
        icons-and-text
        left
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="item in tabs" :key="item.id" @click="handleTabClick(item.name)" :href="'#tab-'+item.id">
          {{item.text}}
          <v-icon>mdi-{{item.ico}}</v-icon>
        </v-tab>
      </v-tabs>
    </div>
    
    <!-- <NoData></NoData> -->
    <v-card
      class="mx-auto mt-2"
      max-width="1200"
      outlined
      light
    >
      <router-view />
    </v-card>
  </div>
</template>

<script>
import WalletContent from './Wallet/index.vue'
import NoData from '../../components/NoData'
import i18n from '../../plugins/i18n';

export default {
  name: 'Main',
  components: {
    WalletContent,
    NoData
  },
  data: () => ({
    tab: '',
    tabs: [
      { id: 1, ico: 'wallet', text: i18n.tc('tabs.wallet'), name: 'Wallet' },
      { id: 2, ico: 'arrow-up-bold-box', text: i18n.tc('tabs.send'), name: 'Send' },
      { id: 3, ico: 'arrow-down-bold-box', text: i18n.tc('tabs.receive'), name: 'Receive' },
      { id: 4, ico: 'telegram', text: i18n.tc('tabs.issue'), name: 'Issue' },
      { id: 5, ico: 'swap-vertical-bold', text: i18n.tc('tabs.trade'), name: 'Trade' },
      { id: 6, ico: 'cogs', text: i18n.tc('tabs.advanced'), name: 'Advanced' },
    ],
    text: 'asdasd'
  }),
  created() {
    this.tab = 'tab-'+ this.$route.query.index;
  },
  methods: {
    handleTabClick(path) {
      this.$router.push('./'+path.toLowerCase())
    }
  },
}
</script>
