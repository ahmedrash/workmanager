<template>
  <div>
   
    <v-toolbar
    dense
    flat
    >
    <v-toolbar-title>Attachments</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon small @click="layout='list'" class="mr-2">
        <v-icon small>ri-file-list-line</v-icon>
      </v-btn>

      <v-btn icon small @click="layout='grid'" class="mr-2">
        <v-icon small>ri-layout-grid-line</v-icon>
      </v-btn>
      
      <v-btn small elevation="0" v-if="lists.length > 0" @click="downloadfiles()">
        Download
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-row v-if="layout == 'grid'">
            <v-col
                v-for="asset in lists"
                :key="asset._id"
                class="w-100"
                cols="4"
            >
                <AssetGrid :asset="asset" :authUser="authUser" :userlist="userlist" @deleteAsset="deleteAsset($event)" @updateAsset="updateAsset($event)" @viewfile="viewfile($event)"/>
            </v-col>
        
      </v-row>

      <v-row v-if="layout == 'list'">
        <v-col>
            <v-list>
            <div
                v-for="asset in lists"
                :key="asset._id"
                class="w-100"
            >
                <Asset :asset="asset" :authUser="authUser" :userlist="userlist" @deleteAsset="deleteAsset($event)" @updateAsset="updateAsset($event)" @viewfile="viewfile($event)"/>
            </div>
            </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AssetGrid from "~/components/comments/asset_grid.vue";
import Asset from "~/components/comments/asset.vue";
export default {
  props: ["lists", "authUser", "userlist"],
  components: {
    Asset,
    AssetGrid
  },
  computed: {
    siteurl() {
      return process.env.apiUrl;
    },
  },
  data(){
      return {
          edit: false,
          layout: 'list',
          dataurlfiles: []
      }
  },
  methods:{
      downloadfiles(){
          let path = `${process.env.apiUrl}/download?token=${this.authUser.api_key}&id=${this.$route.params.slug}`
          window.open(path, "_blank")
      },
       deleteAsset(asset){
             this.$emit('deleteAsset', asset)
       },
       updateAsset(asset){
           this.$emit('updateAsset', asset)
       },
       viewfile(asset){
          this.$emit('viewfile', asset)
      },
    }
};
</script>