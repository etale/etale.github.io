!function () {

Number.parse = function (a) {
  var ord, r, s

  if (Number.isLittLe) {
    a = a.split('.')
    ord = a[0].length - 1
    r = parseInt((a[0] + a[1]).split('').reverse().join(''), Number.radix)
    s = Math.pow(Number.radix, ord)
  } else
  {
    r = parseInt(a, Number.radix)
    s = 1
  }
  return new Adele(r, s).finalize()
}

var _ = Number.prototype

_.divmod = function (a) {
  var _ = this.valueOf(), q, r

  a = (a || 0).body()
  if (a === 0) {
    return [0, _]
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
  var _ = this.body(), __

  a = (a || 0).body()
  while (a !== 0) {
    __ = [a, _.mod(a)]; _ = __[0]; a = __[1]
  }
  return _
}
_.lcm = function (a) {
  var _ = this.body()

  a = (a || 1).body()
  return _ * a / _.gcd(a)
}
_._inv = function (a) {
  var _ = this.valueOf(), x = 1, z = 0, __, q, r, n

  n = a = (a || 0).body()
  if (a === 0 && _ === -1)
    return -1

  while (a !== 0) {
    __ = _.divmod(a); q = __[0]; r = __[1]
    __ = [a, r, z, x - q * z]
    _ = __[0]; a = __[1]; x = __[2]; z = __[3]
  }
  return x.mod(n)
}
_.unit = function () {
  return this < 0 ? -1 : 1
}
_.body = function () {
  return Math.abs(this)
}
_.ub = function (a) {
  var _ = this.valueOf(), b = 1, d

  a = (a || 0).body()
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
_.factor = function () {
  var _ = this.body(), p = 3, bound = Math.sqrt(_ + 1)

  if (_ % 2) {
    while (p < bound)
      if (_ % p)
        p += 2
      else
        return p
    return _
  } else
  {
    return 2
  }
}

_.toArray = function () {
  var _ = [], i = 0, j = this

  i > j && (i = j, j = 0)
  while (i < j) _.push(i++)
  return _
}
_.forEach = function (a) {
  this.toArray().forEach(a)
}
_.map = function (a) {
  return this.toArray().map(a)
}

_._toString = _.toString
_.toString = function () {
  var _ = this.body()._toString(Number.radix).split('').reverse(), negative = this < 0

  return (negative ? '-' : '') + (
    Number.isLittle ? [_[0], '.'].concat(_.slice(1)) :
                      _.reverse()
  ).join('')
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

  n = n.body()
  __ = s.ub(n); u = __[0]; s = __[1]
  r = (r * u._inv(n)).mod(n * s)

  _.r = r; _.s = s; _.n = n

  _._r = n === 0 ? r :
         r < n/2 ? r :
         r - n
}

!function () {

var _ = Adele.prototype, nil = new Adele(0, 0, 1)

_.finalize = function () {
  var _ = this, d, r, s

  if (_.n === 1 || _.s === 0) {
    return nil
  }

  d = _.r.gcd(_.s); r = _.r.div(d); s = _.s.div(d)

  return new Adele(r, s, _.n)
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
  _r = _.r * _u._inv(n) * s.div(_s)
  ar = a.r * au._inv(n) * s.div(as)
  _ = new Adele(_r, s, n)
  a = new Adele(ar, s, n)

  return [a, _]
}
_.eql = function (a) {
  var _ = this

  return _.n === a.n && _.r === a.r && _.s === a.s
}
_.zero = function () {
  var _ = this

  return new Adele(0, _.s, _.n)
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
_.unity = function () {
  var _ = this

  return new Adele(_.s, _.s, _.n)
}
_.inv = function () {
  var _ = this, r, s, __, u

  if (_.r === 0) {
    return nil
  }
  __ = _.r.ub(_.n); u = __[0]; s = __[1]
  r = _.s * u._inv(_.n)
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
_.pow = function (a) {
  var _ = this, __ = _.unity()

  a = a.r
  while (a) {
    a.mod(2) === 1 && (__ = __.mul(_))
    _ = _.mul(_); a = a.div(2)
  }
  return __
}
_.unit = function () {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[0]
  return new Adele(r, 1, _.n)
}
_.body = function () {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[1]
  return new Adele(r, _.s, 0)
}
_.isZero = function () {
  var _ = this

  return _.eql(_.zero())
}
_.isUnity = function () {
  var _ = this

  return _.eql(_.unity())
}
_.isUnit = function () {
  var _ = this

  return _.eql(_.unit())
}
_.isBody = function () {
  var _ = this

  return _.eql(_.body())
}
_.factor = function () {
  var _ = this, p = (_.r * _.s).factor()

  if (_.r % p) {
    return [new Adele(1, p), new Adele(_.r, _.s/p)]
  } else {
    return [new Adele(p, 1), new Adele(_.r/p, _.s)]
  }
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
