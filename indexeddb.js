var
log = console.log.bind(console),
id = function (a) {
  var _ = new Uint32Array(a)
  crypto.getRandomValues(_)
  return Array.prototype.map.call(_, function (a) {
    a = a.toString(16)
    return ['00000000'.slice(a.length), a].join('')
  }).join('')
},
db,
req = indexedDB.open('db'),
put = function (k, v) {
  return new Promise(function (resolve, reject) {
    var req = db.transaction('store', 'readwrite').objectStore('store').put(v, k)

    req.onsuccess = function () { resolve(this.result) }
    req.onerror = function () { reject(this.error) }
  })
},
get = function (k) {
  return new Promise(function (resolve, reject) {
    var req = db.transaction('store').objectStore('store').get(k)

    req.onsuccess = function () { resolve(this.result) }
    req.onerror = function () { reject(this.error) }
  })
},
del = function (k) {
  return new Promise(function (resolve, reject) {
    var req = db.transaction('store', 'readwrite').objectStore('store').delete(k)

    req.onsuccess = function () { resolve(this.result) }
    req.onerror = function () { reject(this.error) }
  })
}

req.onupgradeneeded = function () {
  db = this.result
  db.createObjectStore('store')
  console.info('ObjectStore \'store\' is created.')
}
req.onsuccess = function () {
  db = this.result
}
req.onerror = function () {
  console.error(this.error)
}
