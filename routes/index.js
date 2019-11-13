const createError = require('http-errors');
const express = require('express');
const request = require('request')
const util = require('util')
const yaml = require('yaml')
const ini = require('ini')
const URL = require('url')
const QS = require('querystring')

const router = express.Router();

const title = 'MIMEMI Filter'
const points = [
  { title: 'V0', value: '.V0.', },
  { title: 'V1', value: '.V1.', },
  { title: 'V2', value: '.V2.', },
  { title: 'V3', value: '.V3.', },
  { title: 'V4', value: '.V4.', },
  { title: '回国', value: '回国', },
  { title: '中转', value: '中转', },
  { title: '特殊用途', value: '特殊用途', },
]

// edit url
router.get('/', (req, res, next) => {
  const host = req.host
  const data = req.query
  res.render('form', {
    // title, data, baseUrl, mimemi, points,
    title, host, data, points,
    suburl: `${req.protocol}://${req.get('host')}`,
  });
})

// subscribe
router.get('/sub', (req, res, next) => {
  const data = req.query
  const mimemiUrl = decodeURIComponent(data.murl)
  const mimemiType = getMimemiType(mimemiUrl)

  if (mimemiType === 0) {
    // wrong url
    next(createError(404, 'MIMEMI Subscribe URL is wrong.'))
  } else if (!data.exclude) {
    // redirect
    res.redirect(mimemiUrl)
  } else {
    // filter
    let excludeReg = new RegExp((util.isArray(data.exclude) ? data.exclude.join('|') : data.exclude).replace(/\./g, '\\b'), 'i')
    request.get(mimemiUrl, (err, response, body) => {
      const PG = 'Proxy Group'
      let type = 'base64'
      switch (mimemiType) {
        case 'ssr':
        case 'ssr995':
        case 'ss':
          body = base64_decode(body).trim().split(/\s+/)
          body = body.filter( url => ssrParser(url, excludeReg) )
          body = base64_encode(body.join('\n'))
          break
        case 'ssd':
          break
        case 'clash':
          type = 'yaml'
          body = yaml.parse(body)
          body.Proxy = body.Proxy.filter(proxy => !excludeReg.test(proxy.name))
          body[PG].map(item => {
            item.proxies = item.proxies.filter(name => !excludeReg.test(name))
          })
          body = yaml.stringify(body)
          break
        case 'surge':
          type = 'ini'
          let lineOne = body.split('\n')[0].trim()
          console.log(lineOne)
          body = ini.parse(body)
          Object.keys(body.Proxy).map(key => {
            if (excludeReg.test(key)) {
              delete body.Proxy[key]
            }
          })
          Object.keys(body[PG]).map(key => {
            body[PG][key] = body[PG][key]
                              .split(',')
                              .filter(name => !excludeReg.test(name))
                              .join()
          })
          body = [lineOne, ini.stringify(body)].join('\n')
          break
        default: break
      }
      res.header(response.headers)
      res.status(200).send(body)
      // res.status(200).json({ type, body })
    })
  }
})

module.exports = router;

function base64_encode (str) {
  return Buffer.from(str).toString('base64')
}

function base64_decode (str) {
  return Buffer.from(str, 'base64').toString()
}

function ssrParser (url, reg) {
  let urlObj = URL.parse(url)
  let checkStr
  if (urlObj.protocol === 'ssr:') {
    urlObj = URL.parse('//' + base64_decode(url.replace(urlObj.protocol + '//', '')))
    qs = QS.parse(urlObj.query)
    checkStr = base64_decode(qs.remarks)
  } else {
    checkStr = decodeURIComponent(urlObj.hash)
  }
  return !reg.test(checkStr)
}

function getMimemiType (url) {
  const qs = QS.parse(URL.parse(url).query)
  let mimemiType
  if (qs.mu) {
    switch (qs.mu) {
      case '0':
        mimemiType = 'ssr'
        break
      case '1':
        mimemiType = 'ssr995'
        break
      case '3':
        mimemiType = 'ssd'
        break
      case '4':
        mimemiType = 'ss'
        break
      default:
        mimemiType = 0
        break
    }
  } else if(qs.clash || qs.clashr) {
    // clash
    mimemiType = 'clash'
  } else if(qs.surge || qs.surfboard) {
    // sruge
    mimemiType = 'surge'
  } else {
    mimemiType = 0
  }
  return mimemiType
}