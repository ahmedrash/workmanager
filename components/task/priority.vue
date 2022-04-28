<template>
    <div class="priority_item">
    <v-menu offset-y :close-on-content-click="false" open-on-hover :open-delay="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          icon
          plain
          text
          class="active"
        >
          <v-icon x-small :color="selected&&selected.text!='Clear'?selected.color:'gray'">{{selected&&selected.text!='Clear'?selected.icon:'ri-flag-2-line'}}</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item link v-for="(state, i) in status" :key="'option_'+i" @click="updateStatus(state)">
          <v-list-item-icon>
            <v-icon :color="state.color" x-small>{{state.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{state.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    </div>
</template>

<script>
export default {
    props: ["selectedstate", "id", "readonly", "authUser", "collection"],
    data(){
        return {
            selected: '',
            status: [
                {text: 'Urgent', color: 'error', icon: 'ri-flag-2-fill'},
                {text: 'High', color: 'warning', icon: 'ri-flag-2-fill'},
                {text: 'Normal', color: 'info', icon: 'ri-flag-2-fill'},
                {text: 'Low', color: 'gray', icon: 'ri-flag-2-fill'},
                {text: 'Clear', color: 'error', icon: 'ri-close-line'}
            ]
        }
    },
    watch: {
    selectedstate(val) {
      //console.log(val);
      this.updateonload(val)
    },
  },
    created(){
    this.updateonload()
  },
    methods:{
        updateonload(){
          if(this.selectedstate){
              this.selected = this.status.filter(e=>{
                return e.text == this.selectedstate
              })[0]
          }
      },
        updateStatus(state){
            this.selected = state
            this.updateCollection(this.selected, this.id, this.collection)
        },
        updateCollection(data, id, col){
        let item = {
            _id: id,
            priority: data.text
        }
        this.$axios.$post(`/collections/save/${col}?token=${this.authUser.api_key}`,{
        data: item
      })
      .then(response => {
        // const channel = new BroadcastChannel("assigned");
        //   channel.postMessage(item);
      })
      .catch(error => {
        this.onerror(error)
      })
    }
    }
}
</script>

<style>
.priority_item .v-btn__content{
  opacity: 1 !important;
}
</style>