var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const message = req.session.message || [];
  if (req.session.message != undefined) req.session.message = undefined;
  res.render('index', { title: 'Express' });
});

module.exports = router;
