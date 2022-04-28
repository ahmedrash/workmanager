<template>
  <div class="d-flex justify-start align-center">
     <ProfileAvatar :size="32" class="mr-3 d-inline" :item="userdata" /> <span>{{userdata.name}}</span>
  </div>
</template>

<script>
import ProfileAvatar from "~/components/profilepicturemention.vue";
export default {
  props: ["user"],
  components: {
    ProfileAvatar,
  },
  data() {
    return {
      userdata: {},
    };
  },
  mounted() {
    if (this.user.id) {
      this.userdata = this.user
      this.getUser()
    }
  },
  methods: {
    async getUser() {
        this.userdata = this.user
    },
  },
};
</script>