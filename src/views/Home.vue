<template>
  <v-app>
    <v-header></v-header>
    
    <div style="min-height: calc(100vh - 100px); padding-top: 20px; padding-bottom: 30px; background-color: #f9f9f9;">
      <router-view />
      <v-bottom></v-bottom>
    </div> 
    
  </v-app>
</template>

<script>
import vHeader from '../components/Header'
import vBottom from '../components/Bottom'

export default {
  name: 'App',

  components: {
    vHeader,
    vBottom,
  },

  data: () => ({
    //
  })
}
</script>
