<template>
<div>
</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OidcCallback',
  methods: {
    ...mapActions([
      'oidcSignInCallback',
    ]),
  },
  mounted () {
    this.oidcSignInCallback()
      .then((redirectPath) => {
        this.$router.push(redirectPath)
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err)
        this.$router.push('/auth-error') // Handle errors any way you want
      })
  },
}
</script>
