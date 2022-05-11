<template>
  <v-container class="py-0">
    <v-row>
      <v-col class="py-0">
        <v-breadcrumbs :items="items" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row class="align-center">
      <v-col class="text-h5 py-0">
        {{ task.name }}
      </v-col>
    
      <v-col class="py-3 d-flex">
        <DatePicker :entry="task" :collection="'tasks'" :authUser="authUser" :short="false"/>
        <TaskPriority :authUser="authUser" :id="task._id" :selectedstate="task.priority"  :collection="'tasks'" class="mr-3"/>
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
    </v-row>
  </v-container>
</template>
<script>
import TaskPriority from '~/components/task/priority.vue'
import EmployeePicker from "~/components/employeepicker.vue";
import DatePicker from '~/components/task/datepicker.vue'
export default {
  props: ["project", "task", "authUser","employees"],
  components: {
    EmployeePicker,
    TaskPriority,
    DatePicker
  },
  data() {
    return {
      items: [],
    };
  },
  watch: {
    project(val){
        this.updateonload(val)
    }
  },
  methods: {
    updateonload(val) {
      if (val.cid) {
        this.items = [
          { text: val.cid.display, disabled: false, href: '/clients/'+val.cid._id },
          { text: val.name, disabled: false, href: '/projects/'+val._id },
          { text: this.task.name, disabled: true, href: '/t/'+val._id }
        ];
      }
    },
  },
};
</script>