<template>
    <div class="float-left status_item">
    <v-menu offset-y :close-on-content-click="false" open-on-hover :open-delay="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          icon
          plain
          text
        >
          <v-icon x-small :color="selected.color">ri-checkbox-blank-fill</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item link v-for="(state, i) in status" :key="'option_'+i" @click="updateStatus(state)">
          <v-list-item-icon>
            <v-icon :color="state.color" x-small>ri-checkbox-blank-fill</v-icon>
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
    props: ["selectedstate", "id", "readonly", "authUser"],
    data(){
        return {
            selected: '',
            status: [
                {text: 'TO DO', color: 'grey'},
                {text: 'PROJECT DECLINED', color: 'error'},
                {text: 'COMPLETE', color: 'success'}
            ]
        }
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
            this.updateCollection(this.selected, this.id, 'tasks')
        },
        updateCollection(data, id, col){
        let item = {
            _id: id,
            state: data.text
        }
        this.$axios.$post(`/collections/save/${col}?token=${this.authUser.api_key}`,{
        data: item
      })
      .then(response => {
        this.$emit('statechange', true)
      })
      .catch(error => {
        this.onerror(error)
      })
    }
    }
}
</script>

<style>
.status_item .v-btn__content{
  opacity: 1 !important;
}
</style>