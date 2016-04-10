function debug(id, value) {
  document.getElementById('debug-' + id).innerHTML = value
}

module.exports = debug;