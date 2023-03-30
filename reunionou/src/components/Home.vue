<template>
  <div>
    <h3>{{ pageToken }}</h3>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomePage',
  computed: {
    ...mapState(['token']),
    pageToken() {
      return this.token;
    }
  }
}
</script>
