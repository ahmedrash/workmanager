<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          text
          x-small
          :plain="options.plain"
        >
        <span class="mr-auto d-flex">
        <v-icon x-small>ri-add-line</v-icon>
          <span>Add Task</span>
          </span>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New {{ collection }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  required
                  v-model="addItem.name"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false"> Close </v-btn>
          <v-btn
            color="success"
            text
            @click="save()"
            :disabled="!addItem.name"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { BroadcastChannel } from "broadcast-channel";
export default {
    props: ["id", "authUser", "collection","options"],
    data(){
        return{
           dialog: false,
           addItem: {
              name: "" 
           }
        }
    },
    methods:{
        save() {
            this.addItem.pid = {
                _id: this.id._id,
                link: 'projects',
                display: this.id.name
            }
      this.$axios
        .$post(
          `/collections/save/${this.collection}?token=${this.authUser.api_key}`,
          {
            data: this.addItem,
          }
        )
        .then((response) => {
          const channel = new BroadcastChannel("actions");
          channel.postMessage({
            name: this.collection,
            action: "reload",
          });
          this.dialog = false;
          this.addItem = { name: "" };
        })
        .catch((error) => {
          this.onerror(error);
        });
    },
    onerror(error) {
      //   console.log(error);
      if (this.$axios.isCancel(error)) {
        console.log("Request canceled", error);
      } else {
        console.log("Error", error);
      }
    }
    }
}
</script>