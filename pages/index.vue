<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="test" v-if="user.uid" key="login">
        {{ user.displayName }}
        <button type="button" @click="doLogout">ログアウト</button>
      </div>
      <div v-else key="logout">
        <button type="button" @click="doLogin">ログイン</button>
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from '~/plugins/firebase'
import auth from '~/plugins/auth'

@Component({
  components: {
    Logo: () => import('~/components/Logo.vue'),
    VuetifyLogo: () => import('~/components/VuetifyLogo.vue')
  },
  data() {
    return {
      user: {},
      chat: [],
      input: ''
    }
  },
  created() {},
  mounted() {
    auth().then(user => {
      this.$data.user = user ? user : {}
      const rMsg = firebase.database().ref('message')
      if (user) {
        this.$data.chat = []
        rMsg.limitToLast(10).on('child_added', snap => {
          const message = snap.val()
          this.$data.chat.push({
            key: snap.key,
            name: message.name,
            image: message.image,
            message: message.message
          })
        })
      } else {
        rMsg.limitToLast(10).off('child_added', snap => {
          const message = snap.val()
          this.$data.chat.push({
            key: snap.key,
            name: message.name,
            image: message.image,
            message: message.message
          })
        })
      }
    })
  },
  methods: {
    doLogin() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    doLogout() {
      firebase.auth().signOut()
    },
    childAdded(snap) {
      const message = snap.val()
      this.$data.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      })
      // this.scrollBottom()
    }
  }
})
export default class Index extends Vue {
  user: object = {}
  chat: Array<object> = []

  childAdded(): void {}
}
</script>
