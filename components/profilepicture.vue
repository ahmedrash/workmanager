<template>
  <div>
    <div v-if="item != null">
      <Avatar
       v-if="getImg() == ''"
      :username="item.name"
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
  methods:{
    getImg(){
      if('profilepic' in this.item){
        if('path' in this.item.profilepic){
          if(this.item.profilepic.path != ''){
            let img = process.env.imagePath+''+this.item.profilepic.path
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
