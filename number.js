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
function Nums(a) {
  this._ = a || []
  if (this._[0]) {
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
