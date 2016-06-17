
function route(handle, pathname, response, request) {
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    handle['static'](pathname, response);
  }
}

exports.route = route;