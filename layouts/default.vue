<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
      title: 'Nuxt Chat',
      user: {}
    }
  },
  mounted() {
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
      location.reload()
    }
  }
})
export default class Index extends Vue {
  user: object = {}
}
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
  }
}

.user-prof__logout {
  display: flex;
}
</style>
