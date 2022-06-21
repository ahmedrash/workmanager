
    importScripts(
      'https://www.gstatic.com/firebasejs/9.8.3/firebase-app-compat.js'
    )
    importScripts(
      'https://www.gstatic.com/firebasejs/9.8.3/firebase-messaging-compat.js'
    )
    firebase.initializeApp({"apiKey":"AIzaSyAwTXndTLOu0VyObDK5k-fTUqW9XEeg_tw","authDomain":"sdtest-project.firebaseapp.com","projectId":"sdtest-project","storageBucket":"sdtest-project.appspot.com","messagingSenderId":"1065175353247","appId":"1:1065175353247:web:1bc7e3e9b448f89982dfaa"})

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    const messaging = firebase.messaging()

    // messaging.onBackgroundMessage(function(payload) {
    //   console.log('[firebase-messaging-sw.js] Received background message ', payload)
    //   // Customize notification here
    //   const notificationTitle = 'Background Message Title'
    //   const notificationOptions = {
    //     body: 'Background Message body.',
    //     icon: '/firebase-logo.png'
    //   }

    //   return self.registration.showNotification(notificationTitle,
    //     notificationOptions)
    // })

    