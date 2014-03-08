!function () {

var _ = Number.prototype

_.divmod = function (a) {
  var _ = this, q, r

  if (a === 0) {
    return [0, _.valueOf()]
  }

  r = _ % a; r < 0 && (r += a)
  q = (_ - r) / a
  return [q, r]
}
_.div =function (a) {
  return this.divmod(a)[0]
}
_.mod =function (a) {
  return this.divmod(a)[1]
}
_.gcd = function (a) {
  var _ = this.valueOf(), __

  while (a !== 0) {
    __ = [a, _ % a]; _ = __[0]; a = __[1]
  }
  return _
}
_.lcm = function (a) {
  var _ = this

  return _ * a / _.gcd(a)
}
_.inv = function (a) {
  var _ = this, x = 1, z = 0, __, q, r

  while (a !== 0) {
    __ = _.divmod(a); q = __[0]; r = __[1]
    __ = [a, r, z, x - q * z]
    _ = __[0]; a = __[1]; x = __[2]; z = __[3]
  }
  return x
}
_.unit = function () {
  return this < 0 ? -1 : 1
}
_.body = function () {
  return Math.abs(this)
}
_.ub = function (a) {
  var _ = this.valueOf(), b = 1, d

  a = a || 0
  if (_ * a === 0) {
    return [_.unit(), _.body()]
  }
  while (true) {
    d = _.gcd(a)
    if (d === 1) {
      break
    }
    _ /= d; b *= d
  }
  return [_, b]
}

_.toArray = function () {
  var _ = [], i = 0; while (i < this) _.push(i++); return _
}
_.forEach = function (a) {
  this.toArray().forEach(a)
}
_.map = function (a) {
  return this.toArray().map(a)
}

}()

var
Complex = function (ord, arg) {
  var _ = this, __

  ord = ord || 0; arg = arg || 0
  arg %= 1; arg < 0 && (arg += 1)
  _.ord = ord; _.arg = arg
  __ = arg; __ < 0.5 || (__ -= 1); __ *= this.pi2
  _._arg = __
  ord === 0 && arg === 0 && (_.isUnity = true)
},
parseComplex = function (a) {
  var _ = a.split('.'), ord, arg

  _ = [0, 1, 2].map(function (i) {
    return _[i] || '0'
  })
  ord = parseFloat(_[0] + '.' + _[1])
  arg = parseFloat(      '0.' + _[2])
  _ = new Complex(ord, arg)
  return a.indexOf('X') === -1 ? _.log() : _
}

Complex.precision = 8

!function () {

var _ = Complex.prototype

_.pi2 = Math.PI * 2

_.shift = function () {
  var _ = this

  return new Complex(_.ord + 1, _.arg)
}
_.succ = function () {
  return this.exp().shift().log()
}
_.conjugate = function () {
  var _ = this

  return new Complex(_.ord, -_.arg)
}

_.eql = function (a) {
  var _ = this

  return a !== 0 && _.ord === a.ord && _.arg === a.arg
}
_.inv = function () {
  var _ = this

  return new Complex(-_.ord, -_.arg)
}
_.mul = function (a) {
  var _ = this

  return a === 0 ? 0 : new Complex(_.ord + a.ord, _.arg + a.arg)
}
_.neg = function () {
  var _ = this

  return new Complex(_.ord, _.arg + 0.5)
}
_.add = function (a) {
  var _ = this

  return a === 0        ? _        :
         _.neg().eql(a) ? 0        :
         _.ord < a.ord  ? a.add(_) :
         _.mul(_.inv().mul(a).succ())
}
_.log = function () {
  var _ = this

  return _.isUnity ? 0 :
         new Complex(
           Math.log  (_.ord * _.ord + _._arg * _._arg) * 0.5,
           Math.atan2(_._arg, _.ord) / _.pi2
         )
}
_.exp = function () {
  var _ = this, __ = Math.exp(_.ord)

  return new Complex(
           __ * Math.cos(_._arg),
           __ * Math.sin(_._arg) / _.pi2
         )
}
_.toString = function () {
  var _ = this, ord, arg

  ord = _.ord.toFixed(Complex.precision).split('.')
  arg = _.arg.toFixed(Complex.precision).split('.')
  ord[1] = ord[1] || '0'
  arg[1] = arg[1] || '0'
  return ord[0] + '.' + ord[1] + '.' + arg[1] + 'X'
}

}()

var
Adele = function (r, s, n) {
  var _ = this, __, u

  r = r || 0; s = s || 1; n = n || 0

  ｎ = n.body()
  __ = s.ub(n); u = __[0]; s = __[1]
  r = (r * u.inv(n)).mod(n * s)

  _.r = r; _.s = s; _.n = n
}

!function () {

_ = Adele.prototype

var nil = new Adele(0, 0, 1)

_.finalize = function () {
  var _ = this, __, _r, _s

  if (_.n === 1 || _.s === 0) {
    return nil
  }

  __ = _.r.gcd(_.s); _r = _.r.div(__); _s = _.s.div(__)

  return new Adele(_r, _s, _.n)
}

_.coerce = function (a) {
  var _ = this, __, n, _u, _s, au, as, s, _r, ar

  n = _.n.gcd(a.n)

  if (n === 1) {
    return [nil, nil]
  }

  __ = _.s.ub(n); _u = __[0]; _s = __[1]
  __ = a.s.ub(n); au = __[0]; as = __[1]
  s = _s.lcm(as)
  _r = _.r * _u.inv(n) * s.div(_s)
  ar = a.r * au.inv(n) * s.div(as)
  _ = new Adele(_r, s, n)
  a = new Adele(ar, s, n)

  return [a, _]
}
_.eql = function (a) {
  var _ = this

  return _.n == a.n && _.r === a.r && _.s === a.s
}
_.neg = function () {
  var _ = this

  return _.eql(nil) ? nil : new Adele(-_.r, _.s, _.n)
}
_.res = function () {
  var _ = this, __, u, n

  // return if unit? in ruby
  __ = _.r.ub(_.n); u = __[0]; n = __[1]
  return new Adele(0, 1, n)
}
_.add = function (a) {
  return this._add(a).finalize()
}
_._add = function (a) {
  var __ = this.coerce(a)

  return __[0].__add(__[1])
}
_.__add = function (a) {
  var _ = this

  return _.eql(nil) ? nil :
         new Adele(_.r + a.r, _.s, _.n)
}
_.inv = function () {
  var _ = this, r, s, __, u

  if (_.r === 0) {
    return nil
  }
  __ = _.r.ub(_.n); u = __[0]; s = __[1]
  r = _.s * u.inv(_.n)
  return new Adele(r, s, _.n)
}
_.mul = function (a) {
  return this._mul(a).finalize()
}
_._mul = function (a) {
  var __ = this.coerce(a)

  return __[0].__mul(__[1])
}
_.__mul = function (a) {
  var _ = this

  return _.eql(nil) ? nil :
         new Adele(_.r * a.r, _.s * a.s, _.n)
}
_.isZero = function () {
  return this.r === 0
}
_.isUnity = function () {
  return this.r === 1
}

_.toString = function () {
  var _ = this, __ = ''

  if (_.eql(nil)) {
    return 'nil'
  }

  _.n === 0 || (__ +=       _.n.toString() + '\\')
                __ +=       _.r.toString()
  _.s === 1 || (__ += '/' + _.s.toString())

  return __
}

}()
