<template>
<div>
  <v-card
    class="mx-auto asset_item grid"
  >
    <v-img
        :src="getassetImg(asset.path, asset._id)"
        height="150px"
        contain
    ></v-img>

    <v-card-title class="text-subtitle-1">
      <span v-if="!edit" class="mr-auto">{{ asset.title }}</span>
      <input type="text" v-model="asset.title" class="edit_name text-center" v-if="edit">
    </v-card-title>

    <v-card-actions class="info_item my-0 ">
      <span class="mr-2">{{ hdate(asset.created) }} by </span> <ProfileAvatar :size="24" class="mr-2 d-inline" :item="getFileBy"/>
    </v-card-actions>

    <v-card-actions class="action_item my-0  justify-center">
      <v-btn icon small plain color="info" @click="viewfile(asset)"><v-icon small>ri-eye-line</v-icon></v-btn>
        <v-btn icon small plain color="success" v-if="authUser._id == asset.by && edit" @click="update(asset)"><v-icon small>ri-save-line</v-icon></v-btn>
        <v-btn icon small plain color="success" v-if="authUser._id == asset.by && !edit" @click="edit=!edit"><v-icon small>ri-pencil-line</v-icon></v-btn>
        <v-btn icon small plain color="success" :href="getassetURL(asset)" download target="_blank"><v-icon small>ri-download-2-line</v-icon></v-btn>
        <v-btn icon small plain color="error" v-if="authUser._id == asset.by" @click="deleteItem(asset)"><v-icon small>ri-delete-bin-line</v-icon></v-btn>
    </v-card-actions>

  </v-card>
  </div>
</template>

<script>
import ProfileAvatar from '~/components/profilepicture.vue'
import moment from 'moment'
export default {
    components:{
        ProfileAvatar
    },
  props: ["asset", "authUser", "userlist"],
  computed: {
    siteurl() {
      return process.env.apiUrl;
    },
    getFileBy() {
      let user = this.userlist.filter((el) => {
        return el._id == this.asset.by;
      })[0];
      console.log(user);
      return user;
    },
  },
  data(){
      return {
        edit: false,
        dialogviewer: false,
        notifications: false,
        sound: true,
        widgets: false,
        filepath: '#'
      }
  },
  methods:{
      viewfile(asset){
          this.$emit('viewfile', asset)
      },
      closeview(){
        this.dialogviewer = false
        this.filepath = '#'
      },
      getassetURL(asset){
          return `${process.env.imagePath}${asset.path}`
      },
      downloadfile(asset) {
      let url = `${process.env.imagePath}${asset.path}`
      this.$axios.$get(url)
        .then(response => {
            console.log(response)
        })
        
    },
       getassetImg(path, id){
            let filetype = path.split('.')
            let ext = filetype[filetype.length-1].toLowerCase()
            let fileurl = ''
            if(ext == 'png' || ext == 'jpeg' || ext == 'jpg'){
                fileurl = `${process.env.imagePath}${path}`
            }
            else{
                fileurl = '/svg/'+ext+'.svg'
            }
           return fileurl
       },
       deleteItem(asset){
            confirm('Are you sure you want to delete this asset?') && this.$axios.$post(`/cockpit/removeAssets?token=${this.authUser.api_key}`,
            {
              assets:[
                {
                  _id: asset._id
                }
              ]
            }
            )
            .then(res=>{
                this.$emit('deleteAsset', asset)
            })
       },
       update(asset){
           this.edit=!this.edit
           console.log(asset)

           this.$axios.$post(`/cockpit/updateAssets?token=${this.authUser.api_key}`,{
               asset: asset
           })
        .then(response => {
          this.$emit('updateAsset', asset)
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log('Request canceled', error)
          } else {
            console.log('Error', error)
          }
        })
       },
       hdate(date){
        return moment(date).fromNow()
        }
    }
};
</script>

<style>
.asset_item.grid:hover .action_item{
    display:flex;
}

.asset_item.grid .info_item{
     height: 44px;
}

.asset_item.grid:hover .info_item{
    display:none;
     height: 44px;
}

.grid .action_item{
 display:none;
 margin: 14px 0;
}

.grid .fileviewer{
    width: 100%;
    height: calc(100vh - 64px);
    border: 0px solid #000;
}
</style>