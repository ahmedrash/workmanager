<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card
        class="mx-auto"
        >
        <Avatar
        v-if="getImg(authUser) == ''"
        :username="!authUser.name?'Admin':authUser.name"
        :customStyle="{height: '200px', width: '100%','font-size': '36px'}"
        :rounded="false"
        ></Avatar>
        <v-img :src="getImg(authUser)" aspect-ratio="1.7" v-if="getImg(authUser) != ''"></v-img>
        <v-card-title style="position:relative;">
          {{authUser.name}}

          <v-btn
            fab
            top
            right
            absolute
            @click="dialog = !dialog"
            style="right:80px;"
          >
            <v-icon>ri-camera-line</v-icon>
          </v-btn>

          <v-btn
            fab
            top
            right
            absolute
            v-on="on"
            @click="editItem"
          >
            <v-icon>ri-pencil-line</v-icon>
          </v-btn>

        </v-card-title>

        <v-card-text>
          <v-list dense>
            <v-list-item-group color="primary">


              

              <v-list-item title="ID">
                <v-list-item-icon>
                  <v-icon small>ri-profile-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="authUser.slno"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item title="Username">
                <v-list-item-icon>
                  <v-icon small>ri-account-circle-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="authUser.user"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item title="Address">
                <v-list-item-icon>
                  <v-icon small>ri-map-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="authUser.address"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :href="'tel:'+authUser.phone" title="Phone">
                <v-list-item-icon>
                  <v-icon small>ri-phone-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{authUser.phone | phone}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :href="'mailto:'+authUser.email" exact title="Email">
                <v-list-item-icon>
                  <v-icon small>ri-at-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="authUser.email"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>

            </v-list-item-group>
          </v-list>
        </v-card-text>


    <v-dialog v-model="dialog" max-width="500px" persistent>
          <v-card :loading="uploadWait">
            <v-card-title>
              <span class="headline">Set profile picture</span>
            </v-card-title>
            <v-card-subtitle class="pb-0 text-center red--text">{{uploadError}}</v-card-subtitle>
            <v-card-text>
              <v-file-input type="file" id="file" v-model="file" small-chips show-size label="Profile image" prepend-icon="ri-image-line" accept="image/*"></v-file-input>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn text color="primary" @click="uploadImage">Upload</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog1" max-width="500px" persistent>
          <v-card :loading="registrationWait">
            <v-card-title>
              <span class="headline">Edit Info</span>
            </v-card-title>
            <v-card-subtitle class="pb-0 text-center red--text">{{registrationError}}</v-card-subtitle>
            <v-card-text>
              <v-text-field v-model="editedItem.slno" label="ID"></v-text-field>
              <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
              <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
              <v-text-field v-model="editedItem.user" label="Username"></v-text-field>
              <v-text-field v-model="password" label="Password" type="password"></v-text-field>
              <v-text-field
                v-model="editedItem.address"
                :auto-grow="true"
                label="Address"
              ></v-text-field>
              
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
               v-if="authUser.admintype != 'developer'"
              />
               <v-text-field v-model="editedItem.phone" label="Phone" v-if="authUser.admintype == 'developer'"></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close1">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-card>
</v-col>
<v-col></v-col>
</v-row>
</v-container>
</template>

<script>
import Avatar from 'vue-avatar'
import Vuex from 'vuex'
  export default {

    layout: 'menulayout',
    components:{
      Avatar
    },
    computed: {
      authUser(){
        console.log(this.$store.state.localStorage.authUser)
        return this.$store.state.localStorage.authUser
      }
    },
  data () {
      return {
        on: false,
        dialog: false,
        dialog1: false,
        file: [],
        uploadedImg:{},
        udata:{},
        uploadWait: false,
        uploadError: "",
        editedIndex: -1,
        editedItem: {
          slno: '',
          name: '',
          user: '',
          email: '',
          address:'',
          phone: ''
        },
        defaultItem: {
          slno: '',
          name: '',
          user: '',
          email: '',
          address:'',
          phone: ''
        },
        password:'',
        registrationWait: false,
        registrationError: "",
        phone_valid: null
      }
    },
    methods:{
      leftPad(number, targetLength) {
          let output = number + ''
          while (output.length < targetLength) {
              output = '0' + output
          }
          return output;
      },
      uploadImage({$axios}){
        this.registrationWait = true
        let formData = new FormData()
        let newname = this.renamefile(this.file)
        formData.append("files[0]", this.file, newname)
        //console.log(formData, this.file)
        //return
        if(this.authUser.profilepic.path != ''){
          this.$axios.$post(`/cockpit/removeAssets?token=${this.authUser.api_key}`,
            {
              assets:[
                {
                  _id: this.authUser.profilepic._id
                }
              ]
            }
            )
        }

        this.$axios.$post(`/cockpit/addAssets?token=${this.authUser.api_key}`,formData,{
          headers: {
                    'Content-Type': 'multipart/form-data'
                }
        })
        .then(response => {
          console.log(response.assets[0])
          this.uploadedImg = response.assets[0]
          let newauthUser = {...this.authUser}
          newauthUser.profilepic = this.uploadedImg
          this.udata = {
            _id: this.authUser._id,
            profilepic: this.uploadedImg
          }

          this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
            user: this.udata
          })
          .then(res => {
            this.registrationWait = true
            this.$store.commit('localStorage/SET_AUTHUSER', newauthUser)
            this.close()
          })
          //console.log(this.authUser)
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            this.uploadError = "Request canceled. Please try again later."
            console.log('Request canceled', error)
          } else {
            this.uploadError = "Unauthorised!! User could not updated."
            console.log('Error', error)
          }
        })
      },
      renamefile(file){
        let name = file.name.split('.')
        let newname = this.authUser._id+'.'+name[name.length - 1]
        return newname
      },
      deleteImage({$axios}, id){
        this.$axios.$post(`/cockpit/removeAssets?token=${this.authUser.api_key}`,
          {
            assets:[
              {
                _id: id
              }
            ]
          }
          )
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log('Request canceled', error)
          } else {
            console.log('Error', error)
          }
        })
      },
      savetoUser({$axios}){
        this.udata = {
          _id: this.authUser._id,
          profilepic: this.uploadedImg
        }

        this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
          user: this.udata
        })
        .then(response => {
          console.log(response)
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
      savetwofa(){
        if(this.authUser.phone == ''){
          alert('Please add a phone number to receive 2FA code.')
          return
        }
        this.udata = {
          _id: this.authUser._id,
          twofa: this.authUser.twofa
        }

        this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
          user: this.udata
        })
        .then(response => {
          console.log(response)
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
      savenotify(){
        this.udata = {
          _id: this.authUser._id,
          notify: this.authUser.notify
        }

        this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
          user: this.udata
        })
        .then(response => {
          console.log(response)
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
      close () {
        this.dialog = false
        this.uploadWait = false
        this.uploadError = ''
        this.file = []
      },
      getImg(item){
        if('profilepic' in item){
          if('path' in item.profilepic){
            if(item.profilepic.path != ''){
              let img = process.env.imagePath+''+item.profilepic.path
              return img
            }
            return ''
          }
          return ''
        }
        else{
          return ''
        }
      },
      editItem () {
       this.editedItem = Object.assign({}, this.authUser)
       this.dialog1 = true
     },
      save ({$axios}) {
        console.log(this.editedItem.phone)
        if(this.authUser.admintype != 'developer'){
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
       }


        this.registrationWait = true;

          if(this.editedItem.user != "" &&
          this.editedItem.name != "" &&
          this.editedItem.email != ""
        ){
          if(this.password == ""){
            this.udata = {
              _id: this.editedItem._id,
              slno: this.editedItem.slno,
              user: this.editedItem.user,
              name: this.editedItem.name,
              email : this.editedItem.email,
              address: this.editedItem.address,
              phone: this.editedItem.phone,
            }
          }else{
            this.udata = {
              _id: this.editedItem._id,
              slno: this.editedItem.slno,
              user: this.editedItem.user,
              name: this.editedItem.name,
              email : this.editedItem.email,
              password: this.password,
              address: this.editedItem.address,
              phone: this.editedItem.phone,
            }
          }
            this.$axios.$post(`/cockpit/saveUser?token=${this.authUser.api_key}`,{
              user: this.udata
            })
            .then(response => {
              this.registrationWait = false
              console.log(response)
              let userU = {...this.authUser}

              userU.slno = response.slno
              userU.user = response.user
              userU.name = response.name
              userU.email = response.email
              userU.phone = response.phone
              userU.address = response.address

              this.$store.commit('localStorage/SET_AUTHUSER', userU)
              this.close1()
            })
            .catch(error => {
              if (this.$axios.isCancel(error)) {
                this.registrationError = "Request canceled. Please try again later."
              } else {
                this.registrationError = "Unauthorised!! User could not updated."
              }
            })
          }


      },
      close1 () {
        this.dialog1 = false
        this.registrationWait = false
        this.registrationError = ''
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      onUpdatecontactphone (payload) {
        console.log(payload)
          this.phone_valid = payload
      },
    },
    head() {
      return{
        title: 'Account'
      }
    }


}
</script>

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
