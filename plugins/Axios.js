import https from 'https';
export default function({ $axios, redirect }) {
  $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })
  const agent = new https.Agent({
       rejectUnauthorized: false
     })
  $axios.onRequest(config => {
        config.httpsAgent = agent
    })
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
