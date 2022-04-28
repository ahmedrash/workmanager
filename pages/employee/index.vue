<template>
  <v-container fluid>
  
    <client-only>
    <v-alert
      border="top"
      dark
      v-if="userroles('employee', 'none', null, 'page') || !userroles('employee', 'full', null, 'page')"
      max-width="700px"
      class="mx-auto text-center"
      type="error"
    >
      You don't have access to this page. Please contact administrator for permission.
    </v-alert>

    <v-card
    v-if="!userroles('employee', 'none', null, 'page') || userroles('employee', 'full', null, 'page')"
  :elevation="0"
    >
      <v-card-title>
        <h3 class="font-weight-light">Employee</h3>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="ri-search-line"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-row style="max-width:150px;" class="mr-2">
          <v-col>
            <v-select
            :items="filteritems"
            dense
            v-model="sfilteritem"
            @input="secsearch()"
            ></v-select>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="500px" persistent>

          <template v-slot:activator="{ on }">
            <client-only>
              <v-btn small class="mb-2" v-on="on" v-if="authUser.group == 'admin' && userroles('employee', 'partial', 'add', 'item')">
                <v-icon left small>ri-account-circle-line</v-icon>
                New Employee
              </v-btn>
            </client-only>
          </template>

          <v-card :loading="registrationWait">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-subtitle class="pb-0 text-center red--text">{{registrationError}}</v-card-subtitle>
            <v-card-text>
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
              <!-- <VuePhoneNumberInput
              v-model="editedItem.phone"
              default-country-code="US"
              no-country-selector
              :border-radius="0"
              color="#646464"
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
              <v-btn color="blue darken-1" text :disabled="loading" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-card-text>
        <v-data-table
            v-model="selected"
            :headers="computedHeaders"
            :items="userlist"
            :single-select="singleSelect"
            item-key="name"
            :search="search"
            class="misc_table"
            :items-per-page="37"
          >


            <template v-slot:[`item.image`]="{ item }">
              <client-only>
                <ProfileAvatar :size="36" :item="item"/>
              </client-only>
            </template>

            <template v-slot:[`item.group`]="{ item }">
              <span class="text-capitalize">{{item.group}}</span>
            </template>

            <template v-slot:[`item.phone`]="{ item }">
              <span class="text-capitalize">{{item.phone | phone}}</span>
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
                  v-if="authUser.group == 'admin' && userroles('employee', 'partial', 'edit', 'item')"
                >
                  ri-pencil-line
                </v-icon>
              </client-only>
              <v-icon
                small
                @click="deleteItem(item)"
                v-if="item.admintype != 'super' && authUser.group == 'admin' && userroles('admins', 'partial', 'edit', 'item')"
              >
                ri-delete-bin-line
              </v-icon>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </client-only>

  </v-container>

</template>

<script>
import Avatar from 'vue-avatar'
import ProfileAvatar from '~/components/profilepicture.vue'
  export default {

    layout: 'menulayout',
    components:{
      Avatar,
      ProfileAvatar,
    },
    data () {
      return {
        filteritems: ['All', 'Active', 'Inactive'],
        sfilteritem: "All",
        search: '',
        loading: false,
        dialog: false,
        singleSelect: false,
        selected: [],
        headers: [
          { text: 'Image', value: 'image',sortable: false, align: 'start' },
          { text: 'Name', value: 'name', align: 'start'},
          { text: 'Username', value: 'user', align: 'start'},
          { text: 'Email', value: 'email', align: 'start'},
          { text: 'Phone', value: 'phone', align: 'start'},
          { text: 'Staus', value: 'active', align: 'start'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
          name: '',
          user: '',
          email: '',
          group: 'employee',
          address:'',
          phone:'',
          active: false
          // twofa: false
        },
        defaultItem: {
          name: '',
          user: '',
          email: '',
          group: 'employee',
          address:'',
          phone:'',
          active: false
          // twofa: false
        },
        password:'',
        udata: {},
        registrationWait: false,
        registrationError: "",
        phone_valid: null
      }
    },
    async asyncData ({ $axios }) {
      const { data } = await $axios.post(`/cockpit/listUsers?token=${process.env.aKey}`,{
        filter: {group: 'employee'}
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
      },
      computedHeaders () {
        if(this.authUser.group == 'admin'){
          return this.headers
        }
        else{
          return this.headers.filter(header => header.text !== "Actions")
        }

      },
      
    },
  mounted(){
    this.$store.commit("localStorage/SET_TITLE", this.$metaInfo.title);
  },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods: {
      userroles(lvl1=null, lvl2=null, lvl3=null, df=null){
        return this.$roles(lvl1, lvl2, lvl3, df, this.authUser)
      },
      secsearch(){
        let status = this.sfilteritem == 'Active'? true: false

        if(this.sfilteritem == 'Active'){
          this.userlist = this.tempuserlist.filter(e=>{
            return e.active == true
          })
        }

        if(this.sfilteritem == 'Inactive'){
          this.userlist = this.tempuserlist.filter(e=>{
            return e.active == false
          })
        }

        if(this.sfilteritem == 'All'){
          this.userlist = this.tempuserlist
        }

      },
      editItem (item) {
        console.log(item)
       this.editedIndex = this.userlist.indexOf(item)
       this.editedItem = Object.assign({}, item)
       this.dialog = true
     },
    getItems(){
      this.$axios.$post(`/cockpit/listUsers?token=${process.env.aKey}`,{
        filter: {group: 'employee'}
      })
      .then(res => {
        // console.log(res)
          this.userlist = res
          this.loading = false
          })
    },
     deleteItem (item) {
       console.log(item)

       this.$axios.$post(`/getuserconnections?token=${this.authUser.api_key}`,{
          user: item._id
        })
        .then(res => {
          console.log(res)
          if(res.customer_count > 0 && res.job_count > 0){
            confirm('This user has '+res.customer_count+' customers and '+res.job_count+' jobs accross 4 tenents. Please assign new employee to these custome and jobs prior deleting.')
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

      getuserlist(){
        this.$axios.$post(`/cockpit/listUsers?token=${this.authUser.api_key}`,{
          filter: {group: 'employee'}
        })
        .then(res => {
          this.userlist = res
          })
      },

     save ({$axios}) {
      //  console.log(this.phone_valid)
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

       if(this.editedItem.phone == '' && this.editedItem.twofa == true){
         alert('Please add a phone number to send 2FA code.')
         this.editedItem.twofa = false
         return
       }
       this.registrationWait = true;
       this.loading = true

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
             group: 'employee',
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
             group: 'employee',
             phone: this.editedItem.phone
            //  twofa: this.editedItem.twofa
           }
         }
           this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
             user: this.udata
           })
           .then(response => {
             this.registrationWait = false
            //  console.log(response)
             Object.assign(this.userlist[this.editedIndex], this.editedItem)
             this.close()
             this.getItems()
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
             group: 'employee',
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
             this.getItems()
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

       this.loading = false

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
     onUpdatecontactphone (payload) {
         this.phone_valid = payload
     },
    },
    head(){
      return{
        title: 'Employee'
      }
    }
  }
</script>

<style scoped>
.misc_table .v-data-table table th{
  text-align: left !important;
}
.misc_table .v-data-table table th:last-child{
  text-align: left !important;
}

.misc_table .v-data-table table th{
  text-align: left !important;
}
.misc_table .v-data-table table th:last-child{
  width:100px !important;
}



</style>

<style>
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
