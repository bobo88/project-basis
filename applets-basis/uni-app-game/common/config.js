const baseUrl = window.location.origin
let uploadKey = ''
if (baseUrl.includes('xxxxxx.com')) {
  uploadKey = 'xsss'
} else if (baseUrl.includes('agagoud')) {
  uploadKey = 'sgasg'
} else {
  uploadKey = 'asdgfasg'
}
const fileUrl = baseUrl.includes('xxxxxx.com') ? 'https://afdgadsgm:8121' : 'http://11.195:8210'
module.exports = {
    baseUrl: baseUrl,
	uploadKey: uploadKey,
	fileUrl: fileUrl
}
