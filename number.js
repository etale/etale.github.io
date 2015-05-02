function implement() { throw new Error('implement it later') }

function Algebraic() {}
function Nums(a) {
  a || (a = [0])
  a.length || (a[0] = 0)
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
function Adic(b, u) {
  var _ = new Adele(0, 1, 7*7*7*7*7*7*7)
  b || (b = _.unity())
  u || (u = _.unity())
  this.b = b; this.u = u
}
function Arch(ord, arg) {
  ord || (ord = 0)
  arg || (arg = 0)
  arg = arg.mod(arg.unity())
  this.ord = ord; this.arg = arg
}
;[Number, Nums, Adele, Adic, Arch].forEach(function (a) {
  Object.setPrototypeOf(a.prototype, Algebraic.prototype)
})

// generics
Object.prototype.eq = function (a) {
  return this.__proto__ === a.__proto__
}
Object.prototype.eql = function (a) {
  return this.eq(a) && this._eql(a)
}

Algebraic.prototype.cast = function (a) {
  return this.coerce(a)[0]
}
Algebraic.prototype.add = function (a) {
  var _ = this.coerce(a)
  return _[1]._add(_[0]).finalize()
}
Algebraic.prototype.mul = function (a) {
  var _ = this.coerce(a)
  return _[1]._mul(_[0]).finalize()
}
Algebraic.prototype.divmod = function (a) {
  var _ = this.coerce(a)
  return _[1]._divmod(_[0]).map(function (a) {
    return a.finalize()
  })
}
Algebraic.prototype.div =function (a) {
  return this.divmod(a)[0]
}
Algebraic.prototype.mod =function (a) {
  return this.divmod(a)[1]
}
Algebraic.prototype.gcd = function (a) {
  var _ = this.body(), __
  a = (a || _.zero()).body()
  while (!a.isZero()) {
    __ = [a, _.mod(a)]; _ = __[0]; a = __[1]
  }
  return _
}
Algebraic.prototype.lcm = function (a) {
  var _ = this.body()
  a = (a || _.unity()).body()
  return _.mul(a).div(_.gcd(a))
}
Algebraic.prototype.ub = function (a) {
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
Algebraic.prototype.pow = function (a) {
  var _ = this, __ = _.unity()
  if (Number.isInteger(a)) {
    if (a < 0) {
      return this.inv().pow(-a)
    }
    while (a) {
      a.mod(2) === 1 && (__ = __.mul(_))
      _ = _.mul(_); a = a.div(2)
    }
  } else
  {
    __ = _.log().mul(a).exp()
  }
  return __
}
Algebraic.prototype.sgn = function () {
  return this.isZero() ? this.finalize() : this.unit()
}
Algebraic.prototype.isZero = function () {
  return this._eql(this.zero())
}
Algebraic.prototype.isUnity = function () {
  return this._eql(this.unity())
}
Algebraic.prototype.isUnit = function () {
  return this._eql(this.unit())
}
Algebraic.prototype.isBody = function () {
  return this._eql(this.body())
}
Algebraic.prototype.isSgn = function () {
  return this._eql(this.sgn())
}
Algebraic.prototype.lt = function (a) {
  var _ = this.coerce(a)
  return _[1]._lt(_[0])
}
Algebraic.prototype.gt = function (a) {
  var _ = this.coerce(a)
  return _[1]._gt(_[0])
}
Algebraic.prototype.lte = function (a) {
  var _ = this.coerce(a)
  return _[1]._lte(_[0])
}
Algebraic.prototype.gte = function (a) {
  var _ = this.coerce(a)
  return _[1]._gte(_[0])
}

// specialized
// should override them
Object.prototype._eql = function (a) {
  return this === a
}

Array.prototype._eql = function (a) {
  return this._ === a._ &&
    this.length === a.length &&
    this.every(function (e, i) { return e === a[i] })
}

Number.prototype.reduce = function () {
  return [this & 0xff, this >> 8]
}
Number.prototype.finalize = function () {
  var _ = this.valueOf(), r = []
  if (Number.isInteger(_) && _ > 0xff) {
    while (_) {
      __ = _.reduce()
      r.push(__[0])
      _ = __[1]
    }
    _ = new Nums(r)
  }
  return _
}
Number.prototype._eql = function (a) {
  return this == a
}
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
Number.prototype.zero = function () {
  return 0
}
Number.prototype._add = function (a) {
  return this + a
}
Number.prototype.neg = function () {
  return -this
}
Number.prototype.res = function () {
  var _ = this.valueOf()
  return Number.isInteger(_) ?
  new Adele(0, 1, this.valueOf()) : implement()
}
Number.prototype.unity = function () {
  return 1
}
Number.prototype._mul = function (a) {
  return this * a
}
Number.prototype.inv = function () {
  var _ = this.valueOf()
  return Number.isInteger(_) ?
  new Adele(1, _.valueOf(), 0) : 1/_
}
Number.prototype.unit = function () {
  return this < 0 ? -1 : 1
}
Number.prototype.body = function () {
  var _ = this.valueOf()
  return _ < 0 ? -_ : _
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
Algebraic.prototype._inv = function (a) {
  var _ = this, x = _.unity(), z = _.zero(), __, q, r, n
  n = a = (a || _.zero()).body()
  if (a.isZero() && _.isUnit())
    return _.unit()

  while (!a.isZero()) {
    __ = _.divmod(a); q = __[0]; r = __[1]
    __ = [a, r, z, x.add(q.mul(z).neg())]
    _ = __[0]; a = __[1]; x = __[2]; z = __[3]
  }
  return x.mod(n)
}
Number.prototype.factor = function () {
  var _ = this.body(), p = 7, bound = Math.sqrt(_) + 1
  if (_ === 1)
    return
  if (!(_ % 2))
    return 2
  if (!(_ % 3))
    return 3
  if (!(_ % 5))
    return 5
  while (p < bound) {
    if (!(_ % p)) //  7
      return p
    p += 4
    if (!(_ % p)) // 11
      return p
    p += 2
    if (!(_ % p)) // 13
      return p
    p += 4
    if (!(_ % p)) // 17
      return p
    p += 2
    if (!(_ % p)) // 19
      return p
    p += 4
    if (!(_ % p)) // 23
      return p
    p += 6
    if (!(_ % p)) // 29
      return p
    p += 2
    if (!(_ % p)) //  1
      return p
    p += 6
  }
  return _
}
Number.prototype.factorize = function() {
  var _ = this.valueOf(), fs = {}, p
  while (_ !== 1) {
    p = _.factor()
    fs[p] || (fs[p] = 0)
    fs[p] += 1
    _ /= p
  }
  return fs
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
Number.prototype.forEach = function (a) {
  var _ = 0
  while (_ < this) {
    a(_++)
  }
}

Nums.prototype.coerce = function (a) {
  var _ = this, __
  if (a.eq(_)) {
    if (!a._[0].eq(this._[0])) {
      __ = _._[0].cast(a._[0])
      a = new Nums(a._.map(function (a) {
        return __.cast(a)
      }))
      _ = new Nums(_._.map(function (a) {
        return __.cast(a)
      }))
    }
    return [a, _]
  } else
  {
    a = new Nums([a])
    return [a, _]
  }
}
Nums.prototype._eql = function (a) {
  return this._.eql(a._)
}
Nums.prototype.zero = function () {
  return new Nums([this._[0].zero()])
}
Nums.prototype.neg = function () {
  return new Nums(this._.map(function (a) {
    return a.neg()
  }))
}
Nums.prototype.unity = function () {
  return new Nums([this._[0].unity()])
}
Nums.prototype._divmod = function (a) {
  implement()
}
Nums.prototype.finalize = function () {
  var _ = this, a, r, __
  if (_._[0].reduce) {
    a = _._.slice(0), r = [], __
    while (a.length) {
      __ = a[0].reduce(a.shift())
      r.push(__[0])
      __[1] && (a[0] = (a[0] || 0) + __[1])
    }
    _ = new Nums(r)
  }
  return _
}
Nums.prototype._add = function (a) {
  var _ = this._, __ = []
  a = a._
  console.log(['+', _, a])
  Math.max(_.length, a.length).forEach(function (i) {
    __.push((_[i] || _[0].zero())._add(a[i] || a[0].zero()))
  })
  return new Nums(__)
}
Nums.prototype._mul = function (a) {
  var _ = this, __ = []
  _._.forEach(function (_, i) {
    a._.forEach(function (a, j) {
      j += i
      __[j] = (__[j] || _.zero()).add(_.mul(a))
    })
  })
  return new Nums(__)
}

Adele.prototype.finalize = function () {
  var _ = this, d, r, s
  if (_.n.isUnity() || _.s.isZero()) {
    return nil
  }
  d = _.r.gcd(_.s); r = _.r.div(d); s = _.s.div(d)
  return new Adele(r, s, _.n)
}
Adele.prototype.coerce = function (a) {
  var _ = this, __, n, _u, _s, au, as, s, _r, ar

  if (a.eq(this)) {
    n = _.n.gcd(a.n)
    if (n.isUnity()) {
      return [nil, nil]
    }
    __ = _.s.ub(n); _u = __[0]; _s = __[1]
    __ = a.s.ub(n); au = __[0]; as = __[1]
    s = _s.lcm(as)
    _r = _.r.mul(_u._inv(n)).mul(s.div(_s))
    ar = a.r.mul(au._inv(n)).mul(s.div(as))
    _ = new Adele(_r, s, n)
    a = new Adele(ar, s, n)
  } else
  if (a.eq(0)) {
    ar = a; as = 1
    while (!Number.isInteger(ar)) { ar *= 2; as *= 2 }
    a = new Adele(ar, as, _.n)
  } else
  if (a.eq(new Nums)) {
    implement()
  } else
  if (a.eq(new Adic)) {
    implement()
  } else
  if (a.eq(new Arch)) {
    implement()
  } else
  {
    __ = a.coerce(this)
    _ = __[0]
    a = __[1]
  }
  return [a, _]
}
Adele.prototype._eql = function (a) {
  var _ = this
  return _.n.eql(a.n) && _.r.eql(a.r) && _.s.eql(a.s)
}
Adele.prototype.zero = function () {
  var _ = this
  return new Adele(_.r.zero(), _.s, _.n)
}
Adele.prototype.neg = function () {
  var _ = this
  return new Adele(_.r.neg(), _.s, _.n)
}
Adele.prototype.res = function () {
  var _ = this, __, u, n
  // return if unit? in ruby
  __ = _.r.ub(_.n); u = __[0]; n = __[1]
  return new Adele(_.r.zero(), _.s.unity(), n)
}
Adele.prototype._add = function (a) {
  var _ = this
  return new Adele(_.r.add(a.r), _.s, _.n)
}
Adele.prototype.unity = function () {
  var _ = this
  return new Adele(_.r.unity(), _.s.unity(), _.n)
}
Adele.prototype.inv = function () {
  var _ = this, r, s, __, u
  if (_.r.isZero()) {
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
  var _ = this
  return _.r.mul(_.s).factor()
}
Adele.prototype.factorize = function () {
  var _ = this, fs = {}, ps, ns
  ps = _.r.factorize() // positives
  ns = _.s.factorize() // negatives
  Object.getOwnPropertyNames(ps).forEach(function (a) {
    fs[a] = ps[a]
  })
  Object.getOwnPropertyNames(ns).forEach(function (a) {
    fs[a] = -ns[a]
  })
  return fs
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

Adic.prototype.finalize = function () {
  return this
}
Adic.prototype.coerce = function (a) {
  var _ = this
  if (a.eq(_)) {
    implement()
  } else
  if (a.eq(0)) {
    implement()
  } else
  if (a.eq(new Adele)) {
    implement()
  } else
  if (a.eq(new Arch)) {
    implement()
  } else
  if (a.eq(new Num)) {
    implement()
  } else
  {
    __ = a.coerce(this)
    _ = __[0]
    a = __[1]
  }
  return [a, _]
}
Adic.prototype.zero = function () {
  var _ = this
  return new Adic(_.b.unity(), _.u.zero())
}
Adic.prototype.neg = function () {
  var _ = this
  return new Adic(_.b, _.u.neg())
}
Adic.prototype._add = function (a) {
  var _ = this, _b, _u
  _b = _.b.gcd(a.b)
  _u = _.u + a.u // _.b = a.b
  __ = _u.ub(_b); _u = __[0]; _b = _b.mul(__[1])
  return new Adic(_b, _u)
}
Adic.prototype.unity = function () {
  var _ = this
  return new Adic(_.b.unity(), _.u.unity())
}
Adic.prototype.unit = function () {
  var _ = this
  return new Adic(_.b.unity(), _.u)
}
Adic.prototype.inv = function () {
  var _ = this
  return _.isZero() ? nil : new Adic(_.b.inv(), _.u.inv())
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
Adic.prototype.log = function () {
  var _ = this, u, x
  u = _.u.mul(_.sgn().inv())
  x = u.unity().add(u.inv().neg())
//  _ = x + x^2/2 + x^3/3 + ...
  return _
}
Adic.prototype.exp = function () {
  var _ = this, x
// _ = 1 + x + x^2/2! + x^3/3! + ...
  return _
}
Adic.prototype.sgn = function () {
  var _ = this, u, x, p = 7
  u = _.u; x = u.pow(p)
  while (!x.eql(u)) {
    u = x
    x = x.pow(p)
  }
  implement()
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
