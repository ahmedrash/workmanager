<template>
  <v-list-item @click="logoutUser">
    <v-list-item-icon>
      <v-icon small>ri-lock-line</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>Logout</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  methods:{
    logoutUser(){
      this.$store.commit('localStorage/SET_AUTHUSER', [])
      this.$store.commit('localStorage/SET_FETCHED', false)
      this.$router.push('/login')
      // localStorage.setItem('userlist', JSON.stringify([]))
    }
  }
}
</script>

<style>
</style>
