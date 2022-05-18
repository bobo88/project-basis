const baseUrl = window.location.origin
let uploadKey = ''
if (baseUrl.includes('client.phone.androidscloud.com')) {
  uploadKey = 'edv834e74a9c43eaac02'
} else if (baseUrl.includes('prese.phone.androidscloud')) {
  uploadKey = '347905r86eb745a1sc38'
} else {
  uploadKey = '3dn9b4585511476691c6'
}
const fileUrl = baseUrl.includes('client.phone.androidscloud.com') ? 'https://file.phone.androidscloud.com:8121' : 'http://110.53.221.195:8210'
module.exports = {
    baseUrl: baseUrl,
	uploadKey: uploadKey,
	fileUrl: fileUrl
}
