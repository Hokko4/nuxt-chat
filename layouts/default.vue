<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <div class="user-prof">
        <div class="user-prof__login" v-if="user.uid" key="login">
          <button type="button" @click="doLogout">ログアウト</button>
          <img :src="user.photoURL" class="" />
        </div>
        <div v-else key="logout" class="user-prof__logout">
          <button type="button" @click="doLogin">ログイン</button>
        </div>
      </div>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2020 Hokko4</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from '~/plugins/firebase'
import auth from '~/plugins/auth'

@Component({
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Chat',
      user: {}
    }
  },
  created() {
    auth().then(user => {
      this.$data.user = user ? user : {}
    })
  },
  methods: {
    doLogin() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    doLogout() {
      firebase.auth().signOut()

      const rMsg = firebase.database().ref('message')
      rMsg.limitToLast(10).off('child_added', snap => {
        const message = snap.val()
        this.$data.chat.push({
          key: snap.key,
          name: message.name,
          image: message.image,
          message: message.message
        })
      })

      location.reload()
    }
  }
})
export default class Default extends Vue {}
</script>

<style lang="scss" scoped>
.user-prof {
  margin-left: auto;
}

.user-prof__login {
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
    margin-left: 10px;
    border-radius: 50%;
  }
}

.user-prof__logout {
  display: flex;
}
</style>
