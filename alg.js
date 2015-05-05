function error() {
  throw new Error
}
function assert(a, msg) {
  if (!a) {
    throw new Error(msg || 'assertion failed')
  }
}
function Algebraic() {}
function Numbers(a) {
  a || (a = [0])
  a[0] || (a[0] = 0)
  this._ = a
}
;[Number, Numbers].forEach(function (a) {
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
// generation
Number.prototype.finalize = function () {
  var _ = this.valueOf(), a = [], __
  return _.isSmall() ? _ : _.toNumbers()
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
Number.prototype._inv = function () {
  return 1/this
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
Number.prototype.isSmall = function () {
  var _ = this
  return -_.base/2 <= _ && _ < _.base/2
}
Number.prototype.toNumbers = function () {
  var _ = this.valueOf(), a = [], __
  assert(Number.isInteger(_))
  if (_ < 0) {
    return (-_).toNumbers().complement()._add(new Numbers([1]))
  }
  while (_) {
    __ = _.split(); a.push(__[0]); _ = __[1]
  }
  a[a.length - 1] < _.base/2 || a.push(0)
  return new Numbers(a)
}
Number.prototype.forEach = function (a) {
  var i = 0
  while (i < this) { a(i++) }
}

// generation
Numbers.prototype.finalize = function () {
  var _ = this
  if (_._.length === 1) {
    _ = _._[0]
    _ > _.base/2 && (_ -= _.base)
  }
  return _
}
Numbers.prototype.coerce = function (a) {
  var _ = this, r = []
  if (a.eq(_)) {
    //
  } else
  if (a.eq(0)) {
    a = a.toNumbers()
  }
  return [a, _]
}
// operation
Numbers.prototype._zero = function () {
  var _ = this._
  return new Numbers([_[0].zero()])
}
Numbers.prototype._unity = function () {
  var _ = this._
  return new Numbers([_[0].unity()])
}
Numbers.prototype._unit = function () {
  var _ = this
  return _.implicit().isZero() ? _._unity() : new Numbers([_.implicit()])
}
Numbers.prototype._body = function () {
  var _ = this
  return _._mul(_._unit())
}
Numbers.prototype.complement = function () {
  var _ = this
  return new Numbers(_._.map(function (a) {
    return a.complement()
  }))
}
Numbers.prototype._neg = function () {
  var _ = this
  return _.isZero() ? _ : _.complement()._add(_._unity())
}
Numbers.prototype._inv = error
Numbers.prototype.implicit = function () {
  var _ = this._
  return _[_.length - 1].implicit()
}
Numbers.prototype._add = function (a) {
  var _ = this, r = [], _i = _.implicit(), ai = a.implicit()
  _ = _._.slice(0); a = a._.slice(0)
  _.push(_i); a.push(ai)
  Math.max(_.length, a.length).forEach(function (i) {
    var __
    r[i] === undefined && (r[i] = 0)
    _[i] === undefined && (_[i] = _i)
    a[i] === undefined && (a[i] = ai)
    __ = (r[i] + _[i] + a[i]).split()
    r[i] = __[0]; r[i+1] = __[1]
  })
  r.pop()
  r = new Numbers(r)
  while (r.isRedundant()) {
    r._.pop()
  }
  return r
}
Numbers.prototype._mul = function (a) {
  var _ = this, r = [], _i = _.implicit(), ai = a.implicit()
  _ = _._.slice(0); a = a._.slice(0)
  _.push(_i); a.push(ai)
  _.forEach(function (_, i) {
    a.forEach(function (a, j) {
      j += i
      r[j] = (r[j] || 0) + _ * a
    })
  })
  var tmp = []
  r.reduce(function (prev, curr) {
    var __ = (prev + curr).split()
    tmp.push(__[0])
    return __[1]
  }, 0)
  r = new Numbers(tmp)
  while (r.isRedundant()) {
    r._.pop()
  }
  return r
}
Numbers.prototype.q = function (a) {
  var _ = this, _0, _1, a0, q, s
  console.log('[q]')
  console.log([_, a])
  _0 = _._[_._.length - 1]
  _1 = _._[_._.length - 2]
  a0 = a._[a._.length - 1]
  q = _0.join(_1).div(a0)
  q.__proto__ === Numbers.prototype && (q = Number.prototype.base - 1)
  s = new Numbers(_._.slice(_._.length - a._.length - 1, _._.length + 1))
  while (s.sub(a.mul(q)).lt(0)) {
    q--
  }
  var __0 = _._.slice(0, _._.length - a._.length - 1)
  var __1 = s.sub(a.mul(q))
  if (__1.__proto__ === Number.prototype) {
    __1 = __1.toNumbers()
  }
  __1 = __1._
  console.log([__0, __1])
  return [q, new Numbers(__0.concat(__1))]
}
Numbers.prototype._divmod = function (a) {
  var _ = this, q = [], __
  if (a.isZero()) {
    return [_.zero(), _]
  } else
  {
    while (_.gt(a)) {
      __ = _.q(a); q.push(__[0]); _ = __[1]
    }
    q.reverse()
    q = new Numbers(q)
    return [q, _]
  }
}
Numbers.prototype._eql = function (a) {
  return this._.eql(a._)
}
Numbers.prototype._cmp = function (a) {
  return this.sub(a).sgn()
}
Numbers.prototype.isRedundant = function () {
  var _ = this._
    , base = _[0].base
    , a = _[_.length - 1]
    , b = _[_.length - 2]
  if (_.length === 1) {
    return false
  } else
  if (a === 0        && b <  base/2) {
    return true
  } else
  if (a === base - 1 && b >= base/2) {
    return true
  } else
  {
    return false
  }
}
