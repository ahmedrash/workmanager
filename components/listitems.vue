<template>
    <div>
       <v-row class="my-0">
        <v-col class="d-flex justify-start align-center py-1">
            <TaskStatus :authUser="authUser" :id="task._id" :selectedstate="task.state" @statechange="statechange($event)"/>
            <v-btn text small color="primary" :to="`/t/${task._id}`" left plain v-if="!edit" class="mr-6">
                <span class="mr-auto">{{ task.name }}</span>
            </v-btn>
        </v-col>
       </v-row>
    </div>
</template>

<script>
import TaskStatus from '~/components/task/status.vue'
export default {
    props: ['task', 'authUser', 'userlist', 'type'],
    components: {
    TaskStatus
  },
}
</script>
