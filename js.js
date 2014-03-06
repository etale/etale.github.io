!function(){

var _ = Number.prototype

_.divmod = function(a) {
  var q, r

  if (a === 0) {
    return [0, this.valueOf()]
  }

  r = this % a; q = (this - r) / a
  return [q, r]
}
_.div =function(a) {
  return this.divmod(a)[0]
}
_.mod =function(a) {
  return this.divmod(a)[1]
}
_.gcd = function(a) {
  var _ = this.valueOf(), __

  while (a !== 0) {
    __ = [a, _ % a]
    _ = __[0]
    a = __[1]
  }
  return _
}
_.lcm = function(a) {
  return this * a / this.gcd(a)
}
_.inv = function(a) {
  var _ = this, x = 1, z = 0, __, q, r
  while (a !== 0) {
    __ = _.divmod(a)
    q = __[0]; r = __[1]
    __ = [a, r, z, x - q * z]
    _ = __[0]; a = __[1]; x = __[2]; z = __[3]
  }
  return x
}
_.unit = function() {
  return this < 0 ? -1 : 1
}
_.body = function() {
  return Math.abs(this)
}
_.ub = function(a) {
  var u = this.valueOf(), b = 1, _
  a = a || 0
  if (a === 0) {
    return [this.unit(), this.body()]
  }
  while (true) {
    _ = u.gcd(a)
    if (_ === 1) {
      break
    }
    u = u / _
    b = b * _
  }
  return [u, b]
}

_.toArray = function() {
  var _ = [], i = 0; while (i < this) _.push(i++); return _
}
_.forEach = function(a) {
  this.toArray().forEach(a)
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
  var _, u

  r = r || 0
  s = s || 1
  n = n || 0

  ｎ = n.body()
  _ = s.ub(n); u = _[0]; s = _[1]
  r = (r * u.inv(n)).mod(n * s)

  this.r = r; this.s = s; this.n = n
}

!function(){

_ = Adele.prototype

//  def finalize
//    return if n.unity? or s.zero?
//    _ = r.gcd s
//    _r = r.div _
//    _s = s.div _
//    return _r if n.zero? and _s.unity?
//    get n, _r, _s
//  end

_.finalize = function() {
  var _, _r, _s

  if (this.n === 1 || this.s === 0) {
    return null
  }

  _ = this.r.gcd(this.s)
  _r = this.r.div(_)
  _s = this.s.div(_)

  if (this.n === 0 && _s === 1) {
    return _r
  }

  return new Adele(_r, _s, this.n)
}

_.coerce = function(a) {
  var _, __, _n, _u, _s, au, as, s_, _r, ar

  _ = this
  _n = _.n.gcd(a.n)
  __ = _.s.ub(_n); _u = __[0]; _s = __[1]
  __ = a.s.ub(_n); au = __[0]; as = __[1]
  s_ = _s.lcm(as)
  _r = _.r * _u.inv(_n) * s_.div(_s)
  ar = a.r * au.inv(_n) * s_.div(as)
  _ = new Adele(_r, s_, _n)
  a = new Adele(ar, s_, _n)

  return [a, _]
}
_.eql = function(a) {
  return this.n == a.n && this.r === a.r && this.s === a.s
}
_.neg = function() {
  return new Adele(-this.r, this.s, this.n)
}
_.res = function() {
  var _, u, _n
  // return if unit? in ruby
  _ = this.r.ub(this.n); u = _[0], _n = _[1]
  return new Adele(0, 1, _n)
}
_.add = function(a) {
  return this._add(a).finalize()
}
_._add = function(a) {
  var _ = this.coerce(a)
  return _[0].__add(_[1])
}
_.__add = function(a) {
  return new Adele(this.r + a.r, this.s, this.n)
}
_.inv = function() {
  var _r, _s, __, u
  __ = this.r.ub(this.n); u = __[0]; _s = __[1]
  _r = this.s * u.inv(this.n)
  return new Adele(_r, _s, this.n)
}
_.mul = function(a) {
  return this._mul(a).finalize()
}
_._mul = function(a) {
  var _ = this.coerce(a)
  return _[0].__mul(_[1])
}
_.__mul = function(a) {
  return new Adele(this.r * a.r, this.s * a.s, this.n)
}

_.toString = function() {
  var _ = ''

  this.n === 0 || (_ +=       this.n.toString() + '\\')
                   _ +=       this.r.toString()
  this.s === 1 || (_ += '/' + this.s.toString())

  return _
}

}()
