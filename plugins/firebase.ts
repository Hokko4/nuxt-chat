import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/analytics'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBGMDTh6BW1ZknjeNcMADzPW-QWCJfH67k',
    authDomain: 'my-nuxt-chat-4e318.firebaseapp.com',
    databaseURL: 'https://my-nuxt-chat-4e318.firebaseio.com',
    projectId: 'my-nuxt-chat-4e318',
    storageBucket: 'my-nuxt-chat-4e318.appspot.com',
    messagingSenderId: '133488783417',
    appId: '1:133488783417:web:f42728168d738a86f89de8',
    measurementId: 'G-TM664EX543'
  })
}

export default firebase
