import firebase from '~/plugins/firebase'

export default (_: any, inject: (name: string, v: any) => any) => {
  inject('firebase', firebase)
  inject('auth', firebase.auth())
  inject(
    'ga',
    (
      event: string,
      eventParams: object,
      options: firebase.analytics.AnalyticsCallOptions
    ) => {
      if (process.env.NODE_ENV === 'production') {
        firebase.analytics().logEvent(event, eventParams, options)
      } else {
        console.log('[debug] analytics', event, eventParams, options)
      }
    }
  )
}
