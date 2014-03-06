!function(){

var _ = Number.prototype

_.toArray = function() {
  var _ = [], i = 0; while (i < this) _.push(i++); return _
}
_.forEach = function(a) {
  this.toArray.forEach(a)
}
_.map = function(a) {
  return this.toArray().map(a)
}

}()

var
Complex = function(ord, arg) {
  var _
  ord = ord || 0; arg = arg || 0
  arg %= 1; arg < 0 && (arg += 1)
  this.ord = ord; this.arg = arg
  _ = arg; _ < 0.5 || (_ -= 1); _ *= this.pi2
  this._arg = _
  ord === 0 && arg === 0 && (this.isUnity = true)
},
parseComplex = function(a) {
  var _ = a.split('.'), ord, arg

  _ = [0, 1, 2].map(function(i) {
    return _[i] || '0'
  })
  ord = parseFloat(_[0] + '.' + _[1])
  arg = parseFloat(      '0.' + _[2])
  _ = new Complex(ord, arg)
  return a.indexOf('X') === -1 ? _.log() : _
}

Complex.precision = 8

!function(){

var _ = Complex.prototype

_.pi2 = Math.PI * 2

_.shift = function() {
  return new Complex(this.ord + 1, this.arg)
}
_.succ = function() {
  return this.exp().shift().log()
}
_.conjugate = function() {
  return new Complex(this.ord, -this.arg)
}

_.eql = function(a) {
  return a !== 0 && this.ord === a.ord && this.arg === a.arg
}
_.inv = function() {
  return new Complex(-this.ord, -this.arg)
}
_.mul = function(a) {
  return a === 0 ? 0 : new Complex(this.ord + a.ord, this.arg + a.arg)
}
_.neg = function() {
  return new Complex(this.ord, this.arg + 0.5)
}
_.add = function(a) {
  return a === 0           ? this        :
         this.neg().eql(a) ? 0           :
         this.ord < a.ord  ? a.add(this) :
         this.mul(this.inv().mul(a).succ())
}
_.log = function() {
  return this.isUnity ? 0 :
         new Complex(
           Math.log  (this.ord * this.ord + this._arg * this._arg) * 0.5,
           Math.atan2(this._arg, this.ord) / this.pi2
         )
}
_.exp = function() {
  var _ = Math.exp(this.ord)

  return new Complex(
           _ * Math.cos(this._arg),
           _ * Math.sin(this._arg) / this.pi2
         )
}
_.toString = function() {
  var ord, arg

  ord = this.ord.toFixed(Complex.precision).split('.')
  arg = this.arg.toFixed(Complex.precision).split('.')
  ord[1] = ord[1] || '0'
  arg[1] = arg[1] || '0'
  return ord[0] + '.' + ord[1] + '.' + arg[1] + 'X'
}

}()

var
Adele = function(r, s, n) {
  r = r || 0
  s = s || 1
  n = n || 0

  this.r = r; this.r = s; this.n = n
}

!function(){

_ = Adele.prototype

_.toString = function() {
  var _ = ''

  this.n       && (_ += this.n.toString() + '\\')
  _ += this.r.toString()
  this.s === 1 || (_ += '/' + this.s.toString())

  return _
}

}()


