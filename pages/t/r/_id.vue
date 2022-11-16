<template>
  <v-container fluid>
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel
        v-for="(project, ind) in lists"
        :key="project._id"
        class="elevation-0"
      >
        <v-expansion-panel-header class="justify-self-start pa-2">
          <template v-slot:actions>
            <v-icon left small class="icon">ri-arrow-drop-down-line</v-icon>
          </template>
          <div
            class="header d-flex justify-start align-center"
            @click.prevent.stop
          >
            <span class="mr-7 font-weight-bold">{{ project.name }}</span>

            <EmployeePicker
              class="assign_picker"
              :employees="employees"
              :assignedemp="project.assigned"
              :id="project._id"
              :collection="'projects'"
              :size="28"
              :readonly="false"
              :authUser="authUser"
              :key="'project_' + project._id"
            />
            <span class="order-4 ml-2">
              <AddTask
                :authUser="authUser"
                :collection="'tasks'"
                :id="project"
                :options="{ plain: true, uppercase: true }"
              />
              <v-btn
                @click="showdesc(project)"
                x-small
                color="primary"
                text
                plain
                >Add Description</v-btn
              >

              <DatePicker
                :entry="project"
                :collection="'projects'"
                :authUser="authUser"
                :short="false"
              />
            </span>
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content @click.prevent.stop class="pa-0">
          <v-divider></v-divider>
          <v-container class="pt-0">
            <v-row>
              <v-col>
                <div
                  class="description_block"
                  v-html="project.desc"
                  @click="showdesc(project)"
                >
                  Add Desc
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-container class="pt-0">
            <v-row>
              <v-col>
                <v-row>
                  <v-col class="col-2 caption">
                    <v-btn
                      x-small
                      color="error"
                      class="elevation-0"
                      @click="updatedisplay(ind)"
                    >
                      <v-icon left small> ri-arrow-drop-down-line </v-icon>
                      Rejected
                    </v-btn></v-col
                  >
                  <v-col class="caption">
                    <span>{{ tasks.length }} TASK</span>

                    <v-btn
                      @click="isordering(true)"
                      x-small
                      color="primary"
                      text
                      plain
                      v-if="!ordering[0]"
                      >Set Task Order</v-btn
                    >

                    <v-btn
                      @click="saveorder()"
                      x-small
                      color="primary"
                      text
                      plain
                      v-if="ordering[0]"
                      >Save Task Order</v-btn
                    >
                  </v-col>
                  <v-col class="col-1 text-center caption" v-show="display[ind]"
                    >ASSIGNEE</v-col
                  >
                  <v-col class="col-1 text-right caption" v-show="display[ind]"
                    >DUE DATE</v-col
                  >
                  <v-col class="col-1 text-center caption" v-show="display[ind]"
                    >PRIORITY</v-col
                  >
                  <v-col class="col-1 text-left caption" v-show="display[ind]"
                    >HOURS</v-col
                  >
                </v-row>
                <div v-show="display[ind]">
                  <draggable
                    v-model="tasks"
                    draggable=".task_item"
                    :disabled="!ordering[0]"
                    v-bind="{chosenClass: 'chosen', ghostClass: 'ghost'}"
                  >
                    <div
                      v-for="task in tasks"
                      :key="task._id"
                      class="task_item"
                    >
                      <TaskItem
                        :task="task"
                        :employees="employees"
                        :size="28"
                        :readonly="false"
                        :authUser="authUser"
                        :isordering="ordering[0]"
                        :subtask="false"
                        :level="0"
                        :deletable="task.children?false:true"
                        @statechange="statechange($event)"
                      />

                      <div
                      v-for="ctask in task.children"
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
                  </draggable>
                </div>
                <AddTask
                  :authUser="authUser"
                  :collection="'tasks'"
                  :id="project"
                  :options="{ plain: false }"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-if="showModal" class="modal-route">
      <div class="modal-content">
        <nuxt-child></nuxt-child>
      </div>
    </div>

    <v-navigation-drawer
      v-model="drawerright"
      fixed
      right
      width="500"
      class="elevation-10 right_desc_block pa-5"
    >
      <v-fab-transition>
        <v-btn
          key="ri-close-line"
          fab
          dark
          bottom
          left
          class="v-btn--example"
          @click="hidedesc()"
        >
          <v-icon>ri-close-line</v-icon>
        </v-btn>
      </v-fab-transition>

      <div v-if="selectedProject">
        <ProjectInfo
          :project="selectedProject"
          :authUser="authUser"
          :employees="employees"
        />
      </div>

      <ez-tiptap
        :editable="true"
        v-model="selectedProject.desc"
        class="elevation-0"
      />

      <v-btn @click="save()" class="ml-3" small>
        <v-icon x-small class="mr-2">ri-save-line</v-icon> Save
      </v-btn>
    </v-navigation-drawer>

  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import ProjectInfo from "~/components/project/info.vue";
import AddTask from "~/components/task/addtask.vue";
import TaskItem from "~/components/task/taskitem.vue";
import EmployeePicker from "~/components/employeepicker.vue";
import { BroadcastChannel } from "broadcast-channel";
import DatePicker from "~/components/task/datepicker.vue";
export default {
  components: {
    EmployeePicker,
    TaskItem,
    AddTask,
    ProjectInfo,
    DatePicker,
    draggable,
  },
  name: "ClientsPage",
  data() {
    return {
      lists: [],
      panel: [],
      drawerright: false,
      selectedProject: {},
      display: [],
      content: "",
      tasks: [],
      ordering: [],
      nested: []
    };
  },
  head() {
    return {
      title: "Projects",
    };
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.post(
      `/cockpit/listUsers?token=${process.env.aKey}`);
    //console.log("UserData: ", data);
    return { employees: data };
  },
  computed: {
    showModal() {
      return this.$route.matched.length;
    },
    authUser() {
      return this.$store.state.localStorage.authUser;
    },
  },
  mounted() {
    this.getData();

    const channel = new BroadcastChannel("actions");
    channel.onmessage = (msg) => {
      if (msg.name == "tasks") {
        this.getData();
      }
    };

    const channel2 = new BroadcastChannel("assigned");
    channel2.onmessage = (msg) => {
      console.log(msg);
    };
  },
  methods: {
    async getData() {
      try {
        this.$axios
          .$post(`/gettasks?token=${process.env.cKey}`, {
            id: this.$route.params.id,
            filter: {
              $and: [
                {
                  pid: this.$route.params.id
                },
                {state: 'PROJECT DECLINED'}
              ]
            }
          })
          .then((res) => {
            this.lists = res.info;
            this.nested = res.tasks
            //this.nest(res.tasks, null)
            this.tasks = this.nested.sort((a, b) => {
                return a.order < b.order;
            });
            console.log(res);
            this.panel = [0];
            this.ordering[0] = false;
            this.display[0] = true;
            // this.nested = this.nest(res.tasks, null)
            // console.log(this.nested)
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
    getProjectName() {
      if (this.lists.info) {
        this.$store.commit("localStorage/SET_TITLE", this.lists.info[0].name);
        return this.lists[0].name;
      } else {
        return "Loading";
      }
    },
    showdesc(item) {
      this.drawerright = true;
      this.selectedProject = item;
    },
    hidedesc() {
      this.drawerright = false;
    },
    updatedisplay(i) {
      // this.display[i] = !this.display[i];
      // //console.log(this.display);
      this.$set(this.display, i, !this.display[i]);
    },
    save() {
      let item = {
        _id: this.selectedProject._id,
        desc: this.selectedProject.desc,
      };
      this.$axios
        .$post(`/collections/save/projects?token=${this.authUser.api_key}`, {
          data: item,
        })
        .then((response) => {
          this.getData();
        })
        .catch((error) => {
          this.onerror(error);
        });
    },
    saveorder() {
      let index = 1;
      this.tasks.map((e) => {
        let data = {
          _id: e._id,
          order: index,
        };

        console.log(e.order, index);
        this.$axios
          .$post(`/collections/save/tasks?token=${this.authUser.api_key}`, {
            data: data,
          })
          .then((response) => {})
          .catch((error) => {
            this.onerror(error);
          });
        index++;

        if (index === this.tasks.length + 1) {
          this.getData();
        }
      });
    },
    isordering(e) {
      this.$set(this.ordering, 0, !this.ordering[0]);
    },
    statechange(e){
      this.getData()
    }
  },
};
</script>

<style>
.icon {
  order: 0;
}

.header {
  order: 1;
  display: inline;
}
.assign_picker {
  order: 2;
}

.v-btn--example {
  top: 20px;
  left: -100px;
  position: fixed;
  margin: 0 0 16px 16px;
}

.v-navigation-drawer,
.v-navigation-drawer__content {
  overflow-x: visible !important;
}
.order-4 {
  order: 4;
}

.description_block {
  min-height: 20px;
  font-size: 14px;
  padding: 10px;
  max-height: 300px;
  overflow: hidden;
}

.description_block p {
  margin-bottom: 5px;
}

.theme--light.v-navigation-drawer {
  overflow: visible;
}

.chosen {
  opacity:1;
  background: #fff;
  transform: translateZ(0) !important;
}
.ghost {
  opacity: 1;
  background: #fff;

}

.drag-block{
  transition: all .0s;
}
</style>
