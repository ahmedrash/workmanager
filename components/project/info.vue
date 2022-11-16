<template>
  <v-container>
    <v-row>
      <v-col class="py-0">
        <v-breadcrumbs :items="items">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-h5 py-0">
        {{ project.name }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-3 d-flex">
        <DatePicker :entry="project" :collection="'projects'" :authUser="authUser" :short="false"/>
        <TaskPriority :authUser="authUser" :id="project._id" :selectedstate="project.priority"  :collection="'project'" class="mr-3"/>
        <EmployeePicker
              class="assign_picker"
              :employees="employees"
              :assignedemp="project.assigned"
              :id="project._id"
              :collection="'projects'"
              :size="28"
              :readonly="false"
              :authUser="authUser"
              :key="'project' + project._id"
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
  props: ["project", "authUser","employees"],
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
          { text: val.cid.display, disabled: false, href: '/clients/'+val._id },
          { text: val.name, disabled: false, href: '/projects/'+val._id }
        ];
      }
    },
  },
};
</script>
