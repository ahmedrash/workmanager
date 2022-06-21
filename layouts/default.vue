<template>
  <v-app dark>
    <client-only>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      fixed
      app
    >
    
    <v-list-item class="px-2">
        <v-list-item-avatar color="transparent" tile>
          <v-img src="/Asset 2@300x.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-title class="font-weight-bold">WorkManager</v-list-item-title>

        <!-- <v-btn
          icon
          @click.stop="miniVariant = !miniVariant"
        >
          <v-icon small>ri-menu-fold-line</v-icon>
        </v-btn> -->
      </v-list-item>

      <v-divider></v-divider>
      
      <v-list class="side_menu">
        <div v-for="(item, i) in items" :key="i">
          <v-list-item
          :to="item.to"
          router
          exact
          v-if="!item.admin || authUser.group == 'admin'"
        >
          <v-list-item-action>
            <v-icon small>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        </div>
        

        <!-- <v-list-item @click="test()">
          <v-list-item-content>
            <v-list-item-title>Test</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->

        <v-divider></v-divider>
    </v-list>
      

    <ClientList/>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
      :elevation="0"
      outlined
      height="57"
    >

    <Avatar
      :username="title"
      :size="36"
      class="mr-3"
      color="#fff"
      rounded
      ></Avatar>

      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" v-if="miniVariant"><v-icon small>ri-menu-unfold-line</v-icon></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold" small>{{title}}</v-toolbar-title>
<v-spacer />
<v-btn
  elevation="0"
  class="mr-2"
  small
  @click="gototaskstatepage('')"
  v-if="shouldshow()"
>
<v-icon x-small color="grey" class="mr-1">ri-checkbox-blank-fill</v-icon>
To Do
</v-btn>
      <v-btn
  elevation="0"
  class="mr-2"
  small
  @click="gototaskstatepage('c')"
  v-if="shouldshow()"
>
<v-icon x-small color="success" class="mr-1">ri-checkbox-blank-fill</v-icon>
Completed
</v-btn>

<v-btn
  elevation="0"
  class="mr-2"
  small
  @click="gototaskstatepage('r')"
  v-if="shouldshow()"
>
<v-icon x-small color="error" class="mr-1">ri-checkbox-blank-fill</v-icon>
Rejected
</v-btn>
      <v-spacer />
      <v-menu
      v-model="menu"
      :close-on-content-click="true"
      :nudge-width="150"
      offset-x
      transition="slide-x-transition"
      :close-on-click="true"
      :internal-activator="true"
      >
      <template v-slot:activator="{ on }">
        <v-btn
        v-on="on"
        icon
        class="p-0 mr-0"
        height="36"
        width="36"
        tile
        >
        <client-only>
          <ProfileAvatar :size="36"  :item="authUser"/>
        </client-only>
      </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <client-only>
              <ProfileAvatar :size="36" class="mr-2" :item="authUser"/>
            </client-only>

            <v-list-item-content>
              <v-list-item-title>{{authUser.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item-group color="primary">
            <v-list-item to="/account">
              <v-list-item-icon>
                <v-icon small>ri-account-circle-line</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Account</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <Logout :clicked="menu=false"/>
          </v-list-item-group>
        </v-list>
      </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} Dynamicflow</span>
    </v-footer>
    </client-only>
  </v-app>
</template>

<script>
import Avatar from 'vue-avatar'
import { BroadcastChannel } from 'broadcast-channel';
import Logout from '~/components/logout.vue'
import ProfileAvatar from '~/components/profilepicture.vue'
import ClientList from '~/components/clientslist.vue'

export default {
  components:{
    Logout,
    ProfileAvatar,
    ClientList,
    Avatar
  },
  name: 'DefaultLayout',
  data () {
    return {
      listenersStarted: false,
      idToken: "",
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'ri-dashboard-line',
          title: 'Dashboard',
          to: '/',
          admin: false
        },
        {
          icon: 'ri-admin-line',
          title: 'Admins',
          to: '/admins',
          admin: true
        },
        {
          icon: 'ri-team-line',
          title: 'Employee',
          to: '/employee',
          admin: true
        }
      ],
      miniVariant: false,
      msg: '',
      menu: '',
      drawerright: false
    }
  },
  computed: {
   title(){
     return this.$store.state.localStorage.title
   },
   authUser(){
      if (!this.$store.state.localStorage.authState) {
        this.$router.push('/login')
      }
      return this.$store.state.localStorage.authUser
    }
  },
  watch: {
    authUser (val) {
      if (!this.$store.state.localStorage.authState) {
        this.$router.push('/login')
      }

      if (this.$store.state.localStorage.authUser.api_key === undefined && this.$store.state.localStorage.authState) {
        this.$store.commit('localStorage/SET_AUTHUSER', [])
        this.$store.commit('localStorage/SET_FETCHED', false)
        this.$router.push('/login')
      }
    },
  },
  mounted(){
      this.testfunc()
      // this.startListeners();
      const channel = new BroadcastChannel('actions');
      channel.onmessage = msg => {
        if(msg.action == 'reload'){
          
        }
      };
    },
  methods:{
        // FCM NOTIFICATION FUNCTIONS
        // async startListeners() {
        //   await this.requestPermission();
        //   this.listenersStarted = true;
        // },
        // async requestPermission() {
        //   try {
        //     let permission = await Notification.requestPermission();
        //     if (permission === 'granted') {
        //       let token = await this.$fire.messaging.getToken();
        //       if (token) {
        //         console.log(token);
        //       }
        //     }
        //   } catch (e) {
        //     console.error("Error : ", e);
        //   }
        // },
        // test(){
        //   const channel = new BroadcastChannel('actions');
        //   channel.postMessage('I am not alone');
        //   this.$axios.$post(`/test?token=${process.env.cKey}`)
        // }
        async testfunc(){
          const [ result1, result2 ] = await this.$onIdleQueue([
            () => {
                //console.log('Im the first in queue')
                return 'result of the first callback'
            },
            () => {
                //console.log('Im the second in queue')
                return 'result of the second callback'
            }
        ])
        },
        gototaskstatepage(state){
          let path = this.$nuxt.$route.path.split('/')
          

          let newpath = ''
          if(state == ''){
            newpath = '/'+path[1]+'/'+path[path.length - 1]
          }
          else{
             newpath = '/'+path[1]+'/'+state+'/'+path[path.length - 1]
          }

          console.log(newpath)
          this.$router.push(newpath)
        },
        shouldshow(){
          let path = this.$nuxt.$route.path.split('/')
          if(path[1] == 'clients' || path[1] == 'projects'){
            return true
          }
          else{
            return false
          }
        }
  }
}
</script>

<style scoped>

.v-list-item-title{
  font-size: 12px;
}

.v-toolbar__title{
  font-size: 16px;
}
</style>
