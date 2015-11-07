var koa = require('koa');
var app = koa();
var sendfile = require('koa-sendfile');
var serve = require('koa-static');
var nunjucks = require('koa-nunjucks-render');


app.use(serve('public'));

app.use(nunjucks('views', {
  ext: '.html',
  noCache: !process.env.NODE_ENV || process.env.NODE_ENV == 'development',
  throwOnUndefined: true,
  filters: {
    json: function(str) {
      return JSON.stringify(str, null, 2);
    }
  },
  globals: {
  }
}));


var counts = {};

app.use(function*() {

  if (counts[this.path]) {
    counts[this.path]++;
  } else {
    counts[this.path] = 1;
  }

  var counter = counts[this.path];


  yield this.render('index', {
    counter: counter,
    page: this.path
  });

});

var port = process.env.PORT || 7000;

app.listen(port, function() {
  console.log('Listening on port: ', port);
});
