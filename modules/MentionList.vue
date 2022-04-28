<template>
  <div class="items">
    <template v-if="items.length">
      <div
        class="item"
        :class="{ 'is-selected': index === selectedIndex }"
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(index)"
        min-width="200"
      >
        <User :user="item" />
      </div>
    </template>
    <div class="item" v-else>
      No result
    </div>
  </div>
</template>

<script>
import User from "~/components/useritem.vue";
export default {
  components:{
    User
  },
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },


  },
  data() {
    return {
      selectedIndex: 0,
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }
  console.log(4)
      return false
    },

    upHandler() {
      this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    selectItem(index) {
      const item = this.items[index]
      console.log(item)
      if (item) {
        this.command({ id: item.id, label: item.label })
      }
    },
  },
}
</script>

<style lang="scss">

.items {
  min-width: 200px;
  padding: 0px;
  position: relative;
  border-radius: 0.5rem;
  background: #FFF;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1),
  ;
}

.item {
  display: block;
  margin: 0;
  width: 100%;
  text-align: left;
  background: transparent;
  border-radius: 0;
  border: 1px solid transparent;
  padding: 10px;

  &.is-selected {
    background-color: #eee;
  }
  .d-flex{
    display: flex;
  }
  .justify-start{
    justify-content: flex-start;
  }
  .align-center{
    align-items: center;
  }

  .mr-3{
    margin-right: 0.75rem;
  }
}
</style>