<template>
  <v-row justify="center" align="center">
    <v-col cols="6" sm="8" md="6">
      <div
                      v-for="task in tasks"
                      :key="task._id"
                      class="task_item"
                    >
                      <ListItem
                        :task="task"
                        :userlist="employees"
                        :authUser="authUser"
                        :type="'tasks'"
                      />

      </div>
    </v-col>
    
    <v-col cols="6" sm="8" md="6">
      <v-row>
        <v-col>
          <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>

              <v-btn
                text
                color="secondary"
                @click="gototask(selectedEvent)"
              >
                View
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import { BroadcastChannel } from 'broadcast-channel';
import EmployeePicker from '~/components/employeepicker.vue'
import TaskStatus from '~/components/task/status.vue'
import ListItem from "~/components/listitems.vue";
export default {
  components:{
    EmployeePicker,
    TaskStatus,
    ListItem
  },
  data(){
    return {
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [],
      tasks: []
    }
  },
  async asyncData ({ $axios }) {
      const { data } = await $axios.post(`/cockpit/listUsers?token=${process.env.aKey}`,{
        filter: {group: 'employee'}
      })
       console.log("UserData: ", data)
      return { employees: data }
    },
  name: 'IndexPage',
  head () {
    return {
      title: 'Home'
    }
  },
  computed: {
    authUser() {
      return this.$store.state.localStorage.authUser;
    },
  },
  mounted() {
    this.$store.commit('localStorage/SET_TITLE', this.$metaInfo.title)
    this.getOverviews()
    this.$refs.calendar.checkChange()
  },
  methods:{
     async getOverviews(){
      try {
        this.$axios
          .$post(`/dashboarditem?token=${process.env.cKey}`, {
            id: this.authUser._id,
          })
          .then((res) => {
            console.log(res);
            this.tasks = res.assigned.tasks
            this.events = res.assigned.tasks.filter(e=>{
              if(e.schedule.length > 1){
                return e
              }
            }).map(e=>{
              return {
                name: e.name,
                start: this.formatdatetime(e, 0),
                end: this.formatdatetime(e, 1),
                _id: e._id,
                color: this.hashCode(e.name)
              }
            })
          });
      } catch (error) {
        console.log("error", error);
      }
    },
    formatdatetime(e, i){
      return moment(e.schedule[i]+' '+e.scheduletime[i]).format('YYYY-MM-DD hh:mm')
    },
    viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      gototask(event){
        this.$router.push('/t/'+event._id)
      },
      hashCode(str) {
          var hash = 0;
          for (var i = 0; i < str.length; i++) {
              hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }
          var colour = '#';
          for (var i = 0; i < 3; i++) {
              var value = (hash >> (i * 8)) & 0xFF;
              colour += ('00' + value.toString(16)).substr(-2);
          }

          this.colors.push(colour);
          return colour;
      }
  }
  
}
</script>
