<template>
  <v-card :class="'mx-auto ml-16 relative comment_item ' + isassigned" outlined>
    <div class="p_avatar">
      <ProfileAvatar :size="36" :item="getCommentedBy" />
    </div>
    <v-card-title class="text-caption d-flex justify-space-between py-2">
      <span>
        <span class="mr-1 font-weight-bold">
          {{
            comment.by._id == authUser._id ? "You" : comment.by.display
          }}</span
        >
        commented
      </span>
      <span>{{ hdate(comment.created) }}</span>

      <div class="more_block">
        <v-btn icon small plain v-if="authUser._id == comment.by._id" @click="$emit('editItem', comment)"><v-icon small>ri-pencil-line</v-icon></v-btn>
        <v-btn icon small plain><v-icon small>ri-link</v-icon></v-btn>
        <v-btn icon small plain v-if="authUser._id == comment.by._id" @click="deleteItem()"><v-icon small>ri-delete-bin-line</v-icon></v-btn>
      </div>
    </v-card-title>

    <v-card-text v-html="getmessage(comment)"></v-card-text>

    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";
import ProfileAvatar from "~/components/profilepicture.vue";
export default {
  props: ["comment", "authUser", "userlist"],
  components: {
    ProfileAvatar,
  },
  data(){
    return {
      loading: false
    }
  },
  computed: {
    getCommentedBy() {
      let user = this.userlist.filter((el) => {
        return el._id == this.comment.by._id;
      })[0];
      //console.log(this.userlist);
      return user;
    },
    isassigned() {
      let assigned = "";
      let ismentioned = this.comment.mention.filter((e) => {
        return e.id == this.authUser._id;
      });
      if (ismentioned.length > 0) {
        assigned = "assigned";
      }
      return assigned;
    },
  },
  methods: {
    hdate(date) {
      return moment(date).fromNow();
    },
    deleteItem(){
      this.loading = true
        confirm('Are you sure you want to delete this task?') && this.$axios.$post(`/collections/remove/comments?token=${this.authUser.api_key}`,{
          filter: this.comment
        })
        .then(response => {
          //console.log(response)
          this.comment.files.map(e=>{
            this.deleteItem1(e._id)
          })
          this.$emit('deleteItem', this.comment)
          })
        .catch(error => {
          this.onerror(error)
        })
    },
    deleteItem1(id){
           this.$axios.$post(`/cockpit/removeAssets?token=${this.authUser.api_key}`,
            {
              assets:[
                {
                  _id: id
                }
              ]
            }
            )
       },
    getmessage(comment){
      let msg = comment.message
      let files = comment.files
      files.map(e=>{
        let source = process.env.imagePath+''+e.path;
        let filetype = e.title.split('.')
        let ext = filetype[filetype.length-1].toLowerCase()
        let codeblock = ''
        if(ext == 'png' || ext == 'jpeg' || ext == 'jpg'){
          // this.editor.commands.setImage({ src: source, alt: e.decription, title: e.title, class: 'view_image' })
          msg += '<p><a href="'+source+'" download target="_blank"><img src="'+source+'" class="s_image" data-assetid="'+e._id+'"/><br>'+e.title+'</a></p>'
          
        }
        else{
        msg += '<p><a href="'+source+'" download><img src="/svg/'+filetype[filetype.length-1]+'.svg" class="c_image" data-assetid="'+e._id+'"/><br>'+e.title+'</a></p>'
        }
      })
      return msg
    },
    onerror(e){

    },
  },
};
</script>

<style>
.p_avatar {
  position: absolute;
  left: -52px;
  float: left;
  display: inline;
}

.comment_item.assigned {
  border-left-color: #1db954 !important;
}

.comment_item:hover {
  border-color: #1db954 !important;
}

.more_block{
  position: absolute;
  top:1px;
  right: 1px;
  background: #fff;
  display: none;
  justify-content: flex-end;
  width: 200px;
  padding: 4px 10px;
}

.comment_item:hover .more_block{
  display: flex;
}
</style>