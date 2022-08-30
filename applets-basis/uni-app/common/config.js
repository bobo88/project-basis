const baseUrl = window.location.origin
let uploadKey = ''
if (baseUrl.includes('cfff')) {
  uploadKey = 'fffff'
} else if (baseUrl.includes('fffff')) {
  uploadKey = 'xxx'
} else {
  uploadKey = 'xxx'
}
const fileUrl = baseUrl.includes('cggggm') ? 'https://gagaga.com:8121' : 'http://1234:8210'
module.exports = {
    baseUrl: baseUrl,
	uploadKey: uploadKey,
	fileUrl: fileUrl
}
