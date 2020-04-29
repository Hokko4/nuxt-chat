import Vue from 'vue'
import ga from '~/plugins/ga'
import firebase from '~/plugins/firebase'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $firebase: typeof firebase
    readonly $auth: firebase.auth.Auth
    readonly $ga: (
      event: string,
      eventParams?: object,
      options?: firebase.analytics.AnalyticsCallOptions
    ) => void
  }
}
