Object.prototype.eql = function (a) {
  return this.__proto__ === a.__proto__ && this._eql(a)
}
Object.prototype._eql = function (a) {
  return this === a
}
Array.prototype._eql = function (a) {
  return this.length === a.length && this.every(function (e, i) { return e === a[i] })
}
Number.prototype._eql = function (a) {
  return this == a
}
Number.prototype.coerce = function (a) {
  if (Number.prototype === a.__proto__) {
    return [this, a]
  } else
  {
    return a.coerce(this)
  }
}
Number.prototype.zero = function () {
  return 0
}
Number.prototype.add = function (a) {
  var _ = this.coerce(a)
  return _[0]._add(_[1])
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
Number.prototype.mul = function (a) {
  var _ = this.coerce(a)
  return _[0]._mul(_[1])
}
Number.prototype._mul = function (a) {
  return this * a
}
Number.prototype.inv = function () {
  return new Adele(1, this.valueOf(), 0)
}
Number.prototype.divmod = function (a) {
  var _ = this.coerce(a)
  return _[0]._divmod(_[1])
}
Number.prototype._divmod = function (a) {
  var _ = this % a
  return [(this - _)/a, _]
}
function Nums(a) {
  this._ = a || []
}
Object.setPrototypeOf(Nums.prototype, Number.prototype)
Nums.zero = new Nums([])
Nums.unity = new Nums([1])
Nums.prototype.coerce = function (a) {
  var _
  if (a.__proto__ === Nums.prototype) {
    return [this, a]
  } else
  if (a.__proto__ === Number.prototype) {
    if (a >= 0) {
      _ = []
      while (a) {
        _.push(a & 0xff)
        a >>= 8
      }
      _[_.length - 1] & 0x80 && _.push(0)
      return [this, new Nums(_)]
    } else
    {
      return [this, this.coerce(-a)[1].neg()]
    }
  } else
  {
    return a.coerce(this)
  }
}
Nums.prototype._eql = function (a) {
  return this._._eql(a._)
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
