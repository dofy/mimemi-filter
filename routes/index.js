var express = require('express');
var router = express.Router();
var createError = require('http-errors');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MIMEMI Filter' });
});

// create new
router.get('/new', (req, res, next) => {
  next(createError(401, 'Create New One'));
})

// suburl
router.get('/:mid', (req, res, next) => {
  const mid = req.params.mid
  const query = req.query
  next(createError(401, 'Subscribe MId: ' + mid));
})

// edit url
router.get('/:mid/edit', (req, res, next) => {
  const mid = req.params.mid
  const query = req.query
  next(createError(401, 'Edit MId: ' + mid));
})

module.exports = router;
