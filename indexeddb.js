var log = console.log.bind(console)
, id = (a) =>
Array.from(crypto.getRandomValues(new Uint8Array(a)))
.map(a => a + 0x100).map(a => a.toString(0x10).slice(1))
.join('')
, db
, req = indexedDB.open('db')
, put = (k, v) =>
new Promise((f, r) => {
  var req = db.transaction('store', 'readwrite').objectStore('store').put(v, k)
  req.onsuccess = () => f(req.result)
  req.onerror = () => r(req.error)
})
, get = (k) =>
new Promise((f, r) => {
  var req = db.transaction('store').objectStore('store').get(k)
  req.onsuccess = () => f(req.result)
  req.onerror = () => r(req.error)
})
, del = (k) =>
new Promise((f, r) => {
  var req = db.transaction('store', 'readwrite').objectStore('store').delete(k)
  req.onsuccess = () => f(req.result)
  req.onerror = () => r(req.error)
})

req.onupgradeneeded = () => {
  db = req.result
  db.createObjectStore('store')
  console.info('ObjectStore \'store\' is created.')
}
req.onsuccess = () => {
  db = req.result
  console.info('success: indexedDB.open(\'db\')')
}
req.onerror = () => {
  console.error('error: indexedDB.open(\'db\')')
  console.error(req.error)
}
