<template>
  <v-container class="py-0 side_bar_content">
    <v-row>
      <v-col class="pb-0 pl-0 pr-1">
        <v-toolbar dense elevation="0" class="px-0">
          <v-toolbar-title class="text-body-1"
            ><v-icon small class="mr-4">ri-group-line</v-icon
            >Clients</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon smallm @click="openDialog({})" v-if="authUser.group=='admin'">
            <v-icon small>ri-add-line</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <v-treeview
          v-model="tree"
          :open="initiallyOpen"
          :items="clients"
          activatable
          item-key="name"
          item-children="projects"
          expand-icon="ri-arrow-drop-down-fill"
          :open-on-click="false"
          :active.sync="active"
          :open.sync="open"
          return-object
        >
          <template v-slot:prepend="{ item, open }">
            <span @click="gotoLink(item)">
              <v-icon v-if="!item.cid" small>
                {{ open ? "ri-folder-open-line" : "ri-folder-line" }}
              </v-icon>
              <Avatar
                v-else
                :username="item.name"
                :size="18"
                class="mr-0"
              ></Avatar>
            </span>
          </template>

          <template v-slot:label="{ item }">
            <span @click="gotoLink(item)">
              {{ item.name }}
            </span>
          </template>

          <template v-slot:append="{ item }">
            <div class="control_block">
              <v-menu
                bottom
                right
                :nudge-width="180"
                offset-x
                offset-y
                :close-on-content-click="false"
                 v-if="authUser.group=='admin'"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on">
                    <v-icon small>ri-more-line</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-app-bar flat height="32px">
                    <v-toolbar-title class="text-body-1 pl-0">
                      {{ !item.cid ? "Client Settings" : "Project Settings" }}
                    </v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn x-small icon  v-if="authUser.group=='admin'">
                      <v-icon small>ri-pencil-line</v-icon>
                    </v-btn>

                    <v-btn x-small icon @click="copylink(item)">
                      <v-icon small>ri-link</v-icon>
                    </v-btn>
                  </v-app-bar>

                  <v-card-text class="px-0 white pb-0">
                    <div class="px-3">
                      <v-btn
                        small
                        block
                        left
                        elevation="0"
                        @click="openDialog(item)"
                         v-if="authUser.group=='admin'"
                      >
                        <v-icon small left>ri-add-line</v-icon>
                        <span> Create new</span>
                        <v-icon small class="ml-auto"
                          >ri-arrow-drop-right-line</v-icon
                        >
                      </v-btn>
                    </div>

                    <v-divider class="mt-4"></v-divider>

                    <v-list dense class="py-0">
                      <v-list-item-group>
                        <v-list-item @click="deleteItem(item)"  v-if="authUser.group=='admin'">
                          <v-list-item-icon>
                            <v-icon small>ri-delete-bin-line</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Delete</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-menu>
              <v-btn icon small @click="openDialog(item)" v-if="authUser.group=='admin'">
                <v-icon small>ri-add-line</v-icon>
              </v-btn>
            </div>
          </template>
        </v-treeview>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="600px">
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
                  v-model="editedItem.name"
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
            :disabled="!editedItem.name"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editdialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">New Client</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  required
                  v-model="editedItem.name"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false"> Close </v-btn>
          <v-btn color="success" text @click="save()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { BroadcastChannel } from "broadcast-channel";
import Avatar from "vue-avatar";
export default {
  name: "ClientList",
  data() {
    return {
      initiallyOpen: ["public"],
      tree: [],
      clients: [],
      open: [],
      dialog: false,
      editdialog: false,
      editedItem: {
        name: "",
      },
      collection: "",
      active: [],
      clicked: false,
      employees: [],
      e6: [],
    };
  },
  components: {
    Avatar,
  },
  computed: {
    authUser() {
      return this.$store.state.localStorage.authUser;
    },
  },
  mounted() {
    this.getClients();
    this.getEmployee();
  },
  watch: {},
  methods: {
    async getEmployee() {
      try {
        this.$axios
          .$post(`/cockpit/listUsers?token=${process.env.aKey}`, {
            filter: { group: "employee" },
          })
          .then((res) => {
              console.log(res)
            this.employees = res;
          });
      } catch (error) {
        console.log("error", error);
      }
    },
    async getClients() {
      try {
        this.$axios
          .$post(`/getclientsnprojects?token=${process.env.cKey}`)
          .then((res) => {
            console.log("clients", res.entries);
            this.clients = res.entries.sort(function(a, b){
              if(a.name.trim() < b.name.trim()) { return -1; }
              if(a.name.trim() > b.name.trim()) { return 1; }

              return 0;
            });

            res.entries.map((a) => {
              if (a.projects.length > 0)
              {
                a.projects.sort(function(c, d){
                  if(c.name.trim() < d.name.trim()) { return -1; }
                  if(c.name.trim() > d.name.trim()) { return 1; }
                  return 0
                })
              }
            })

          });
      } catch (error) {
        console.log("error", error);
      }
    },
    openDialog(data) {
      // console.log("data", data);
      this.clicked = true;
      if (data.projects) {
        this.collection = "projects";
        this.editedItem.cid = {
          _id: data._id,
          link: "clients",
          display: data.name,
        };
        this.dialog = true;
      } else if (data.cid) {
        this.collection = "tasks";
        this.editedItem.pid = {
          _id: data._id,
          link: "projects",
          display: data.name,
        };
        this.dialog = true;
      } else {
        this.collection = "clients";
        this.dialog = true;
      }
    },
    save() {
      this.$axios
        .$post(
          `/collections/save/${this.collection}?token=${this.authUser.api_key}`,
          {
            data: this.editedItem,
          }
        )
        .then((response) => {
          const channel = new BroadcastChannel("actions");
          channel.postMessage({
            name: this.collection,
            action: "reload",
          });
          this.getClients();
          this.dialog = false;
          this.editedItem = { name: "" };
        })
        .catch((error) => {
          this.onerror(error);
        });
    },
    deleteItem(item) {
      if (item.cid) {
        confirm("Are you sure you want to delete this project?") &&
          this.$axios
            .$post(
              `/collections/remove/projects?token=${this.authUser.api_key}`,
              {
                filter: item,
              }
            )
            .then((response) => {
              this.getClients();
            })
            .catch((error) => {
              this.onerror(error);
            });
      } else {
        confirm("Are you sure you want to delete this client?") &&
          this.$axios
            .$post(
              `/collections/remove/clients?token=${this.authUser.api_key}`,
              {
                filter: item,
              }
            )
            .then((response) => {
              this.getClients();
            })
            .catch((error) => {
              this.onerror(error);
            });
      }
    },
    onerror(error) {
      //   console.log(error);
      if (this.$axios.isCancel(error)) {
        console.log("Request canceled", error);
      } else {
        console.log("Error", error);
      }
    },
    async copylink(item) {
      console.log("3");
      let link = "";
      if (item.cid) {
        link = process.env.siteURL + "/projects/" + item._id;
      } else {
        link = process.env.siteURL + "/clients/" + item._id;
      }

      try {
        await this.$copyText(link);
      } catch (e) {
        console.error(e);
      }
    },
    gotoLink(item) {
      console.log("item", item);
      let link = "";
      if (item?.cid) {
        link = "/projects/" + item._id;
      } else {
        link = "/clients/" + item._id;
      }

      this.$router.push(link);
    },
  },
};
</script>

<style>
</style>
