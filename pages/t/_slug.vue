<template>
<div>
  <v-dialog
    v-model="dialogslug"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    content-class="dialog_block"
  >
    <v-card>
      <v-card-title class="task_title_block">
        <v-container>
          <v-row>
            <v-col v-if="task">
              <TaskInfo
                :project="project"
                :task="task"
                :authUser="authUser"
                :employees="employees"
              />
            </v-col>

            <v-col cols="12" md="8" class="d-flex justify-space-between">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeModal" icon
                >
                <v-icon>ri-close-line</v-icon>
                </v-btn
              >
             
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text ref="cardContainer" class="px-0 pb-0 comment-main-block">
        
        <v-container class="comment_container pb-0">
          <v-row class="comment_row">
            <v-col cols="6" class="first vfa-demo">
              <v-row>
                <v-col class="right_desc_block">
                 
                <ez-tiptap
                  :editable="true"
                  v-model="task.desc"
                  class="elevation-0"
                />
                

                <v-btn @click="savetask()" class="ml-3" small>
                  <v-icon x-small class="mr-2">ri-save-line</v-icon> Save
                </v-btn>
                </v-col>
              </v-row>
              <v-row class="mt-5 px-5">
                  <v-col class="col-2">
                    <span class="subtask_title">Sub Tasks</span>
                  </v-col
                  >
                  <v-col class="caption">
                    
                  </v-col>
                  <v-col class="col-1 text-center caption"
                    >ASSIG.</v-col
                  >
                  <v-col class="col-1 text-right caption"
                    >D. DATE</v-col
                  >
                  <v-col class="col-1 text-center caption"
                    >PRIORITY</v-col
                  >
                  <v-col class="col-1 text-left caption"
                    >HOURS</v-col
                  >
                </v-row>
                <div class="px-5">
                  <div
                      v-for="t in tasks"
                      :key="t._id"
                      class="task_item"
                    >
                      <TaskItem
                        :task="t"
                        :employees="employees"
                        :size="28"
                        :readonly="false"
                        :authUser="authUser"
                        :isordering="ordering[0]"
                        :subtask="false"
                        :level="0"
                        :deletable="t.children?false:true"
                        @statechange="statechange($event)"
                      />

                      <div
                      v-for="ctask in t.children"
                      :key="ctask._id"
                      class="py-0"
                    >
                      <TaskItem
                        :task="ctask"
                        :employees="employees"
                        :size="28"
                        :readonly="false"
                        :authUser="authUser"
                        :isordering="ordering[0]"
                        :subtask="true"
                        :level="1"
                        :deletable="ctask.children?false:true"
                        @statechange="statechange($event)"
                      />

                      <div
                      v-for="cctask in ctask.children"
                      :key="cctask._id"
                      class="py-0"
                    >
                      <TaskItem
                        :task="cctask"
                        :employees="employees"
                        :size="28"
                        :readonly="false"
                        :authUser="authUser"
                        :isordering="ordering[0]"
                        :subtask="true"
                        :level="2"
                        :deletable="true"
                        @statechange="statechange($event)"
                      />

                      
                    </div>
                    </div>
                      
                    </div>
                </div>

              <Assets class="mt-5" :lists="assetlist" :authUser="authUser" :userlist="employees" @deleteAsset="deleteAsset($event)" @updateAsset="updateAsset($event)" @viewfile="viewfile($event)"/>

  
              <!-- <file-viewer
        filename="sample.pdf"
        url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      /> -->
              <!-- <VueFileAgent 
              :uploadUrl="uploadURL" 
              v-model="fileRecords" 
              ref="vfaDemoRef"
              :uploadHeaders="{}"
              :multiple="true"
              :deletable="true"
              :theme="'list'"
              @select="filesSelected($event)"
              >
                
                <template v-slot:file-preview-new>
                  <v-btn color="grey" icon tile plain key="new">
                      <v-icon>ri-attachment-2</v-icon>
                  </v-btn>
                </template >

              </VueFileAgent> -->
              <!-- <button :disabled="!fileRecordsForUpload.length" @click="uploadFiles()">
                Upload {{ fileRecordsForUpload.length }} files
              </button> -->
            </v-col>

            <v-col cols="6" class="d-flex justify-space-between flex-column position-relative">
              <div class="message_block" ref="container">
                <div v-for="item in comments" :key="'comment_'+item._id" :ref="'c_'+item._id">
                
                  <Comment :comment="item" :authUser="authUser" :userlist="employees" @deleteItem="deleteItem($event)" @editItem="editItem($event)" class="mb-6"/>
                
              </div>
              </div>
              

              <div class="comment_editor_block" ref="editorblock">
                <v-row class="elevation-2">
                  <v-col cols="12" class="pb-0">
                    <editor-content :editor="editor" />
                  </v-col>
                  <v-col cols="12" class="pt-0 d-flex px-6 filelist">
                    <v-chip
                      v-for="file in filelist"
                      class="py-1 px-4 ma-2"
                      :key="'chip_'+file._id"
                      close
                      @click:close="deletefile(file._id)"
                    >
                      {{file.title}}
                    </v-chip>
                  </v-col>

                  <v-col cols="12" class="pt-0 d-flex px-6">

                    <v-menu v-model="menu" :offset-y="true" top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="grey"
                          v-bind="attrs"
                          v-on="on"
                          icon
                          tile
                          plain
                        >
                          <v-icon>ri-user-smile-line</v-icon>
                        </v-btn>
                      </template>

                      <Picker
                        :data="emojiIndex"
                        set="facebook"
                        @select="showEmoji"
                        :emojiSize="24"
                      />
                    </v-menu>

                    <VueFileAgent 
                    :uploadUrl="uploadURL" 
                    v-model="fileRecords" 
                    ref="vfaDemoRef"
                    :uploadHeaders="{}"
                    :multiple="true"
                    :deletable="true"
                    
                    @select="filesSelected($event)"
                    >
                      
                      <template v-slot:file-preview-new>
                        <v-btn color="grey" icon tile plain key="new">
                            <v-icon>ri-attachment-2</v-icon>
                        </v-btn>
                      </template >

                    </VueFileAgent>

                    <!-- <v-btn color="grey" icon tile plain>
                      <v-icon>ri-attachment-2</v-icon>
                    </v-btn> -->

                    <v-spacer></v-spacer>

                    <v-btn @click="save()" color="success" elevation="0" v-if="!fileRecordsForUpload.length">
                      Comment
                    </v-btn>

                    <v-btn @click="uploadFiles()" color="success" elevation="0" v-if="fileRecordsForUpload.length">
                      Upload Files
                    </v-btn>


                  </v-col>
                </v-row>

                <div v-if="editor">
                  <bubble-menu
                    class="bubble-menu"
                    :tippy-options="{ duration: 100 }"
                    :editor="editor"
                  >
                    <v-btn
                      color="primary"
                      small
                      icon
                      @click="editor.chain().focus().toggleBold().run()"
                      :class="{ 'is-active': editor.isActive('bold') }"
                    >
                      <v-icon small>ri-bold</v-icon>
                    </v-btn>

                    <v-btn
                      color="primary"
                      small
                      icon
                      @click="editor.chain().focus().toggleItalic().run()"
                      :class="{ 'is-active': editor.isActive('italic') }"
                    >
                      <v-icon small>ri-italic</v-icon>
                    </v-btn>

                    <v-btn
                      color="primary"
                      small
                      icon
                      @click="editor.chain().focus().toggleStrike().run()"
                      :class="{ 'is-active': editor.isActive('strike') }"
                    >
                      <v-icon small>ri-strikethrough-2</v-icon>
                    </v-btn>
                  </bubble-menu>

                  <floating-menu
                    class="floating-menu"
                    :tippy-options="{ duration: 100 }"
                    :editor="editor"
                  >
                    <v-btn
                      color="primary"
                      small
                      icon
                      @click="
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      "
                      :class="{
                        'is-active': editor.isActive('heading', { level: 1 }),
                      }"
                    >
                      <v-icon small>ri-h-1</v-icon>
                    </v-btn>

                    <v-btn
                      color="primary"
                      small
                      icon
                      @click="
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      "
                      :class="{
                        'is-active': editor.isActive('heading', { level: 2 }),
                      }"
                    >
                      <v-icon small>ri-h-2</v-icon>
                    </v-btn>

                    <v-btn
                      color="primary"
                      small
                      icon
                      @click="editor.chain().focus().toggleBulletList().run()"
                      :class="{ 'is-active': editor.isActive('bulletList') }"
                    >
                      <v-icon small>ri-list-unordered</v-icon>
                    </v-btn>
                  </floating-menu>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialogviewer"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          tile
        >
          
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
            icon
            dark
            @click="closeview()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <iframe class="fileviewer" :src="filepath"></iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import "file-viewer";
import moment from 'moment'
import TaskInfo from "~/components/task/info.vue";
import Comment from "~/components/comments/item.vue";
import Assets from "~/components/comments/assets.vue";
import { BubbleMenu, FloatingMenu, Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import suggestion from "~/modules/suggestion.js";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import TaskItem from "~/components/task/taskitem.vue";
import draggable from "vuedraggable";

import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
let emojiIndex = new EmojiIndex(data);

 const CustomImage = Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class:{
              default: null
            },
            'data-assetid':{
              default: null
            }
          }
        },
        draggable: false
      })

export default {
  components: {
    Comment,
    TaskInfo,
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    Picker,
    Assets,
    TaskItem,
    draggable
  },
  data() {
    return {
      dialogslug: true,
      task: {},
      project: {},
      comments: [],
      interval: null,
      editor: null,
      emojiIndex: emojiIndex,
      emojisOutput: "",
      menu: false,
      selectedMentioned: [],
      mentionarray: [],
      editID: '',
      fileRecords: [],
      fileRecordsForUpload: [],
      filelist: [],
      assetlist: [],
      dialogviewer: false,
      filepath: '#',
      panel: [],
      ordering:[],
      display: [],
      lists: [],
      nested: [],
      tasks: []
    };
  },
  computed: {
    authUser() {
      return this.$store.state.localStorage.authUser;
    },
    uploadURL(){
      return process.env.apiUrl+`/cockpit/addAssets?token=${this.authUser.api_key}`
    }
  },
  async asyncData({ $axios, store }) {
    const { data } = await $axios.post(
      `/cockpit/listUsers?token=${process.env.aKey}`);

    store.commit("localStorage/SET_USERLIST", data);
    console.log(data)
    return { employees: data };
  },
  mounted() {
    
    // Attach listeners for handling clicks outside the card, while preventing propagation
    // of clicks in the cards
    this.$refs.cardContainer.addEventListener("click", this.stopPropagation);
    //this.$refs.closeContainer.addEventListener('click', this.closeModal)
    this.getComments();
    this.getAssets();
    this.getData()
    //this.start();


    console.log(this.$nuxt.$route.path)

   

    this.editor = new Editor({
      content: "",
      extensions: [
        StarterKit,
        Link.configure({
          HTMLAttributes: {
            download: true,
          }
        }),
        Image,
        CustomImage,
        Mention.configure({
          HTMLAttributes: {
            class: "mention text-body-2 mr-1 success--text",
          },
          renderLabel:({ options, node }) => {
            const index = this.mentionarray.findIndex(object => object.id === node.attrs.id);

            if (index === -1) {
              this.mentionarray.push(node.attrs);
            }
            console.log(this.mentionarray)
            return `${options.suggestion.char}${
              node.attrs.label ?? node.attrs.id
            }`;
          },
          suggestion,
        }),
      ]
    });
  },
  beforeDestroy() {
    this.stop();
    this.editor.destroy();
    // Make sure to cleanup!
    this.$refs.cardContainer.removeEventListener("click", this.stopPropagation);
    //this.$refs.closeContainer.removeEventListener('click', this.closeModal)
  },
  watch: {
    editor(val) {
      // console.log(val.getJSON());
    },
    emojisOutput(val) {
      this.editor.commands.insertContent(val);
      this.emojisOutput = ''
    },
  },
  methods: {
    updatedisplay(i) {
      // this.display[i] = !this.display[i];
      // //console.log(this.display);
      this.$set(this.display, i, !this.display[i]);
    },
    statechange(e){
      this.getData()
    },
    async getData() {
      try {
        this.$axios
          .$post(`/gettasks?token=${process.env.cKey}`, {
            tid: this.$route.params.slug,
            filter: {
              $and: [
                {
                  $or: [
                    {state: 'TO DO'},
                    {state: null}
                  ]
                }
              ]
            }
          })
          .then((res) => {
            this.lists = res.info;
            this.nested = this.nest(res.tasks, this.$route.params.slug)
            this.tasks = this.nested.sort((a, b) => {
                return a.order < b.order;
            })
            console.log(this.tasks);
            this.panel = [0];
            this.ordering[0] = false;
            this.display[0] = true;
          });
      } catch (error) {
        console.log("error", error);
      }
    },
     nest(data, parentId = null) {
      return data.reduce((r, e) => {
        let obj = Object.assign({}, e);
        if (parentId == e.taskid) {
          let children = this.nest(data, e._id);
          if (children.length) obj.children = children;
          r.push(obj);
        }
        return r;
      }, []);
    },
    viewfile(asset){
          this.dialogviewer = true
          this.filepath = `https://docs.google.com/gview?url=${this.getassetURL(asset)}&embedded=true`
      },
      closeview(){
        this.dialogviewer = false
        this.filepath = '#'
      },
      getassetURL(asset){
          return `${process.env.imagePath}${asset.path}`
      },
    updateScroll(){
      const container = this.$refs.container;
      // const editorblock = this.$refs.editorblock
      // container.setAttribute('max-height',  container.clientHeight - editorblock.clientHeight)
      this.$nextTick(() => {
       container.scrollTop = container.scrollHeight;
      })
    },
    scrollIntoView(id) {
      // const container = this.$refs.container;
      // container.scrollTop = container.scrollHeight;
      // const el = this.$el.querySelector(id);
      // console.log(el)
      // if (el) {
      //   el.scrollIntoView();
      // }

      // const [el] = this.$refs[id];
      // if (el) {
      //   el.scrollIntoView();
      // }

      console.log(this.$refs[id].$el)
      //.focus();
    },
    showEmoji(emoji) {
      this.emojisOutput = this.emojisOutput + emoji.native;
    },
    async getAssets(){
      try {
        this.$axios
          .$post(`/getassets?token=${process.env.cKey}`, {
            id: this.$route.params.slug,
          })
          .then((res) => {
            console.log(res);
            this.assetlist = res.assets
          });
      } catch (error) {
        console.log("error", error);
      }
    },
    async getComments() {
      let data = [];
      this.employees.map((e) => {
        data.push({
          name: e.name,
          _id: e._id,
          label: e.name,
          id: e._id,
          profilepic: e.profilepic ? e.profilepic : {},
        });
      });
      localStorage.setItem("userlist", JSON.stringify(data));

      try {
        this.$axios
          .$post(`/gettasksncomments?token=${process.env.cKey}`, {
            id: this.$route.params.slug,
          })
          .then((res) => {
            this.task = res.info[0];
            this.project = res.project;
            this.comments = res.comments;
            console.log(res);
            this.updateScroll()
          });
      } catch (error) {
        console.log("error", error);
      }
    },
    // Prevent clicking inside the card from triggering the closeModal
    stopPropagation(e) {
      e.stopPropagation();
    },
    closeModal() {
      // You can also do this.$router.push('/') to preserve the history
      this.$router.push(this.gettopage());
    },
    getTaskName() {
      if (this.task) {
        return this.task.name;
      } else {
        return "Loading";
      }
    },
    gettopage() {
      if (this.$nuxt.context.from) {
        console.log(this.$nuxt.context.from.path)
        if(this.$nuxt.context.from.path == this.$nuxt.$route.path){
          return "/projects/" + this.task.pid._id;
        }
        else{
          return this.$nuxt.context.from.path;
        }
        
      } else {
        return "/projects/" + this.task.pid._id;
      }
    },
    start() {
      this.interval = setInterval(this.getComments, 30000);
    },
    stop() {
      clearInterval(this.interval);
      this.interval = null;
    },
    save() {
      let data = {
        message: this.editor.getHTML(),
        mention: this.mentionarray,
        tid: {
          _id: this.task._id,
          link: 'tasks',
          display: this.task.name
        },
        by:{
            _id: this.authUser._id,
            display: this.authUser.name,
            link: 'accounts'
          },
          created: moment(),
          files: this.filelist
      }

      if(this.editID){
        data._id = this.editID
      }

      this.$axios
        .$post(
          `/collections/save/comments?token=${this.authUser.api_key}`,
          {
            data: data,
          }
        )
        .then((response) => {
          if(this.mentionarray.length > 0){
            this.sendemail(data)
          }
          if(this.editID){
            this.updateItem(response)
          }
          else{
            this.comments.push(response)
          }
          
          this.editor.commands.clearContent()
          this.filelist = []
          this.getAssets()
          this.updateScroll()
        })
        .catch((error) => {
          this.onerror(error);
        });

      console.log(data);
    },
    onerror(error) {
      //   console.log(error);
      if (this.$axios.isCancel(error)) {
        console.log("Request canceled", error);
      } else {
        console.log("Error", error);
      }
    },
    deleteItem(val){
      //console.log(val)
      let removeIndex = this.comments.findIndex(item => item._id == val._id)
      this.comments.splice( removeIndex, 1 );
      this.getAssets()
    },
    updateItem(val){
      let updateIndex = this.comments.findIndex(item => item._id == val._id)
      this.comments[updateIndex] = val
      this.getAssets()
    },
    editItem(val){
      this.editID = val._id
      this.filelist = val.files
      this.editor.commands.insertContent(val.message)
      this.getAssets()
    },
    removeFileRecord(fileRecord){
      //console.log(fileRecord,this.$refs.vfaDemoRef)
        return this.$refs.vfaDemoRef.removeFileRecord(fileRecord);
      },
     uploadFiles() {
      //  console.log(this.fileRecordsForUpload)
      //  return
        // Using the default uploader. You may use another uploader instead.
        // this.$refs.vfaDemoRef.upload(this.uploadUrl, this.uploadHeaders, this.fileRecordsForUpload);
        let formData = new FormData()
        this.fileRecordsForUpload.map((e, index)=>{
          e.file.ext = e.ext
          formData.append("files["+index+"]", e.file)
        })
        
         this.$axios.$post(`/cockpit/addAssets?token=${this.authUser.api_key}`,formData,{
          headers: {
                    'Content-Type': 'multipart/form-data'
                }
        })
        .then(response => {
          console.log(response)
          this.fileRecords = []
          this.fileRecordsForUpload = [];
          response.assets.map(e=>{
            this.filelist.push({
              _id: e._id,
              path: e.path,
              title: e.title
            })
              })
          
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log('Request canceled', error)
          } else {
            console.log('Error', error)
          }
        })
      },
      filesSelected(fileRecordsNewlySelected) {
        var validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
        this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
      },
      deleteAsset(val){
        let commentid = val.commentid
        let fcomment = this.comments.filter(e=>{
          return e._id == commentid
        })

        if(fcomment.length > 0){
          let comment = fcomment[0]
          comment.files = comment.files.filter(c=>{
            return c._id != val._id
          })
          this.$axios
        .$post(
          `/collections/save/comments?token=${this.authUser.api_key}`,
          {
            data: comment
          }
        )
        .then((response) => {
          this.updateItem(response)
          this.getAssets()
          this.updateScroll()
        })
        .catch((error) => {
          this.onerror(error);
        });
        }
        
      },
      updateAsset(val){
        let commentid = val.commentid
        let fcomment = this.comments.filter(e=>{
          return e._id == commentid
        })

        if(fcomment.length > 0){
          let comment = fcomment[0]
          comment.files.map(c=>{
              if(c._id == val._id){
                c.title = val.title
              }
            })
          this.$axios
        .$post(
          `/collections/save/comments?token=${this.authUser.api_key}`,
          {
            data: comment
          }
        )
        .then((response) => {
          this.updateItem(response)
          this.getAssets()
          this.updateScroll()
        })
        .catch((error) => {
          this.onerror(error);
        });
        }
      },
      savetask(){
        this.$axios
        .$post(
          `/collections/save/tasks?token=${this.authUser.api_key}`,
          {
            data: this.task
          }
        )
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          this.onerror(error);
        });
      },
      sendemail(data){
        data.collection = 'comments'
        this.$axios
        .$post(
          `/sendemail?token=${this.authUser.api_key}`,
          {
            data: data
          }
        )
        .then((response) => {
          console.log('email', response)
        })
        .catch((error) => {
          this.onerror(error);
        });
      }
  },
};
</script>

<style>
.position-relative{
  position: relative;
}
.v-dialog--fullscreen {
  overflow: hidden !important;
  height: 100vh !important;
}
.comment-main-block {
  padding: 0px !important;
}
.dialog_block .v-dialog--fullscreen { 
  display: block !important;
 }

.mention {
  padding: 5px;
  transition: all 0.3;
  border-radius: 3px;
}

.subtask_title{
  font-size: 1.25rem !important;
    line-height: 1.5!important;
    overflow: hidden!important;
    text-overflow: ellipsis!important;
    white-space: nowrap!important;
    font-family: 'Raleway', sans-serif!important;
    color: rgba(0, 0, 0, 0.87)!important;
    font-weight: 400!important;
    letter-spacing: 0.0071428571em!important;
}

.mention:hover {
  background: #eee;
}

.emoji-mart-bar.emoji-mart-bar-preview {
  display: none !important;
}

.message_block{
  height: calc(100vh - 200px);
  overflow-y: scroll;
  padding-bottom: 200px;
}

.comment_editor_block {
    position: absolute;
    left: 0px;
    bottom: 35px;
    width: 100%;
    padding: 12px;
    background-color: #fff;
}



.vfa-demo {
    position: relative;
  }

  .vfa-demo .file-preview-wrapper::before {
    background: transparent;
  }

  .vfa-demo .file-row {
    position: relative;
    z-index: 15;
    line-height: 24px;
    text-align: left;
    background: #EEE;
    margin-bottom: 5px;
    padding: 2px 5px;
  }

  .vfa-demo .remove {
    float: right;
    margin-top: -3px;
  }

  .vfa-demo .progress {
    float: right;
    width: 85px;
    height: 10px;
    margin-top: 7px;
    margin-right: 10px;
    background: #FFF;
    border: 1px solid #AAA;
  }

  .vfa-demo .progress.completed {
    display: none;
  }

  .vfa-demo .drop-help-text {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    margin: 2px;
    background: rgba(255, 255, 255, 0.75);
    z-index: 1200;
    font-size: 32px;
    font-weight: bold;
    color: #888;
    align-items: center;
    justify-content: center;
    display: none;
  }

  .vfa-demo .is-drag-over .drop-help-text {
    display: flex;
  }

  .vfa-demo .upload-block  {
    border: 2px dashed transparent;
    padding: 20px;
    padding-top: 0;
  }

  .vfa-demo .is-drag-over.upload-block {
    border-color: #AAA;
  }

  .vfa-demo .vue-file-agent {
    border: 0 !important;
    box-shadow: none !important;
  }

  .c_image{
    max-width: 84px;
  }

  .s_image{
    max-width: 100px;
  }

  .vue-file-agent.file-input-wrapper {
    position: relative;
    border: 0px dashed #aaa;
    text-align: center;
    -webkit-transition: all .6s;
    transition: all .6s;
}

.filelist .v-chip .v-chip__close.v-icon.v-icon--right {
    position: absolute;
    top: 1px;
    right: -8px;
    z-index: 20000;
    background-color: #fff;
    border-radius: 9px;
    color: #ef3d59;
    opacity: 0;
    transition: all 0.3s;
}
</style>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  min-height: 80px;
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  img.c_image{
    max-width: 84px;
  }

  img.s_image{
    max-width: 100px;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }
}

.bubble-menu {
  display: flex;
  background-color: #eee;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: none;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}

.floating-menu {
  display: flex;
  background-color: #0d0d0d10;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}
</style>

