<template>
  <div class="main d-flex" style="min-height: 550px">
      <div class="nav d-flex flex-column" style="width: 130px;">
          <v-hover v-for="(item, index) in navList" :key="index" v-slot:default="{ hover }">
              <span 
                :class="hover? 'primary--text d-block pl-5 text-body-1':'black--text d-block pl-5 text-body-1'" 
                :style="{ background: (item.isActive? '#f63665':''), color: (item.isActive? 'white !important':''), lineHeight: '50px', cursor: 'pointer'}" 
                @click="handleTabClick(index)">{{item.text}}</span>
          </v-hover>
      </div>
    <div style="flex: 1;" class="pa-2">
        <router-view></router-view>  
    </div>   
  </div>
</template>

<script>
import i18n from './../../../plugins/i18n';

export default {
  name: 'Wallet',
  data: () => ({
      navList: [
          { text: i18n.tc('wallet.index.balance'), name: 'balance', isActive: true },
          { text: i18n.tc('wallet.index.history'), name: 'history', isActive: false },
        //   { text: 'Contacts', isActive: false },
          { text: i18n.tc('wallet.index.security'), name: 'security', isActive: false },
      ]
   
  }),
  methods: {
    handleTabClick(index) {
        this.navList.forEach((e, i) => {
            if(i == index){
                e.isActive = true
            } else {
                e.isActive = false
            }
        });
        if(this.$route.path.indexOf(this.navList[index].name) != -1){
            return;
        }
        this.$router.push('./'+ this.navList[index].name.toLowerCase());
    }
  },
}
</script>
