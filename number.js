function Nums(a) {
  a || (a = [])
  a._ || (a._ = a[0] !== undefined ? a[0].constructor : Number)
  this._ = a
}
function Adele(r, s, n) {
  var _, u
  r = r || 0; s = s || 1; n = n || 0
  n = n.body()
  _ = s.ub(n); u = _[0]; s = _[1]
  r = u._inv(n).mul(r).mod(n.mul(s))
  this.r = r; this.s = s; this.n = n
}
function Adic(body, unit) {
  this.body = body
  this.unit = unit
}
function Arch(ord, arg) {
  ord || (ord = 0)
  arg || (arg = 0)
  arg = arg.mod(arg.unity()) // arg < 0 is bad
//  arg %= 1; arg < 0 && (arg += 1)
  this.ord = ord; this.arg = arg
}
;[Nums, Adele, Adic, Arch].forEach(function (a) {
  Object.setPrototypeOf(a.prototype, Number.prototype)
})
// generics
Object.prototype.eq = function (a) {
  return this.__proto__ === a.__proto__
}
Object.prototype.eql = function (a) {
  return this.eq(a) && this._eql(a)
}
// generics
Number.prototype.coerce = function (a) {
  var _
  if (this.eq(a)) {
    return [a, this.valueOf()]
  } else
  {
    _ = a.coerce(this)
    return [_[1], _[0]]
  }
}
Number.prototype.add = function (a) {
  var _ = this.coerce(a)
  return _[1]._add(_[0]).finalize()
}
Number.prototype.mul = function (a) {
  var _ = this.coerce(a)
  return _[1]._mul(_[0]).finalize()
}
Number.prototype.divmod = function (a) {
  var _ = this.coerce(a)
  return _[1]._divmod(_[0]).map(function (a) {
    return a.finalize()
  })
}
Number.prototype.div =function (a) {
  return this.divmod(a)[0]
}
Number.prototype.mod =function (a) {
  return this.divmod(a)[1]
}
Number.prototype.gcd = function (a) {
  var _ = this.body(), __
  a = (a || _.zero()).body()
  while (!a.isZero()) {
    __ = [a, _.mod(a)]; _ = __[0]; a = __[1]
  }
  return _
}
Number.prototype.lcm = function (a) {
  var _ = this.body()
  a = (a || _.unity()).body()
  return _.mul(a).div(_.gcd(a))
}
Number.prototype.ub = function (a) {
  var _ = this, b = _.unity(), d
  a = (a || _.zero()).body()
  if (_.mul(a).isZero()) {
    return [_.unit(), _.body()]
  }
  while (true) {
    d = _.gcd(a)
    if (d.isUnity()) {
      break
    }
    _ = _.div(d); b = b.mul(d)
  }
  return [_, b]
}
Number.prototype.sgn = function () {
  return this.isZero() ? this : this.unit()
}
Number.prototype.isZero = function () {
  return this._eql(this.zero())
}
Number.prototype.isUnity = function () {
  return this._eql(this.unity())
}
Number.prototype.isUnit = function () {
  return this.eql(this.unit())
}
Number.prototype.isBody = function () {
  return this.eql(this.body())
}
Number.prototype.lt = function (a) {
  var _ = this.coerce(a)
  return _[1]._lt(_[0])
}
Number.prototype.gt = function (a) {
  var _ = this.coerce(a)
  return _[1]._gt(_[0])
}
Number.prototype.lte = function (a) {
  var _ = this.coerce(a)
  return _[1]._lte(_[0])
}
Number.prototype.gte = function (a) {
  var _ = this.coerce(a)
  return _[1]._gte(_[0])
}

// specialized
Object.prototype._eql = function (a) {
  return this === a
}
Array.prototype._eql = function (a) {
  return this._ === a._ && this.length === a.length && this.every(function (e, i) { return e === a[i] })
}
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
Number.prototype.unit = function () {
  return this < 0 ? -1 : 1
}
Number.prototype.body = function () {
  return Math.abs(this)
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
Number.prototype._inv = function (a) {
  var _ = this.valueOf(), x = 1, z = 0, __, q, r, n
  n = a = (a || _.zero()).body()
  if (a.isZero() && _.neg().isUnity())
    return _.unity().neg()

  while (!a.isZero()) {
    __ = _.divmod(a); q = __[0]; r = __[1]
    __ = [a, r, z, x.add(q.mul(z).neg())]
    _ = __[0]; a = __[1]; x = __[2]; z = __[3]
  }
  return x.mod(n)
}
Number.prototype._lt = function (a) {
  return this < a
}
Number.prototype._gt = function (a) {
  return this > a
}
Number.prototype._lte = function (a) {
  return this <= a
}
Number.prototype._gte = function (a) {
  return this >= a
}
Number.prototype.log = function () {
  return Math.log(this)
}
Number.prototype.atan2 = function (a) {
  return Math.atan2(this, a)
}
Number.prototype.exp = function () {
  return Math.exp(this)
}
Number.prototype.cos = function () {
  return Math.cos(this)
}
Number.prototype.sin = function () {
  return Math.sin(this)
}
Nums.prototype.coerce = function (a) {
  var _ = this
  if (a.eq(this)) {
    if (a._._ !== _._._) {
      a = a._.map(function (a) {
        return _._._.prototype.coerce(a)[0]
      }); a._ = _._._; a = new Nums(a)
    }
    return [a, this]
  } else
  if (a.eq(0)) {
    if (a >= 0) {
      _ = []
      while (a) {
        _.push(a & 0xff)
        a >>= 8
      }
      _[_.length - 1] & 0x80 && _.push(0)
      _._ = Number
      a = new Nums(_)
    } else
    {
      a = this.coerce(-a)[1].neg()
    }
    return [a, this]
  } else
  {
    _ = a.coerce(this)
    return [_[1], _[0]]
  }
}
Nums.prototype._eql = function (a) {
  return this._._ === a._._ && this._.eql(a._)
}
Nums.prototype.zero = function () {
  return new Nums([], this.type)
}
Nums.prototype.neg = function () {
  return this.isZero() ? this : this.complement()._add(this.unity())
}
Nums.prototype.unity = function () {
  return new Nums([this._._.prototype.unity()], this.type)
}
Nums.prototype._divmod = function (a) {
  throw new Error('implement later')
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
Nums.prototype._add = function (a) {
  var _ = 0

  if (this._.length < a._.length) {
    return a._add(this)
  }
  a = a._
  a[a.length - 1] & 0x80 && (_ = 0xff)
  return new Nums(this._.map(function (e, i) {
    return e._add(a[i] || _)
  }), this.type)
}
Nums.prototype._mul = function (a) {
  var _ = this, __ = []
  _._.forEach(function (_, i) {
    a._.forEach(function (a, j) {
      j += i
      __[j] = (__[j] || _.zero())._add(_.mul(a))
    })
  })
  return new Nums(__, this.type)
}
//Adele.nil = new Adele(0, 0, 1)
Adele.prototype.finalize = function () {
  var _ = this, d, r, s

  if (_.n.isUnity() || _.s.isZero()) {
    return Adele.nil
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
    _r = _.r.mul(_u._inv(n)).mul(s.div(_s))
    ar = a.r.mul(au._inv(n)).mul(s.div(as))
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
Adele.prototype.toString = function (a) {
  var _ = this, __ = ''

  if (_.eql(nil)) {
    return 'nil'
  }

  _.n === 0 || (__ +=       _.n.toString(a) + '\\')
                __ +=       _.r.toString(a)
  _.s === 1 || (__ += '/' + _.s.toString(a))

  return __
}
Adic.prototype.zero = function () {
  return new Adic(this.b, this.u.zero())
}
Adic.prototype.neg = function () {
  return new Adic(this.b, this.u.neg())
}
Adic.prototype._add = function (a) {
  var _ = this, _b, _u
  _b = _.b.gcd(a.b)
  _u = _.u + a.u // _.b = a.b
  __ = _u.ub(_b); _u = __[0]; _b = _b.mul(__[1])
  return new Adic(_b, _u)
}
Adic.prototype.unity = function () {
  return new Adic(this.b.unity(), this.u.unity())
}
Adic.prototype.inv = function () {
  return this.isZero() ? nil : new Adic(this.b.inv(), this.u.inv())
}
Adic.prototype._mul = function (a) {
  var _ = this
  if (_.isZero()) {
    return _
  } else
  if (a.isZero()) {
    return a
  }
  return new Adic(_.b.mul(a.b), _.u.mul(a.u))
}
Adic.prototype.log =
Adic.prototype.exp =
Adic.prototype.sgn = function () {
  throw new Error('implement later')
}

Arch.prototype._arg = function () {
  var _ = this.arg
  _.lt(0.5) || (_ = _.add(-1).mul(Math.PI * 2))
  return _
}
Arch.prototype.coerce = function (a) {
  var _ = this, ord, arg
  if (a.eq(this)) {
    ord = _.ord.coerce(a.ord) // a.ord, _.ord
    arg = _.arg.coerce(a.arg) // a.arg, _.arg
    _ = new Arch(ord[1], arg[1])
    a = new Arch(ord[0], arg[0])
  } else
  if (a.eq(0)) {
    if (a == 0) {
      ord = -Infinity
      arg = 0
    } else
    if (a > 0) {
      ord = a.log()
      arg = 0
    } else
    {
      ord = (-a).log()
      arg = 0.5
    }
    a = new Arch(ord, arg)
  }
  return [a, _]
}
Arch.prototype.finalize = function () {
  return this
}
Arch.prototype._eql = function (a) {
  return this.ord.eql(a.ord) && this.arg.eql(a.arg)
}
Arch.prototype.zero = function () {
  return new Arch(-Infinity, this.arg)
}
Arch.prototype.neg = function () {
  return this.isZero() ? this : new Arch(this.ord, this.arg.add(0.5))
}
Arch.prototype._add = function (a) {
  var _ = this
  return _.isZero()      ? a        :
         a.isZero()      ? _        :
         _.neg().eql(a)  ? 0        :
         _.ord.lt(a.ord) ? a.add(_) :
         _.mul(_.inv().mul(a).succ())
}
Arch.prototype.unity = function () {
  return new Arch(this.ord.zero(), this.arg.zero())
}
Arch.prototype.inv = function () {
  return new Arch(this.ord.neg(), this.arg.neg())
}
Arch.prototype._mul = function (a) {
  var _ = this
  if (_.isZero()) {
    return _
  } else
  if (a.isZero()) {
    return a
  }
  return new Arch(_.ord.add(a.ord), _.arg.add(a.arg))
}
Arch.prototype.log = function () {
  var _ = this
  return _.isUnity() ?
    this.zero() :
    new Arch(
      _.ord.mul(_.ord).add(_._arg().mul(_._arg())).log().mul(0.5),
      _._arg().atan2(_.ord).mul(1/(Math.PI*2))
    )
}
Arch.prototype.exp = function () {
  var _ = this, __ = _.ord.exp()
  return new Arch(
    __.mul(_._arg().cos()),
    __.mul(_._arg().sin()).mul(1/(Math.PI*2))
  )
}
Arch.prototype.unit = function () {
  return new Arch(this.ord.zero(), this.arg)
}
Arch.prototype.abs = function () {
  return new Arch(this.ord, this.arg.zero())
}
Arch.prototype.shift = function () {
  return new Arch(this.ord.add(1), this.arg)
}
Arch.prototype.succ = function () {
  return this.exp().shift().log()
}
Arch.prototype.conjugate = function () {
  return new Arch(this.ord, this.arg.neg())
}
Arch.prototype.toString = function () {
  var _ = this, ord, arg

  ord = _.ord.toFixed(parseArch.precision).split('.')
  arg = _.arg.toFixed(parseArch.precision).split('.')
  ord[1] = ord[1] || '0'
  arg[1] = arg[1] || '0'
  return ord[0] + '.' + ord[1] + '.' + arg[1] + 'X'
}
function parseArch(a) {
  var _ = a.split('.'), ord, arg

  _ = [0, 1, 2].map(function (i) {
    return _[i] || '0'
  })
  ord = parseFloat(_[0] + '.' + _[1])
  arg = parseFloat(      '0.' + _[2])
  _ = new Arch(ord, arg)
  return a.indexOf('X') === -1 ? _.log() : _
}
parseArch.precision = 8
var nil = new Adele(0, 0, 1)
