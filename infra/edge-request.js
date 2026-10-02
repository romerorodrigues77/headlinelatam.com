// CloudFront Function, viewer-request: one canonical host and clean URLs.
var CANONICAL = 'headlinelatam.com';

function qs(q) {
  var parts = [];
  for (var k in q) {
    var v = q[k];
    if (v.multiValue) v.multiValue.forEach(function (m) { parts.push(k + '=' + m.value); });
    else parts.push(v.value === '' ? k : k + '=' + v.value);
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: location }, 'cache-control': { value: 'max-age=3600' } }
  };
}

function handler(event) {
  var req = event.request;
  var host = req.headers.host ? req.headers.host.value : '';

  // www and any other alias go to the apex. The *.cloudfront.net preview host is left alone.
  if (host !== CANONICAL && host.indexOf('cloudfront.net') === -1) {
    return redirect('https://' + CANONICAL + req.uri + qs(req.querystring));
  }

  // /index.html and /foo/index.html collapse to the directory URL
  if (req.uri.slice(-11) === '/index.html') {
    return redirect('https://' + host + req.uri.slice(0, -10) + qs(req.querystring));
  }

  // Directory URLs serve their index.html (for future sub-pages such as /pt/)
  if (req.uri.slice(-1) === '/') req.uri += 'index.html';
  else if (req.uri.split('/').pop().indexOf('.') === -1) return redirect('https://' + host + req.uri + '/' + qs(req.querystring));

  return req;
}
