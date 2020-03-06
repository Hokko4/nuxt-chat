<template>
  <v-layout
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <transition-group
        name="chat"
        tag="div"
        class="list content"
      >
        <section
          v-for="{ key, name, image, message } in chat"
          :key="key"
          class="item"
        >
          <div class="item-image"><img :src="image"></div>
          <div class="item-detail">
            <div class="item-name">{{ name }}</div>
            <div class="item-message">
              <div
                tag="div"
                :text="message"
              >
              </div>
            </div>
          </div>
        </section>
      </transition-group>

      <form
        action=""
        @submit.prevent="doSend"
        class=""
      >
        <div class="">
          <textarea
            name=""
            id=""
            v-model="input"
            :disabled="!user.uid"
            @keydown.enter.exact.prevent="doSend"
            class=""
          ></textarea>
          <button type="submit">送信</button>
        </div>
      </form>
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
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    childAdded(snap) {
      const message = snap.val()
      this.$data.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      })
      this.$data.scrollBottom()
    },
    doSend() {
      if (this.$data.user.uid && this.$data.input.length) {
        firebase
          .database()
          .ref('message')
          .push(
            {
              message: this.$data.input,
              name: this.$data.user.displayName,
              image: this.$data.user.photoURL
            },
            () => {
              this.$data.input = ''
            }
          )
      }
    }
  }
})
export default class Index extends Vue {
  user: object = {}
  chat: Array<object> = []

  childAdded(): void {}
}
</script>
