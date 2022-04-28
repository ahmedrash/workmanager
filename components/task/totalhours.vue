<template>
  <div class="d-inline">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" x-small text plain color="primary">
          <v-icon small class="mr-2">ri-time-line</v-icon> {{gettime()}}
        </v-btn>
      </template>

      <v-card>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                label="Estimated Hours"
                placeholder="Estimated Hours"
                outlined
                dense
                hide-details
                v-model="estimated_hours"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="pt-0">
              <v-text-field
                label="Total time spent"
                placeholder="Total time spent"
                outlined
                dense
                hide-details
                v-model="hours_spent"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="authUser.group=='admin'">
            <v-col class="pt-0">
              <v-text-field
                label="Hours Approved"
                placeholder="Hours Approved"
                outlined
                dense
                hide-details
                v-model="hours_approved"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false" small color="warning darken-3">
            Cancel
          </v-btn>
          <v-btn color="success darken-3" text @click="save()" small>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: ["entry", "authUser"],
  data() {
    return {
      menu: false,
      estimated_hours: '',
      hours_spent: '',
      hours_approved: ''
    };
  },
  created() {
    this.updateonload();
  },
  methods: {
    updateonload() {
      if (this.entry.estimated_hours) {
        this.estimated_hours = this.entry.estimated_hours
        this.hours_spent = this.entry.hours_spent
      }
    },
    save(){
        let data = {
            _id: this.entry._id,
            estimated_hours: this.estimated_hours,
            hours_spent: this.hours_spent
        }

        this.$axios.$post(`/collections/save/tasks?token=${this.authUser.api_key}`,{
        data: data
      })
      .then(response => {
          console.log(response)
        this.menu = false
      })
      .catch(error => {
        this.onerror(error)
      })
    },
    onerror(e){

    },
    gettime(){
        return this.estimated_hours
    }
  },
};
</script>