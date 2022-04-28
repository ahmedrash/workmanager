<template>
  <div @mouseenter="hovered(true)" @mouseleave="hovered(false)">
    <v-row class="my-0">
      <v-col class="d-flex justify-start align-center py-1">
        <v-icon small v-if="subtask" :class="'ml-'+level*3">ri-node-tree</v-icon>
        <v-btn v-if="isordering && !subtask" icon small plain class="drag-icon"><v-icon small >ri-drag-move-line</v-icon></v-btn>
        <TaskStatus :authUser="authUser" :id="task._id" :selectedstate="task.state" @statechange="statechange($event)"/>
        <v-btn text small color="primary" :to="`/t/${task._id}`" left plain v-if="!edit" class="mr-6">
            <span class="mr-auto">{{ task.name }}</span>
        </v-btn>
        <!-- <div v-if="task.state != 'COMPLETE' || task.state != 'PEOJECT DECLINED'"> -->
        <input type="text" v-model="task.name" class="edit_name text-center" v-if="edit">

        <v-btn text small color="primary" class="edit_btn" icon left plain @click="edit=true" v-if="showhide && !edit">
            <v-icon small>ri-pencil-line</v-icon>
        </v-btn>

        <v-btn text small color="primary" icon left plain @click="save()" v-if="edit">
            <v-icon small>ri-save-line</v-icon>
        </v-btn>

        <v-btn text small color="primary" class="edit_btn" icon left plain @click="deleteitem()" v-if="showhide && deletable && (authUser.group == 'admin' || task._by == authUser._id)">
            <v-icon small>ri-delete-bin-line</v-icon>
        </v-btn>

        <v-btn text small color="primary" class="edit_btn" icon left plain @click="addsubtask()" v-if="showhide && level != 2">
            <v-icon small>ri-node-tree</v-icon>
        </v-btn>

        <v-btn text small color="primary" class="edit_btn" icon left plain @click="copylink(task)" v-if="showhide">
            <v-icon small>ri-link</v-icon>
        </v-btn>
  
        
        
      </v-col>
      <v-col class="col-1 text-center py-1">
          <EmployeePicker
              class="assign_picker"
              :employees="employees"
              :assignedemp="task.assigned"
              :id="task._id"
              :collection="'tasks'"
              :size="28"
              :readonly="false"
              :authUser="authUser"
              :key="'task' + task._id"
              
            />
      </v-col>
      <v-col class="col-1 text-right py-1">
        <DatePicker :entry="task" :collection="'tasks'" :authUser="authUser" :short="true"/>
      </v-col>
      <v-col class="col-1 text-center py-1">
        <TaskPriority :authUser="authUser" :id="task._id" :selectedstate="task.priority"  :collection="'tasks'"/>
      </v-col>
      <v-col class="col-1 text-left py-1">
        <TotalHours :entry="task" :authUser="authUser"/>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-snackbar
      v-model="snackbar"
      top
      right
      absolute
    >
      {{ msg.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :color="msg.status"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import TaskStatus from '~/components/task/status.vue'
import TaskPriority from '~/components/task/priority.vue'
import EmployeePicker from "~/components/employeepicker.vue";
import DatePicker from '~/components/task/datepicker.vue'
import TotalHours from '~/components/task/totalhours.vue'
import { BroadcastChannel } from "broadcast-channel";
export default {
    components: {
    EmployeePicker,
    TaskStatus,
    TaskPriority,
    DatePicker,
    TotalHours
  },
  props: ["task","employees", "readonly", "size", "authUser", "isordering", "subtask","level","deletable"],
  data(){
    return{
      edit: false,
      showhide: false,
      snackbar: false,
      msg: {
        text: '',
        status: ''
      }
    }
  },
  methods:{
    save(){
      let item = {
            _id: this.task._id,
            name: this.task.name
        }
        this.$axios.$post(`/collections/save/tasks?token=${this.authUser.api_key}`,{
        data: item
      })
      .then(response => {
        this.edit=false
      })
      .catch(error => {
        this.onerror(error)
      })
    },
    deleteitem(){
      this.loading = true
        confirm('Are you sure you want to delete this task?') && this.$axios.$post(`/collections/remove/tasks?token=${this.authUser.api_key}`,{
          filter: this.task
        })
        .then(response => {
          const channel = new BroadcastChannel("actions");
            channel.postMessage({
              name: 'tasks',
              action: "reload",
            });
          })
        .catch(error => {
          this.onerror(error)
        })
    },
    hovered(i){
      console.log(this.task.state)
      if(this.task.state != 'COMPLETE' && this.task.state != 'PROJECT DECLINED'){
        this.showhide = i
      }
    },
    onerror(e){

    },
    addsubtask(){
      let data = {
        pid: this.task.pid,
        taskid: this.task._id,
        name: 'Enter task name'
      }
      
      this.$axios
        .$post(
          `/collections/save/tasks?token=${this.authUser.api_key}`,
          {
            data: data,
          }
        )
        .then((response) => {
          const channel = new BroadcastChannel("actions");
          channel.postMessage({
            name: 'tasks',
            action: "reload",
          });
        })
        .catch((error) => {
          this.onerror(error);
        });
    },
    async copylink(item) {
      let link = "";
      link = process.env.siteURL + "/t/" + item._id;

      try {
        await this.$copyText(link);
        this.msg ={
          text: 'Link copied',
          status: 'success'
        }
        this.snackbar = true
      } catch (e) {
        console.error(e);
        this.msg ={
          text: 'Failed copying',
          status: 'error'
        }
        this.snackbar = true
      }
    },
    statechange(e){
      this.$emit('statechange', e)
    }
  }
};
</script>

<style>
.edit_name{
  font-size: 0.75rem;
  color:#344e5c;
}
.edit_name:focus-visible {
  outline: none !important;
}

.edit_btn{
  display:none;
}

.task_item .edit_btn{
  display:block;
}

/* .drag-icon{
cursor: grabbing; 
} */


</style>