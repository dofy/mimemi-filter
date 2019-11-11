let express = require('express');
let router = express.Router();
let request = require('request')
let URL = require('url')
let QS = require('querystring')

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title });
});

// subscribe
router.get('/sub', (req, res, next) => {
  const data = req.query
  const mimemiUrl = decodeURIComponent(data.murl)
  const qs = QS.parse(URL.parse(mimemiUrl).query)
  const reg = new RegExp(data.exclude.join('|').replace(/\./g, '\\b'), 'i')
  request.get(mimemiUrl, (err, response, body) => {
    console.log(response.headers)
    let type
    if (qs.mu) {
      type = 'base64 txt'
      switch (qs.mu) {
        case 0:
        case 0:
        case 0:
        case 0:
          break;
        default:
          break;
      }
    } else if(qs.clash || qs.clashr) {
      type = 'yaml'
    } else {
      type = 'config'
    }
    res.status(200).json({ type, body })
  })
})

// edit url
router.get('/edit', (req, res, next) => {
  const data = req.query
  res.render('form', {
    // title, data, baseUrl, mimemi, points,
    title, data, points,
    suburl: `${req.protocol}://${req.get('host')}`,
  });
})

module.exports = router;

function base64_encode (str) {
  return Buffer.from(str.toString()).toString('base64');
}

function base64_decode (str) {
  return Buffer.from(str.toString(), 'base64').toString();
}