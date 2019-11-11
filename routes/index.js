let express = require('express');
let router = express.Router();
let request = require('request')
let URL = require('url')
let QS = require('querystring')

const title = 'MIMEMI Filter'
// const baseUrl = 'https://suburl.mimemi.net/link/'
// const mimemi = {
//   'SSR': [
//     { title: 'SSR', value: 'mu=0', },
//     { title: 'SSR 995', value: 'mu=1', },
//     { title: 'ClashR', value: 'clashr=1', },
//   ],
//   'SS': [
//     { title: 'SSD', value: 'mu=3', },
//     { title: 'SS', value: 'mu=4', },
//     { title: 'Surge 2', value: 'surge=2', },
//     { title: 'Surge 3', value: 'surge=3', },
//     { title: 'Clash', value: 'dns=1&clash=1', },
//     { title: 'Surfboard', value: 'surfboard=1', },
//   ],
// }
const points = [
  { title: 'V0', value: 'V0', },
  { title: 'V1', value: 'V1', },
  { title: 'V2', value: 'V2', },
  { title: 'V3', value: 'V3', },
  { title: 'V4', value: 'V4', },
  { title: '回国', value: '回国', },
  { title: '中转', value: '中转', },
  { title: '特殊用途', value: '特殊用途', },
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title });
});

// create new
router.get('/sub', (req, res, next) => {
  const data = req.query
  const mimemiUrl = decodeURIComponent(data.murl)
  const url = URL.parse(mimemiUrl)
  const qs = QS.parse(url.query)
  console.log(mimemiUrl, qs)
  request.get(mimemiUrl, (err, response, body) => {
    // console.log(err, body)
  })

  res.status(200).json(data)
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
