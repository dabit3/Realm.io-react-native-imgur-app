var rootUrl = 'https://api.imgur.com/3/gallery/t/'
var apiKey = '8f67e5f7e9d739a'

module.exports = {
  get (url) {
  	console.log('rootUrl + url, ', (rootUrl + url))
    return fetch(rootUrl + url, {
      headers: {
        'Authorization': 'Client-ID ' + apiKey
      }
    })
    .then((response) => {
      return response.json()
    })
  }

}