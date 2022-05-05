<template>
  <div>
    <div v-if="item != null">
      <Avatar
       v-if="getImg() == ''"
      :username="username"
      :size="size"
      class="mr-0"
      color="#fff"
      ></Avatar>

      <v-avatar :size="size" v-if="getImg() != ''" rounded>
        <img
          :src="getImg()"
          :lazy-src="getImg()"
          :alt="item.name"
          style="object-fit:cover;"
        >
      </v-avatar>
    </div>

  </div>
</template>

<script>
import Avatar from 'vue-avatar'
  export default {
    components:{
      Avatar
    },
  props: {
      item: { type: Object, required: false},
      size:{ required: true}
  },
  data(){
    return{
      username: ''
    }
  },
  watch:{
    item(val){
      this.username = val.name
    }
  },
  methods:{
    getImg(){
      if('profilepic' in this.item){
        if('path' in this.item.profilepic){
          if(this.item.profilepic.path != ''){
            let img = `${process.env.apiUrl}/cockpit/image?token=${process.env.aKey}&src=${this.item.profilepic._id}&w=128&h=128&o=true`
            return img
          }
          return ''
        }
        return ''
      }
      else{
        return ''
      }
    }
  }

}
</script>

<style>
</style>
