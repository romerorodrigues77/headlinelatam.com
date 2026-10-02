// CloudFront Function, viewer-response: keep the *.cloudfront.net preview host out of search results.
function handler(event) {
  var res = event.response;
  var host = event.request.headers.host ? event.request.headers.host.value : '';
  if (host.indexOf('cloudfront.net') !== -1) {
    res.headers['x-robots-tag'] = { value: 'noindex, nofollow' };
  }
  return res;
}
