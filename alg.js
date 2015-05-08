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
;[Number, Seq].forEach(function (a) {
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
  return _.isSmall() ? _ : _.toSeq()
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
  throw new Error
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
  var _ = this, al, d, q = [], __, _a
  if (a.isZero()) {
    return [_.zero(), _]
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
