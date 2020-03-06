<template>
  <v-layout justify-center align-center>
    <v-flex>
      <transition-group name="chat" tag="div" class="comment">
        <div
          v-for="{ key, name, image, message } in chat"
          :key="key"
          class="comment__item"
        >
          <div class="comment__item-image">
            <img :src="image" class="" />
          </div>
          <div class="comment__item-detail">
            <div class="comment__item-name">{{ name }}</div>
            <div class="comment__item-message">
              <div class="">{{ message }}</div>
            </div>
          </div>
        </div>
      </transition-group>

      <form action="" @submit.prevent="doSend" class="chatform">
        <div class="chatform__inner">
          <textarea
            v-model="input"
            :disabled="!user.uid"
            @keydown.enter.exact.prevent="doSend"
            class="chatform__textarea"
          ></textarea>
          <button type="submit" :disabled="!user.uid" class="chatform__btn">
            送信
          </button>
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
  created() {
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
          this.$nextTick(() => {
            window.scrollTo(0, document.body.offsetHeight)
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
          this.$nextTick(() => {
            window.scrollTo(0, document.body.offsetHeight)
          })
        })
      }
    })
  },
  methods: {
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
        this.$nextTick(() => {
          window.scrollTo(0, document.body.offsetHeight)
        })
      }
    }
  }
})
export default class Index extends Vue {
  user: object = {}
  chat: Array<object> = []
}
</script>

<style lang="scss" scoped>
.chatform {
  width: 100%;
}
.chatform__inner {
  display: flex;
  align-items: flex-end;
}
.chatform__textarea {
  flex: 1 1 80%;
  height: 80px;
  padding: 10px;
  border: 1px solid #848688;
  border-radius: 5px;
  background: #222529;
  outline: none;
}
.chatform__btn {
  margin-left: 10px;
  padding: 15px;
  border-radius: 5px;
  background: #60af9d;
  line-height: 1;
  outline: none;

  &:disabled {
    background: #35373b;
  }
}
.chat-enter-active {
  transition: all 1s;
}
.chat-enter {
  opacity: 0;
  transform: translateX(-1em);
}
</style>
