<template>
  <div class="d-flex align-center justify-end bottom mx-auto pt-1" style="max-width: 1200px;">
    <v-hover v-for="(item, index) in list" :key="index" v-slot:default="{ hover }">
      <v-btn @click="handleListClick(index)" text>
        <span :class="hover? 'primary--text':'gray--text'">{{item}}</span>
      </v-btn>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'Bottom',
  data: () => ({
      list: ['Term of Service', 'Callchain', 'English', '中文']
  }),
  methods: {
    handleListClick(i) {
      switch(i) {
        case 0:
          this.$router.push('./service');
          break;
        case 1:
          window.open("http://callchain.live");
          break;
        case 2:
          this.$i18n.locale = 'en_US';
          break;
        case 3:
          this.$i18n.locale = 'zh_CN';
          break;
      }

    }
  }
}
</script>
