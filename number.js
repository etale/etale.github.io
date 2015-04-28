// generics
Object.prototype.eql = function (a) {
  return this.__proto__ === a.__proto__ && this._eql(a)
}
// specialized
Object.prototype._eql = function (a) {
  return this === a
}
// specialized
Array.prototype._eql = function (a) {
  return this.length === a.length && this.every(function (e, i) { return e === a[i] })
}
// generics
Number.prototype.coerce = function (a) {
  var _
  if (Number.prototype === a.__proto__) {
    return [a, this]
  } else
  {
    _ = a.coerce(this)
    return [_[1], _[0]]
  }
}
Number.prototype.add = function (a) {
  var _ = this.coerce(a)
  return _[1]._add(_[0])
}
Number.prototype.mul = function (a) {
  var _ = this.coerce(a)
  return _[1]._mul(_[0])
}
Number.prototype.divmod = function (a) {
  var _ = this.coerce(a)
  return _[1]._divmod(_[0])
}
Number.prototype._divmod = function (a) {
  var _ = this.valueOf(), q, r

  a = (a || 0).body()
  if (a === 0) {
    return [0, _]
  }

  r = _ % a; r < 0 && (r += a)
  q = (_ - r) / a
  return [q, r]
}
Number.prototype.div =function (a) {
  return this.divmod(a)[0]
}
Number.prototype.mod =function (a) {
  return this.divmod(a)[1]
}
Number.prototype.gcd = function (a) {
  var _ = this.body(), __

  a = (a || 0).body()
  while (a !== 0) {
    __ = [a, _.mod(a)]; _ = __[0]; a = __[1]
  }
  return _
}
Number.prototype.lcm = function (a) {
  var _ = this.body()

  a = (a || 1).body()
  return _ * a / _.gcd(a)
}
Number.prototype._inv = function (a) {
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
Number.prototype.ub = function (a) {
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
Number.prototype.isZero = function () {
  return this._eql(this.zero())
}
Number.prototype.isUnity = function () {
  return this._eql(this.unity())
}
Number.prototype.isUnit = function () {
  var _ = this

  return _.eql(_.unit())
}
Number.prototype.isBody = function () {
  var _ = this

  return _.eql(_.body())
}
// specialized
Number.prototype.finalize = function () {
  return this.valueOf()
}
Number.prototype._eql = function (a) {
  return this == a
}
Number.prototype.zero = function () {
  return 0
}
Number.prototype._add = function (a) {
  return this + a
}
Number.prototype.neg = function () {
  return - this
}
Number.prototype.unity = function () {
  return 1
}
Number.prototype._mul = function (a) {
  return this * a
}
Number.prototype.inv = function () {
  return new Adele(1, this.valueOf(), 0)
}
Number.prototype._divmod = function (a) {
  var _ = this % a
  return [(this - _)/a, _]
}
Number.prototype.unit = function () {
  return this < 0 ? -1 : 1
}
Number.prototype.body = function () {
  return Math.abs(this)
}
function Nums(a) {
  this._ = a || []
  if (!this._[0]) {
    this._.zero = Number.prototype.zero
    this._.unity = Number.prototype.unity
  } else
  {
    this._.zero = this._[0].zero
    this._.unity = this._[0].unity
  }
}
Object.setPrototypeOf(Nums.prototype, Number.prototype)
Nums.zero = new Nums([])
Nums.unity = new Nums([1])
Nums.prototype.coerce = function (a) {
  var _
  if (a.__proto__ === Nums.prototype) {
    return [a, this]
  } else
  if (a.__proto__ === Number.prototype) {
    if (a >= 0) {
      _ = []
      while (a) {
        _.push(a & 0xff)
        a >>= 8
      }
      _[_.length - 1] & 0x80 && _.push(0)
      return [new Nums(_), this]
    } else
    {
      return [this.coerce(-a)[1].neg(), this]
    }
  } else
  {
    _ = a.coerce(this)
    return [_[1], _[0]]
  }
}
Nums.prototype._eql = function (a) {
  return this._.eql(a._)
}
Nums.prototype.zero = function () {
  return Nums.zero
}
Nums.prototype._add = function (a) {
  return this.__add(a).finalize()
}
Nums.prototype.neg = function () {
  return this.complement().add(1)
}
Nums.prototype.unity = function () {
  return Nums.unity
}
Nums.prototype._mul = function (a) {
  return this.__mul(a).finalize()
}
Nums.prototype._divmod = function (a) {
  return [0, 0]
}
Nums.prototype.complement = function () {
  return new Nums(this._.map(function (a) {
    return 0xff - a
  }))
}
Nums.prototype.finalize = function () {
  return new Nums(this._.reduce(function (a, b) {
    b += a[1]
    a = a[0]
    a.push(b & 0xff)
    return [a, b >> 8]
  }, [[], 0])[0])
}
Nums.prototype.finalize = function () {
  var _ = this._.slice(0)

  while (_[_.length - 1] === 0    && (_[_.length - 2] || 0) & 0x80 === 0)
    _.pop()
  while (_[_.length - 1] === 0xff && (_[_.length - 2] || 0) & 0x80 !== 0)
    _.pop()
  return new Nums(_)
}
Nums.prototype.__add = function (a) {
  var _ = 0

  if (this._.length < a._.length) {
    return a.__add(this)
  }
  a = a._
  a[a.length - 1] & 0x80 && (_ = 0xff)
  new Nums(this._.map(function (e, i) {
    return e + (a[i] || _)
  }))
}
Nums.prototype.__mul = function (a) {
  var __ = []
  this._.forEach(function (_, i) {
    a._.forEach(function (a, j) {
      j += i
      __[j] = (__[j] || 0) + _ * a
    })
  })
  return new Nums(__)
}
function Adele(r, s, n) {
  var _ = this, __, u

  r = r || 0; s = s || 1; n = n || 0

  n = n.body()
  __ = s.ub(n); u = __[0]; s = __[1]
  r = (r * u._inv(n)).mod(n * s)

  _.r = r; _.s = s; _.n = n
}
Object.setPrototypeOf(Adele.prototype, Number.prototype)
Adele.nil = new Adele(0, 0, 1)
Adele.prototype.finalize = function () {
  var _ = this, d, r, s

  if (_.n.isUnity() || _.s.isZero) {
    return nil
  }

  d = _.r.gcd(_.s); r = _.r.div(d); s = _.s.div(d)

  return new Adele(r, s, _.n)
}
Adele.prototype.coerce = function (a) {
  var _ = this, __, n, _u, _s, au, as, s, _r, ar

  if (a.__proto__ === Array.prototype) {
    n = _.n.gcd(a.n)

    if (n.isUnity()) {
      return [Adele.nil, Adele.nil]
    }

    __ = _.s.ub(n); _u = __[0]; _s = __[1]
    __ = a.s.ub(n); au = __[0]; as = __[1]
    s = _s.lcm(as)
    _r = _.r * _u._inv(n) * s.div(_s)
    ar = a.r * au._inv(n) * s.div(as)
    _ = new Adele(_r, s, n)
    a = new Adele(ar, s, n)
  } else
  if (a.__proto__ === Number.prototype) {
    a = new Adele(a, 1, _.n)
  }

  return [a, _]
}
Adele.prototype._eql = function (a) {
  var _ = this

  return _.n.eql(a.n) && _.r.eql(a.r) && _.s.eql(a.s)
}
Adele.prototype.zero = function () {
  var _ = this

  return new Adele(0, _.s, _.n)
}
Adele.prototype.neg = function () {
  var _ = this

  return _.eql(Adele.nil) ? Adele.nil : new Adele(-_.r, _.s, _.n)
}
Adele.prototype.res = function () {
  var _ = this, __, u, n

  // return if unit? in ruby
  __ = _.r.ub(_.n); u = __[0]; n = __[1]
  return new Adele(0, 1, n)
}
Adele.prototype._add = function (a) {
  var _ = this

  return new Adele(_.r.add(a.r), _.s, _.n)
}
Adele.prototype.unity = function () {
  var _ = this

  return new Adele(_.s, _.s, _.n)
}
Adele.prototype.inv = function () {
  var _ = this, r, s, __, u

  if (_.r === 0) {
    return nil
  }
  __ = _.r.ub(_.n); u = __[0]; s = __[1]
  r = _.s.mul(u._inv(_.n))
  return new Adele(r, s, _.n)
}
Adele.prototype._mul = function (a) {
  var _ = this

  return new Adele(_.r.mul(a.r), _.s.mul(a.s), _.n)
}
Adele.prototype.pow = function (a) {
  var _ = this, __ = _.unity()

  a = a.r
  while (a) {
    a.mod(2) === 1 && (__ = __.mul(_))
    _ = _.mul(_); a = a.div(2)
  }
  return __
}
Adele.prototype.unit = function () {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[0]
  return new Adele(r, 1, _.n)
}
Adele.prototype.body = function () {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[1]
  return new Adele(r, _.s, 0)
}
Adele.prototype.factor = function () {
  var _ = this, p = (_.r * _.s).factor()

  if (_.r % p) {
    return [new Adele(1, p), new Adele(_.r, _.s/p)]
  } else {
    return [new Adele(p, 1), new Adele(_.r/p, _.s)]
  }
}

Adele.prototype.toString = function () {
  var _ = this, __ = ''

  if (_.eql(nil)) {
    return 'nil'
  }

  _.n === 0 || (__ +=       _.n.toString() + '\\')
                __ +=       _.r.toString()
  _.s === 1 || (__ += '/' + _.s.toString())

  return __
}
