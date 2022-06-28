<template>
  <v-container
  fluid
  style="height:100%;"
  >
  <v-row
  align-content="center"
  style="height:100%;"
  justify="center"
  >
  <v-col
  cols="12"
  md="4"
  >

<v-card
:loading="loginWait"
class="mx-auto"
max-width="400"
raised
tile
>


    <v-avatar tile width="200" height="auto" style="display:flex; margin:auto; padding-top:20px;" color="transparent">
      <v-img
        class="ml-0"
        src="/Asset 2@300x.png"
        max-height="80"
        contain
        
      ></v-img>
    </v-avatar>
<v-card-subtitle class="pb-0 text-center title">Login</v-card-subtitle>

<v-card-subtitle class="pb-0 text-center red--text">{{loginError}}</v-card-subtitle>
<v-card-text class="text--primary"
>
  <form>
    <v-text-field
    v-model="username"
    :error-messages="usernameErrors"
    label="Username"
    required
    @input="$v.username.$touch()"
    @blur="$v.username.$touch()"
    @keyup.enter="submit"
    ></v-text-field>
    <v-text-field
    v-model="password"
    :error-messages="passwordErrors"
    label="Password"
    required
    type="password"
    @input="$v.password.$touch()"
    @blur="$v.password.$touch()"
    @keyup.enter="submit"
    ></v-text-field>

    <v-row
    >
    <v-col
    cols="12"
    class="d-flex justify-space-between align-center mt-5"
    >
    <v-btn class="px-12" @click="submit" color="primary">Login</v-btn>

    <!-- <v-btn
    color="error"
    text
    small
    to="/forgotpassword"
    >
    Forgot password?
    </v-btn> -->

  </v-col>
  </v-row>
  </form>
</v-card-text>


</v-card>
</v-col>
</v-row>
</v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Vuex from 'vuex'
export default {
  layout: 'login',
  mode: 'history',
  mixins: [validationMixin],

  validations: {
    username: { required },
    password: { required }
  },

  data: () => ({
    username: '',
    password: '',
    loginWait: false,
    loginError: "",
  }),

  computed: {
    usernameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('Username is required.')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required')
      return errors
    },
    authUser(){
      let user = this.$store.state.localStorage.authUser
      if (this.$store.state.localStorage.authState) {
        this.$router.push('/')
      }
      return user
    }
  },
  mounted(){
      this.startListeners();
    },
  methods: {
        // FCM NOTIFICATION FUNCTION
        async startListeners() {
          let token = await this.$fire.messaging.getToken();
          if (token) {
            // save token to cookie if it not exists in cookie
            if (!this.$cookies.get('fcmToken')) {
              this.$cookies.set('fcmToken', token, {
                expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365))
              })
            }
          }
          this.requestPermission();
          this.listenersStarted = true;
        },
    
        async requestPermission() {
          try {
            let permission = await Notification.requestPermission();
            if (permission === 'granted') {
              console.log('Notification permission granted.');
              this.$cookies.remove('fcmToken');
            }
          } catch (e) {
            console.error("Error : ", e);
          }
        },
    submit ({$axios}) {
      this.$v.$touch()
      if(this.username != "" && this.password != ""){
        this.loginWait = true;
        this.$axios.$post(`/cockpit/authUser?token=${process.env.aKey}`,{
        // this.$axios.$post(`/public/auth`,{
          user: this.username,
          password: this.password
        })
        .then(response => {
          let user = response
          console.log('loguser:',response)
          this.$axios.$post(`/cockpit/listUsers?token=${process.env.aKey}`,{
            filter:{
              _id: response._id
            }
          })
          .then(res => {
            //console.log('loguserinfo:',res)
            let tusr = res[0]

            if(tusr.profilepic){
              user.profilepic = tusr.profilepic
            }
            else{
              user.profilepic = {path:''}
            }

            if(tusr.address){
              user.address = tusr.address
            }
            else{
              user.address = ''
            }

            if(tusr.phone){
              user.phone = tusr.phone
            }
            else{
              user.phone = ''
            }

            if(tusr.slno){
              user.slno = tusr.slno
            }
            else{
              user.slno = ''
            }

            if(tusr.shorthand){
              user.shorthand = tusr.shorthand
            }
            else{
              user.shorthand = ''
            }


            this.$store.commit('localStorage/SET_AUTHUSER', user)
            this.$store.commit('localStorage/SET_FETCHED', true)
            this.$router.push('/')

          })
        })
        .catch(error => {
          this.loginWait = false
          if (this.$axios.isCancel(error)) {
            this.loginError = "Request canceled. Please try again later."
            // console.log('Request canceled', error)
            this.clear()
          } else {
            this.loginError = "Unauthorized!! Invalid username and/or password."
            // console.log('Error', error)
            this.clear()
          }
        })
      }

    },
    clear () {
      this.$v.$reset()
      this.username = ''
      this.password = ''
    }
  },

  watch: {
    authUser (val) {
      let user = this.$store.state.localStorage.authUser
      if (this.$store.state.localStorage.authState) {
        this.$router.push('/')
      }
    },
  },
  head() {
    return{
      title: 'Login'
    }
  }
}
</script>

<style>
</style>
