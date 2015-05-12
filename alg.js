function error() {
  throw new Error
}
function assert(a, msg) {
  if (!a) {
    throw new Error(msg || 'assertion failed')
  }
}
function Algebraic() {}
function Seq(a) {
  a || (a = [0])
  a[0] || (a[0] = 0)
  this._ = a
}
function Adele(r, s, n) {
  var _, u
  r = r || 0; s = s || 1; n = n || 0
  n = n.body()
  _ = s.ub(n); u = _[0]; s = _[1]
  r = u.__inv(n).mul(r).mod(n.mul(s))
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
;[Number, Seq, Adele, Adic, Arch].forEach(function (a) {
  a.prototype.__proto__ = Algebraic.prototype
})
// generation
Algebraic.prototype.finalize =
Algebraic.prototype.coerce =
// operation
Algebraic.prototype._zero = 
Algebraic.prototype._unity = 
Algebraic.prototype._unit =
Algebraic.prototype._body =
Algebraic.prototype._neg = 
Algebraic.prototype._inv =
Algebraic.prototype._add =
Algebraic.prototype._mul =
Algebraic.prototype._divmod =
// relation
Algebraic.prototype._eql =
Algebraic.prototype._cmp =
error

// generation
Algebraic.prototype.cast = function (a) {
  var _ = this
  return _.coerce(a)[0]
}
// operation
Algebraic.prototype.zero = function () {
  return this._zero().finalize()
}
Algebraic.prototype.unity = function () {
  return this._unity().finalize()
}
Algebraic.prototype.unit = function () {
  return this._unit().finalize()
}
Algebraic.prototype.body = function () {
  return this._body().finalize()
}
Algebraic.prototype.neg = function () {
  return this._neg().finalize()
}
Algebraic.prototype.inv = function () {
  return this._inv().finalize()
}
Algebraic.prototype.add = function (a) {
  var _ = this, __ = _.coerce(a)
  return __[1]._add(__[0]).finalize()
}
Algebraic.prototype.mul = function (a) {
  var _ = this, __ = _.coerce(a)
  return __[1]._mul(__[0]).finalize()
}
Algebraic.prototype.divmod = function (a) {
  var _ = this, __ = _.coerce(a)
  return __[1]._divmod(__[0]).map(function (a) {
    return a.finalize()
  })
}
Algebraic.prototype.sub = function (a) {
  return this.add(a.neg())
}
Algebraic.prototype.divide = function (a) {
  return this.mul(a.inv())
}
Algebraic.prototype.sgn = function () {
  var _ = this
  return _.isZero() ? _.finalize() : _.unit()
}
Algebraic.prototype.div =function (a) {
  return this.divmod(a)[0]
}
Algebraic.prototype.mod =function (a) {
  return this.divmod(a)[1]
}
Algebraic.prototype.__inv = function (a) {
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
  var _ = this.finalize(), b = _.unity(), d
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
  var _ = this, r = _.unity()
  if (Number.isInteger(a)) {
    if (a < 0) {
      return _.inv().pow(-a)
    }
    while (a) {
      a % 2 === 1 && (r = r.mul(_))
      _ = _.mul(_); a >>= 1
    }
  } else
  {
    r = _.log().mul(a).exp()
  }
  return r
}
Algebraic.prototype.succ = function () {
  var _ = this
  return _._add(_.unity())
}
// relation
Object.prototype.eq = function (a) {
  var _ = this; return _.__proto__ === a.__proto__
}
Object.prototype.eql = function (a) {
  var _ = this; return _.eq(a) && _._eql(a)
}
Array.prototype._eql = function (a) {
  var _ = this
  return _.length === a.length && _.every(function (_, i) {
    return _.eql(a[i])
  })
}
Algebraic.prototype.isZero = function () {
  var _ = this; return _.eql(_._zero())
}
Algebraic.prototype.isUnity = function () {
  var _ = this; return _.eql(_._unity())
}
Algebraic.prototype.isUnit = function () {
  var _ = this; return _.eql(_._unit())
}
Algebraic.prototype.isBody = function () {
  var _ = this; return _.eql(_._body())
}
Algebraic.prototype.isSgn = function () {
  var _ = this; return _.eql(_._sgn())
}
Algebraic.prototype.cmp = function (a) {
  var _ = this, __ = _.coerce(a)
  return __[1]._cmp(__[0])
}
Algebraic.prototype.lt = function (a) {
  var _ = this; return _.cmp(a) < 0
}
Algebraic.prototype.gt = function (a) {
  var _ = this; return _.cmp(a) > 0
}
Algebraic.prototype.lte = function (a) {
  var _ = this; return _.cmp(a) <= 0
}
Algebraic.prototype.gte = function (a) {
  var _ = this; return _.cmp(a) >= 0
}
Algebraic.prototype.isRedundant = function (a) {
  return isZero()
}
// generation
Number.prototype.finalize = function () {
  var _ = this.valueOf()
  return !Number.isInteger(_) ? _
  : _.isSmall() ? _
  : _.toSeq()
}
Number.prototype.coerce = function (a) {
  var _ = this.valueOf()
  return _.eq(a) ? [a, _] : a.coerce(_).reverse()
}
// operation
Number.prototype._zero = function () {
  return 0
}
Number.prototype._unity = function () {
  return 1
}
Number.prototype._unit = function () {
  var _ = this
  return _ < 0 ? -1 : 1
}
Number.prototype._body = function () {
  var _ = this.valueOf()
  return _ < 0 ? -_ : _
}
Number.prototype._neg = function () {
  return -this
}
Number.prototype._res = function () {
  var _ = this.valueOf()
  return Number.isInteger(_) ?
  new Adele(0, 1, this.valueOf()) : implement()
}
Number.prototype._inv = function () {
  throw new Error
  return 1/this
}
Number.prototype._inv = function () {
  var _ = this.valueOf()
  return _.isZero()     ? nil
  : _.isUnit()          ? _.unit()
  : Number.isInteger(_) ? new Adele(1, _.valueOf())
  : 1/_
}
Number.prototype._add = function (a) {
  return this + a
}
Number.prototype._mul = function (a) {
  return this * a
}
Number.prototype._divmod = function (a) {
  var _ = this.valueOf(), r
  if (a) {
    r = _ % a
    r < 0 && (r += a)
    return [(_ - r)/a, r]
  } else
  {
    return [0, _]
  }
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
// relation
Number.prototype._eql = function (a) {
  var _ = this; return _ == a
}
Number.prototype._cmp = function (a) {
  var _ = this; return (_ - a).sgn()
}
// misc
//Number.prototype.base = 1 << 26
Number.prototype.base = 10
Number.prototype.split = function () {
  var _ = this.valueOf()
  return _._divmod(_.base).reverse()
}
Number.prototype.join = function (a) {
  var _ = this.valueOf()
  return _ * _.base + a
}
Number.prototype.complement = function () {
  var _ = this
  return _.base - 1 - _
}
Number.prototype.implicit = function () {
  var _ = this
  return _ < _.base/2 ? 0 : _.base - 1
}
Number.prototype.toValue = function () {
  var _ = this.valueOf()
  return _ < _.base/2 ? _ : _ - _.base
}
Number.prototype.isSmall = function () {
  var _ = this
  return -_.base/2 <= _ && _ < _.base/2
}
Number.prototype.isRedundant = function (a) {
  var _ = this.valueOf(), b = _.base
  return (_ === 0 && a < b/2) || (_ === b - 1 && a >= b/2)
}
Number.prototype.toSeq = function () {
  var _ = this.valueOf(), a = [], __
  assert(Number.isInteger(_))
  if (_ < 0) {
    return (-_).toSeq()._neg()
  }
  while (_) {
    __ = _.split(); a.push(__[0]); _ = __[1]
  }
  a[a.length - 1] < _.base/2 || a.push(0)
  return new Seq(a)
}
Number.prototype.forEach = function (a) {
  var i = 0
  while (i < this) { a(i++) }
}

// generation
Seq.prototype.finalize = function () {
  var _ = this
  return _._.length === 1 ? _._[0].toValue() : _
}
Seq.prototype.canonicalize = function () {
  // ! side effect type
  var _ = this._, c = _[0]._zero()
  c.split && _.forEach(function (a, i) {
    var __ = c._add(a).split(); _[i] = __[0]; c = __[1]
  })
  return this
}
Seq.prototype.removeRedundancy = function () {
  // ! side effect type
  var _ = this._, a, b
  if (_.length > 1) {
    a = _[_.length - 1], b = _[_.length - 2]
    while (a.isRedundant(b)) {
      _.pop(); a = b; b = _[_.length - 2]
    }
  }
  return this
}
Seq.prototype.coerce = function (a) {
  var _ = this, r = []
  if (a.eq(_)) {
    //
  } else
  if (a.eq(0)) {
    a = a.toSeq()
  }
  return [a, _]
}
// operation
Seq.prototype._zero = function () {
  var _ = this._
  return new Seq([_[0]._zero()])
}
Seq.prototype._unity = function () {
  var _ = this._
  return new Seq([_[0]._unity()])
}
Seq.prototype._unit = function () {
  var _ = this
  return new Seq([_.implicit() || 1])
}
Seq.prototype._body = function () {
  var _ = this
  return _._mul(_._unit())
}
Seq.prototype.__neg = function () {
  var _ = this
  return _.complement().__add(_._unity())
}
Seq.prototype._neg = function () {
  return this.__neg().removeRedundancy()
}
Seq.prototype._inv = error
Seq.prototype.__add = function (a) {
  var _ = this, ai = a.implicit()
  if (_._.length < a._.length) {
    return a.__add(_)
  }
  _._.forEach(function (e, i) {
    _._[i] = e._add(a._[i] || ai)
  })
  return _.canonicalize()
}
Seq.prototype._add = function (a) {
  var _ = this, _i = _.implicit(), ai = a.implicit()
  _ = _._.slice(0); a = a._.slice(0)
  _.push(_i); a.push(ai)
  _ = new Seq(_); a = new Seq(a)
  return _.__add(a).removeRedundancy()
}
Seq.prototype.__mul = function (a) {
  var _ = this, r = []
  _ = _._.slice(0); a = a._.slice(0)
  _.forEach(function (_, i) {
    a.forEach(function (a, j) {
      j += i
      r[j] = (r[j] || 0) + _ * a
    })
  })
  return new Seq(r).canonicalize()
}
Seq.prototype._mul = function (a) {
  var _ = this, _i = _.implicit(), ai = a.implicit()
  _ = _._.slice(0); a = a._.slice(0)
  _.push(_i); a.push(ai)
  _ = new Seq(_); a = new Seq(a)
  return _.__mul(a).removeRedundancy()
}
Seq.prototype.__divmod = function (a) {
  var _ = this, q, r, aq, i
  q = _.last().join(_.next()).div(a.last() || a.next())
  q.__proto__ === Seq.prototype && (q = Number.prototype.base - 1)
  i = _._.length - a._.length
  r = _._.slice(0, i); _ = _._.slice(i)
  _ = new Seq(_)
  aq = a.mul(q)
  while (_.lt(aq)) {
    q--
    aq = a.mul(q)
  }
  aq && (_ = _.__add(aq.__neg()))
  return [q, new Seq(r.concat(_._))]
}
Seq.prototype._divmod = function (a) {
  var _ = this, al, d, q = [], __, _a, b
  if (a.isZero()) {
    return [_.zero(), _]
  } else
  if (a._.length === 1) {
    a = a.first()
    _ = new Seq([_._.slice(0).reverse().reduce(function(prev, curr) {
      __ = prev.join(curr).divmod(a)
      q.push(__[0]); return __[1]
    }, 0)])
    q.reverse()
    q = new Seq(q)
    return [q, _]
  } else
  {
    al = a.last() || a.next()
    d = _.first().base.div(al.succ())
    _ = _.mul(d); _a = a; a = a.mul(d)
    while (_.gt(a)) {
      __ = _.__divmod(a)
      q.push(__[0]); _ = __[1]
    }
    q.reverse()
    q = new Seq(q)
    _ = this.sub(_a.mul(q)) //
    return [q, _]
  }
}
Seq.prototype._eql = function (a) {
  return this._.eql(a._)
}
Seq.prototype._cmp = function (a) {
  return this.sub(a).sgn()
}
Seq.prototype.complement = function () {
  var _ = this
  return new Seq(_._.map(function (a) {
    return a.complement()
  }))
}
Seq.prototype.implicit = function () {
  return this.last().implicit()
}
Seq.prototype.first = function () {
  var _ = this._
  return _[0]
}
Seq.prototype.last = function () {
  var _ = this._
  return _[_.length - 1]
}
Seq.prototype.next = function () {
  var _ = this._
  return _[_.length - 2]
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
    _r = _.r.mul(_u.__inv(n)).mul(s.div(_s))
    ar = a.r.mul(au.__inv(n)).mul(s.div(as))
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
Adele.prototype._zero = function () {
  var _ = this
  return new Adele(_.r.zero(), _.s, _.n)
}
Adele.prototype._neg = function () {
  var _ = this
  return new Adele(_.r.neg(), _.s, _.n)
}
Adele.prototype._res = function () {
  var _ = this, __, u, n
  // return if unit? in ruby
  __ = _.r.ub(_.n); u = __[0]; n = __[1]
  return new Adele(_.r.zero(), _.s.unity(), n)
}
Adele.prototype._add = function (a) {
  var _ = this
  return new Adele(_.r.add(a.r), _.s, _.n)
}
Adele.prototype._unity = function () {
  var _ = this
  return new Adele(_.r.unity(), _.s.unity(), _.n)
}
Adele.prototype._inv = function () {
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
Adele.prototype._unit = function () {
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
Adic.prototype._zero = function () {
  var _ = this
  return new Adic(_.b.unity(), _.u.zero())
}
Adic.prototype._neg = function () {
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
Adic.prototype._unity = function () {
  var _ = this
  return new Adic(_.b.unity(), _.u.unity())
}
Adic.prototype._unit = function () {
  var _ = this
  return new Adic(_.b.unity(), _.u)
}
Adic.prototype._inv = function () {
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
Adic.prototype._log = function () {
  var _ = this, u, x
  u = _.u.mul(_.sgn().inv())
  x = u.unity().add(u.inv().neg())
//  _ = x + x^2/2 + x^3/3 + ...
  return _
}
Adic.prototype._exp = function () {
  var _ = this, x
// _ = 1 + x + x^2/2! + x^3/3! + ...
  return _
}
Adic.prototype._sgn = function () {
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
Arch.prototype._zero = function () {
  return new Arch(-Infinity, this.arg)
}
Arch.prototype._neg = function () {
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
Arch.prototype._unity = function () {
  return new Arch(this.ord.zero(), this.arg.zero())
}
Arch.prototype._inv = function () {
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
Arch.prototype._log = function () {
  var _ = this
  return _.isUnity() ?
    this.zero() :
    new Arch(
      _.ord.mul(_.ord).add(_._arg().mul(_._arg())).log().mul(0.5),
      _._arg().atan2(_.ord).mul(1/(Math.PI*2))
    )
}
Arch.prototype._exp = function () {
  var _ = this, __ = _.ord.exp()
  return new Arch(
    __.mul(_._arg().cos()),
    __.mul(_._arg().sin()).mul(1/(Math.PI*2))
  )
}
Arch.prototype._unit = function () {
  return new Arch(this.ord.zero(), this.arg)
}
Arch.prototype._abs = function () {
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
