<template>
  <div class="assigned_block">
    <span
      v-for="(data, i) in assigned"
      :key="'d' + data"
      :class="'assigned_item zind_' + i"
    >
      <v-badge
        :color="getEmployee(data).status"
        dot
        offset-x="10"
        offset-y="10"
        bordered
      >
        <v-icon small class="close" @click="removeEmployee(data)"
           v-if="!readonly">ri-close-line</v-icon
        >
        <ProfileAvatar :size="size" class="assigned" :item="getEmployee(data)" />
      </v-badge>
    </span>

    <v-menu bottom offset-y v-if="!readonly">
      <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs"
            v-on="on">
        <v-hover v-slot="{ hover }">
          <v-badge
            offset-x="15"
            offset-y="15"
            bottom
            overlap
            color="white"
            class="asigned_menu"
            
          >
            <template v-slot:badge>
              <v-icon
                small
                :color="hover ? 'success' : 'grey lighten-2'"
                class="mb-1"
                >ri-add-circle-fill</v-icon
              >
            </template>

            <v-btn
              outlined
              icon
              :color="hover ? 'success' : 'grey lighten-2'"
              small
            >
              <v-icon small>ri-team-line</v-icon>
            </v-btn>
          </v-badge>
        </v-hover>
        </span>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, i) in filteredEmplyees()"
          :key="i"
          @click="addEmployee(item)"
        >
          <ProfileAvatar :size="size" class="assigned mr-3" :item="item" />
          <v-list-item-content>
            <v-list-item-title v-html="item.name"></v-list-item-title>
            <v-list-item-subtitle v-html="item.group"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { BroadcastChannel } from "broadcast-channel";
import ProfileAvatar from "~/components/profilepicture.vue";
export default {
  props: ["employees", "assignedemp", "id", "collection", "readonly", "size", "authUser"],
  components: {
    ProfileAvatar,
  },
  data() {
    return {
      tempemployees: [],
      assigned: [],
      name: "Midnight Crew",
      title: "The summer breeze",
    };
  },
    created(){
    this.updateonload()
  },
  watch: {
    assigned(val) {},
  },
  methods: {
      updateonload(){
          if(this.assignedemp){
              this.assigned = this.assignedemp
          }
      },
    remove(item) {
      const index = this.assigned.indexOf(item.name);
      if (index >= 0) this.assigned.splice(index, 1);
    },
    getEmployee(id) {
      if (this.employees) {
        let item = this.employees.filter((e) => {
          return e._id == id;
        });

        return item[0];
      } else {
        return [];
      }
    },
    addEmployee(item) {
      this.assigned.push(item._id);
      let data = {
        by: {_id: this.authUser._id, display: this.authUser.name, link: 'accounts'},
        mention: [{id:item._id, label: ''}],
        message: 'assigned you to this '+this.collection,
        tid: {_id: this.id, display: '', link: this.collection},
        collection: this.collection
      }

      this.updateCollection(this.assigned, this.id, this.collection)
      if(this.authUser._id != item._id){
        this.sendemail(data)
      }
      
    },
    filteredEmplyees() {
      if (this.employees) {
        let emp = this.employees.filter((e) => {
          return !this.assigned.includes(e._id);
        });
        return emp;
      } else {
        return [];
      }
    },
    removeEmployee(data) {
      const index = this.assigned.indexOf(data);
      if (index > -1) {
        this.assigned.splice(index, 1);
      }
    },
    updateCollection(data, id, col){
        let item = {
            _id: id,
            assigned: data
        }
        this.$axios.$post(`/collections/save/${col}?token=${this.authUser.api_key}`,{
        data: item
      })
      .then(response => {
        const channel = new BroadcastChannel("assigned");
          channel.postMessage(item);
      })
      .catch(error => {
        this.onerror(error)
      })
    },
     sendemail(data){
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

<style scoped>
.assigned_item:not(:first-child) {
  margin-left: -16px !important;
}

.assigned_item {
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.assigned_item:hover {
  z-index: 12;
}

.zind_0 {
  z-index: 11;
}
.zind_1 {
  z-index: 10;
}
.zind_2 {
  z-index: 9;
}
.zind_3 {
  z-index: 8;
}
.zind_4 {
  z-index: 7;
}
.zind_5 {
  z-index: 6;
}
.zind_6 {
  z-index: 5;
}
.zind_7 {
  z-index: 4;
}
.zind_8 {
  z-index: 3;
}
.zind_9 {
  z-index: 2;
}
.zind_10 {
  z-index: 1;
}

.close {
  position: absolute;
  top: -3px;
  right: -3px;
  z-index: 20000;
  background-color: #fff;
  border-radius: 9px;
  color: #ef3d59;
  opacity: 0;
  transition: all 0.3s;
}

.assigned_item:hover .close {
  opacity: 1;
}

.v-badge {
  border: 2px solid #fff;
  border-radius: 50%;
  /* box-sizing: border-box; */
}

.asigned_menu {
  margin-left: -16px;
}

.asigned_menu .v-btn--outlined {
  border-style: dashed;
}
</style>