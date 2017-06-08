const https = require('https')
const url = require('url')
const slack = url.parse(process.env.SLACKWEBHOOK)
slack.method = 'POST'
slack.headers = {
  'Content-Type': 'application/json'
}

module.exports.postprocess = (event, context, cb) => {
  event.Records.forEach(record => {
    const filename = record.s3.object.key
    const filesize = record.s3.object.size

    const req = https.request(slack, res => {
      if (res.statusCode === 200) {
        cb(null, 'posted to slack')
      } else {
        cb(`status code: ${res.statusCode}`)
      }
    })

    req.on('error', e => {
      cb(e.message)
    })

    req.write(JSON.stringify({text: `New object has been created: ${filename} (${filesize} bytes)`}))
    req.end()
  })
}