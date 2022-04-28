<template>
  <v-container>
    <client-only>
    <v-alert
      border="top"
      dark
      v-if="userroles('admins', 'none', null, 'page') || !userroles('admins', 'full', null, 'page')"
      max-width="700px"
      class="mx-auto text-center"
      type="error"
    >
      You don't have access to this page. Please contact administrator for permission.
    </v-alert>

    <v-row v-if="!userroles('admins', 'none', null, 'page') || userroles('admins', 'full', null, 'page')">
      <v-col>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="userlist"
            :single-select="singleSelect"
            item-key="name"
            :search="search"
            class="misc_table"
            :items-per-page="50"
          >
            <template v-slot:top>

              <v-toolbar flat color="white">
                <v-text-field
                  v-model="search"
                  append-icon="ri-search-line"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px" persistent>

                  <template v-slot:activator="{ on }">
                    <client-only>
                      <v-btn small class="mb-2" v-on="on" v-if="authUser.group == 'admin' && userroles('admins', 'partial', 'add', 'item')">
                        <v-icon left>ri-account-circle-line</v-icon>
                        New Admin
                      </v-btn>
                    </client-only>
                  </template>

                  <v-card :loading="registrationWait">
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-subtitle class="pb-0 text-center red--text">{{registrationError}}</v-card-subtitle>
                    <v-card-text>
                      <v-select
                        v-model="editedItem.admintype"
                        :items="[{name: 'Developer', value: 'developer'},{name: 'Super Admin', value: 'super'},{name: 'Admin', value: 'admin'}]"
                        item-text="name"
                        item-value="value"
                        label="User Type"
                      ></v-select>
                      <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                      <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                      <v-text-field v-model="editedItem.user" label="Username"></v-text-field>
                      <v-text-field v-model="password" label="Password" type="password"></v-text-field>

                      <!-- <v-file-input v-model="editedItem.profilepic" small-chips show-size label="Profile image" prepend-icon="ri-image-line" accept="image/*"></v-file-input> -->
                      <v-text-field
                        v-model="editedItem.address"
                        :auto-grow="true"
                        label="Address"
                      ></v-text-field>
                      <!-- <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field> -->
                      <!-- <VuePhoneNumberInput
                      v-model="editedItem.phone"
                      default-country-code="US"
                      no-country-selector
                      :border-radius="0"
                      color="#646464"
                      no-country-selector
                      error-color="#ff5252"
                      valid-color="#4caf50"
                      @update="onUpdatecontactphone"
                      :translations="{
                        phoneNumberLabel: 'Phone'
                      }"
                       /> -->
                       <MazPhoneNumberInput
                       v-model="editedItem.phone"
                       :default-phone-number="editedItem.phone"
                       default-country-code="BD"
                       no-country-selector
                       :border-radius="0"
                       color="#646464"
                       error-color="#ff5252"
                       valid-color="#4caf50"
                       @update="onUpdatecontactphone"
                       :translations="{
                         phoneNumberLabel: 'Phone'
                       }"
                      />
                      <v-switch v-model="editedItem.active" :disabled="authUser._id == editedItem._id" class="mx-2" label="Status"></v-switch>
                      <!-- <v-switch v-model="editedItem.twofa" :disabled="authUser._id == editedItem._id" class="mx-2" label="2FA"></v-switch> -->
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>

            <template v-slot:[`item.image`]="{ item }">
              <client-only>
                <ProfileAvatar :size="36" :item="item"/>
              </client-only>
            </template>

            <template v-slot:[`item.admintype`]="{ item }">
              <span class="text-capitalize">{{item.admintype=='super'?'super admin':item.admintype }}</span>
            </template>

            <template v-slot:[`item.active`]="{ item }">
              <span v-if="item.active == true">Active</span>
              <span v-if="item.active == false">Inactive</span>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <client-only>
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
                 v-if="item.admintype != 'super' && authUser.group == 'admin' && userroles('admins', 'partial', 'edit', 'item')"
              >
                ri-pencil-line
              </v-icon>

              <v-icon
                small
                class="mr-2"
                @click="editroles(item)"
                v-if="item.admintype != 'super' || authUser.group == 'admin'"
              >
                ri-shield-keyhole-line
              </v-icon>

              <v-icon
                small
                class="mr-2"
                @click="deleteItem(item)"
                 v-if="item.admintype != 'super' && authUser.group == 'admin' && userroles('admins', 'partial', 'edit', 'item')"
              >
                ri-delete-bin-line
              </v-icon>

            </client-only>
              
            </template>
          </v-data-table>
      </v-col>
    </v-row>

  </client-only>

    <v-dialog v-model="roledialog" max-width="800px" persistent>

      <v-card class="pa-0 ma-0">
        <v-card-text class="pa-0 ma-0">
          <v-container >
            <v-row>
              <v-col cols="4" class="pl-0 py-0">
                <v-sheet
                  tile
                  color="grey darken-3"
                >
                  <v-list dense dark color="grey darken-3">
                    <v-list-item-group
                      color="blue-grey lighten-3"
                    >
                      <v-list-item
                        v-for="(item, i) in roleitemsedit.role_list"
                        :key="i"
                        @click="changerolelvl1(item)"
                      >
                        <v-list-item-icon>
                          <v-icon v-text="item.icon" small></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-sheet>
              </v-col>

              <v-col cols="8" class="pr-6">
                <v-row class="d-flex flex-row justify-space-between fill-height">
                  <v-col cols="12" class="align-self-start">
                    <v-row>
                      <v-col cols="6" class="py-0">
                        <v-list dense>
                          <v-subheader>{{rolelvl1.text}}</v-subheader>
                          <v-list-item-group
                            color="primary"
                          >
                            <v-list-item
                              v-for="(item, i) in rolelvl1.subitems"
                              :key="'role1_'+i"
                              @click="changerolelvl2(item)"
                            >
                            <template v-slot:default="{ active }">
                              <v-list-item-action>
                                <v-checkbox :input-value="active" v-model="item.status" dense></v-checkbox>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-list-item-title v-text="item.text"></v-list-item-title>
                              </v-list-item-content>
                            </template>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-col>

                      <v-col cols="6" class="py-0">
                        <v-list dense v-if="rolelvl2.view">
                          <v-subheader>Partials</v-subheader>
                          <v-list-item-group
                            color="primary"
                          >
                            <v-list-item
                              v-for="(item, i) in rolelvl2.view"
                              :key="'role_'+i"
                              @click="changerolelvl3(item)"
                            >
                            <template v-slot:default="{ active }">
                              <v-list-item-action>
                                <v-checkbox :input-value="active" v-model="item.status" dense></v-checkbox>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-list-item-title v-text="item.text"></v-list-item-title>
                              </v-list-item-content>
                            </template>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-col>


                  <v-col cols="12" class="d-flex align-self-end">
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closerole()">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saverole()">Save</v-btn>
                  </v-col>
                </v-row>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>


      </v-card>
    </v-dialog>
  </v-container>

</template>

<script>
import Avatar from 'vue-avatar'
import ProfileAvatar from '~/components/profilepicture.vue'
  export default {

    layout: 'default',
    components:{
      Avatar,
      ProfileAvatar
    },
    data () {
      return {
        dr: true,
        search: '',
        dialog: false,
        roledialog: false,
        selectedItem: '',
        selectedItem1: '',
        rolelvl1: [],
        rolelvl2: [],
        roleitemsedit: {
          role_list: []
        },
        roleitems: [],
        singleSelect: false,
        selected: [],
        headers: [
          { text: 'Image', value: 'image',sortable: false, },
          { text: 'Name', value: 'name'},
          { text: 'Username', value: 'user'},
          { text: 'Email', value: 'email' },
          { text: 'Group', value: 'admintype' },
          { text: 'Staus', value: 'active' },
          { text: 'Actions', value: 'action', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
          name: '',
          user: '',
          email: '',
          group: 'admin',
          admintype: '',
          address:'',
          phone:'',
          active: false,
          role_list: {},
          twofa: false
        },
        defaultItem: {
          name: '',
          user: '',
          email: '',
          group: 'admin',
          admintype: '',
          address:'',
          phone:'',
          active: false,
          role_list: {},
          twofa: false
        },
        items: ['admin', 'user', 'salesman'],
        password:'',
        udata: {},
        registrationWait: false,
        registrationError: "",
        phone_valid: null
      }
    },
    async asyncData ({ $axios }) {
      const { data } = await $axios.post(`/cockpit/listUsers?token=${process.env.aKey}`,{
        filter: {
          $or: [
               {admintype: 'admin'},
               {admintype: 'super'}
             ]
        }
      })
      // console.log("UserData: ", data)
      return { userlist: data, tempuserlist: data }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New user' : 'Edit user'
      },
      authUser(){
        return this.$store.state.localStorage.authUser
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      authUser (val) {
        this.authUser = val
      }
    },
    mounted() {
      this.getRoles()
      this.$store.commit('localStorage/SET_TITLE', this.$metaInfo.title)
    },
    methods: {
      async getRoles(){
        try {
        this.$axios.$post(`/collections/get/roles?token=${process.env.colKey}`)
          .then((res) => {
            this.roleitems = res.entries
          });
      } catch (error) {
        console.log("error", error);
      }
      },
      userroles(lvl1=null, lvl2=null, lvl3=null, df=null){
        return this.$roles(lvl1, lvl2, lvl3, df, this.authUser)
      },
      editItem (item) {
        console.log(item)
       this.editedIndex = this.userlist.indexOf(item)
       this.editedItem = Object.assign({}, item)
       this.dialog = true
     },
    getItems(){
      this.$axios.$post(`/cockpit/listUsers?token=${process.env.aKey}`,{
        filter: {
          $or: [
               {admintype: 'admin'},
               {admintype: 'super'}
             ]
        }
      })
      .then(res => {
          this.userlist = res.entries
          this.loading = false
          })
    },
     deleteItem (item) {
       this.$axios.$post(`/getuserconnections?token=${this.authUser.api_key}`,{
          user: item._id
        })
        .then(res => {
          console.log(res)
          if(res.customer_count > 0 && res.job_count > 0){
            confirm('This user has '+res.customer_count+' customers and '+res.job_count+' jobs accross 4 tenents. Please assign new salesman, admin should not have customer and jobs.')
          }
          else{
            confirm('Are you sure you want to delete this user account?') && this.$axios.$post(`/removeuser?token=${this.authUser.api_key}`,{
             user: item._id
           })
           .then(response => {
             console.log(response)
             this.getItems()
           })
           .catch(error => {
             console.log(error)
             if (this.$axios.isCancel(error)) {
               console.log('Request canceled', error)
             } else {
               console.log('Error', error)
             }
           })
          }

          })
     },

     close () {
       this.dialog = false
       this.registrationWait = false
       this.registrationError = ''
       setTimeout(() => {
         this.editedItem = Object.assign({}, this.defaultItem)
         this.editedIndex = -1
       }, 300)
     },

     getInitials(string) {
        let names = string.split(' ')
        let initials = names[0].substring(0, 1).toUpperCase()

        if (names.length > 1) {
            initials += names[1].substring(0, 1).toUpperCase()
        }

        return initials
      },

     save ({$axios}) {

       if(this.phone_valid != null && this.phone_valid.isValid == false){
         alert("Contact Phone number is not valid.")
         return
       }
       else{
         if(this.editedItem.phone != '' && this.editedItem.phone != undefined){
           this.editedItem.phone = this.phone_valid.e164
         }
         else{
           this.editedItem.phone = ''
         }
       }

       console.log(this.editedItem.phone, this.editedItem.twofa)
       if(this.editedItem.phone == '' && this.editedItem.twofa == true){
         alert('Please add a phone number to send 2FA code.')
         this.editedItem.twofa = false
         return
       }

       this.registrationWait = true;
       if (this.editedIndex > -1) {

         if(this.editedItem.user != "" &&
         this.editedItem.name != "" &&
         this.editedItem.email != ""
       ){
         if(this.password == ""){
           this.udata = {
             _id: this.editedItem._id,
             user: this.editedItem.user,
             name: this.editedItem.name,
             email : this.editedItem.email,
             active: this.editedItem.active,
             group: 'admin',
             admintype: this.editedItem.admintype,
             address: this.editedItem.address,
             phone: this.editedItem.phone
            //  twofa: this.editedItem.twofa
           }
         }else{
           this.udata = {
             _id: this.editedItem._id,
             user: this.editedItem.user,
             name: this.editedItem.name,
             email : this.editedItem.email,
             password: this.password,
             active: this.editedItem.active,
             group: 'admin',
             admintype: this.editedItem.admintype,
             phone: this.editedItem.phone
            //  twofa: this.editedItem.twofa
           }
         }
           this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
             user: this.udata
           })
           .then(response => {
             this.registrationWait = false
             console.log(response)
             Object.assign(this.userlist[this.editedIndex], this.editedItem)
             this.close()
           })
           .catch(error => {
             console.log(error)
             if (this.$axios.isCancel(error)) {
               this.registrationError = "Request canceled. Please try again later."
               console.log('Request canceled', error)
             } else {
               this.registrationError = "Unauthorised!! User could not updated."
               console.log('Error', error)
             }
           })
         }
       } else {
         if(this.editedItem.user != "" &&
         this.editedItem.name != "" &&
         this.editedItem.email != "" &&
         this.password != ""
       ){
          let maxsl = Math.max.apply(Math, this.userlist.map(function(o) { return o.slno }))
           this.udata = {
             user: this.editedItem.user,
             name: this.editedItem.name,
             email : this.editedItem.email,
             password: this.password,
             active: this.editedItem.active,
             group: 'admin',
             admintype: this.editedItem.admintype,
             address: this.editedItem.address,
             phone: this.editedItem.phone,
             shorthand: this.getInitials(this.editedItem.name),
             slno: maxsl+1,
             "api_key": true
            //  twofa: this.editedItem.twofa
           }

           this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
             user: this.udata
           })
           .then(response => {
             this.registrationWait = false
             console.log(response)
             this.userlist.push(this.editedItem)
             this.close()
           })
           .catch(error => {
             console.log(error)
             if (this.$axios.isCancel(error)) {
               this.registrationError = "Request canceled. Please try again later."
               console.log('Request canceled', error)
             } else {
               this.registrationError = "Unauthorised!! User could not updated."
               console.log('Error', error)
             }
           })
         }

       }

     },
     getImg(item){
       if(item.profilepic.path != ''){
         let img = process.env.imagePath+''+item.profilepic.path
         return img
       }
       else{
         return ''
       }
     },
     closerole () {
       this.roledialog = false
       this.roleitemsedit.role_list = {...this.roleitems}
       this.rolelvl1 = []
       this.rolelvl2 = []
       console.log(this.roleitemsedit.role_list)
     },
     saverole(){

      


       this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
         user: this.roleitemsedit
       })
       .then(response => {
         this.closerole()
       })
       .catch(error => {
         console.log(error)
         if (this.$axios.isCancel(error)) {
           console.log('Request canceled', error)
         } else {
           console.log('Error', error)
         }
       })
     },
     editroles(item){
       if(item.role_list == undefined){
         console.log(item)
         item.role_list = {...this.roleitems}
       }

       this.roleitemsedit = {...item}
       this.roledialog = true
     },
     changerolelvl1(item){
       console.log(item)
       item.status = item.status?false: true
       this.rolelvl1 = item

       let rolelvl2 = item.subitems.filter(e=>{
         return e.id == 'partial' && e.status == true
       })

       if(rolelvl2.length > 0){
         this.rolelvl2 = rolelvl2[0]
       }
       else{
         this.rolelvl2 = []
       }

     },
     changerolelvl2(item){
       console.log(item)
       this.rolelvl1.subitems.map(e=>{
         if(e.id != item.id){
           e.status = false
         }
       })

       item.status = item.status?false: true

       if(item.status == true){
         this.rolelvl2 = item
       }
       else{
         this.rolelvl2 = []
       }

     },
     changerolelvl3(item){
       console.log(item)
       item.status = item.status?false: true
     },
     onUpdatecontactphone (payload) {
       console.log(payload)
         this.phone_valid = payload
     },
    },
    head() {
      return{
        title: 'Admins'
      }
    }
  }
</script>

<style>
.misc_table .v-data-table table th:last-child{
  text-align: center !important;
}

.misc_table .v-data-table table th{
  text-align: left !important;
}
.misc_table .v-data-table table th:last-child{
  width:100px !important;
}


.input-tel__input.no-country-selector{
  border-left:0px !important;
  border-top:0px !important;
  border-right:0px !important;
  outline: none !important;
  margin-top:9px;
  caret-color: unset !important;
  box-shadow: unset !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  border-color: #949494;
}

.maz-border-color{
  border-color: #949494 !important;
}

.maz-border-radius{
  border-radius: 0px !important;
}

.maz-border{
  border-width: 0px 0px 1px 0px !important;
  background-color: transparent !important;
}
.maz-input__input{
  padding-left: 0px !important;
  padding-right: 0px !important;
  font-size: 14px !important;
}
</style>
