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
import i18n from '../../../plugins/i18n'

export default {
  name: 'advanced',
  data: () => ({
      navList: [
        //   { text: 'Issue', isActive: true },
          { text: i18n.tc('advanced.index.trust'), name: 'trust', isActive: true },
          { text: i18n.tc('advanced.index.options'), name: 'options', isActive: false },
      ]
   
  }),
  methods: {
    handleTabClick(index) {
        this.navList.forEach((e, i) => {
          e.isActive = (i === index);
        });
        if(this.$route.path.indexOf(this.navList[index].name.toLowerCase()) != -1){
            return;
        }
        this.$router.push('./'+ this.navList[index].name.toLowerCase());
    }
  },
}
</script>
