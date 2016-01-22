Number.parse = function (a) {
  var ord, r, s, _

  a = a.split('.'); a[1] || (a[1] = '')
  _ = a[0] + a[1]
  if (Number.isLittle) {
    ord = a[0].length - 1
    _ = _.split('').reverse().join('')
  } else
  {
    ord = a[1].length
  }
  r = parseInt(_, Number.radix)
  s = Math.pow(Number.radix, ord)
  return new Adele(r, s).finalize
}
Object.defineProperties(Number.prototype, {
  divmod: { value: function (a) {
  var _ = this.valueOf(), q, r

  a = (a || 0).body
  if (a === 0) {
    return [0, _]
  }

  r = _ % a; r < 0 && (r += a)
  q = (_ - r) / a
  return [q, r]
}}
, eql: { value: function (a) { return this === a }}
, div: { value: function (a) { return this.divmod(a)[0] } }
, mod: { value: function (a) { return this.divmod(a)[1] } }
, gcd: { value: function (a) {
  var _ = this.body, __

  a = (a || 0).body
  while (a !== 0) {
    __ = [a, _.mod(a)]; _ = __[0]; a = __[1]
  }
  return _
}}
, lcm: { value: function (a) {
  var _ = this.body

  a = (a || 1).body
  return _ * a / _.gcd(a)
}}
, _inv: { value: function (a) {
  var _ = this.valueOf(), x = 1, z = 0, __, q, r, n

  n = a = (a || 0).body
  if (a === 0 && _ === -1)
    return -1

  while (a !== 0) {
    __ = _.divmod(a); q = __[0]; r = __[1]
    __ = [a, r, z, x - q * z]
    _ = __[0]; a = __[1]; x = __[2]; z = __[3]
  }
  return x.mod(n)
}}
, zero: { value: 0 }
, unity: { value: 1 }
, unit: { get: function () { return this < 0 ? -1 : 1 }}
, body: { get: function () { return Math.abs(this) }}
, isZero: { get: function () {
  var _ = this

  return _.eql(_.zero)
}}
, isUnity: { get: function () {
  var _ = this

  return _.eql(_.unity)
}}
, isUnit: { get: function () {
  var _ = this

  return _.eql(_.unit)
}}
, isBody: { get: function () {
  var _ = this

  return _.eql(_.body)
}}
, factor: { get: function () {
  var _ = this.body, p = 7, bound = Math.sqrt(_) + 1

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
}}
, factorize: { get: function() {
  var _ = this.valueOf(), fs = {}, p

  while (_ !== 1) {
    p = _.factor
    fs[p] || (fs[p] = 0)
    fs[p] += 1
    _ /= p
  }
  return fs
}}
, ub: { value: function (a) {
  var _ = this.valueOf(), b = 1, d

  a = (a || 0).body
  if (_ * a === 0) {
    return [_.unit, _.body]
  }
  while (true) {
    d = _.gcd(a)
    if (d === 1) {
      break
    }
    _ /= d; b *= d
  }
  return [_, b]
}}
, toArray: { value: function () {
  var _ = [], i = 0, j = this

  i > j && (i = j, j = 0)
  while (i < j) _.push(i++)
  return _
}}
, forEach: { value: function (a, b, c) {
  this.toArray().forEach(a, b, c)
}}
, map: { value: function (a, b, c) {
  return this.toArray().map(a, b, c)
}}
, s: { get: function () {
  var _ = this.body.toString(Number.radix).split('').reverse()

  return (this < 0 ? '-' : '') + (
    Number.isLittle ? [_[0], '.'].concat(_.slice(1)) :
                      _.reverse()
  ).join('')
}}
})

function Arch(ord, arg) {
  ord = ord || 0; arg = arg || 0
  arg %= 1; arg < 0 && (arg += 1)
  this.ord = ord; this.arg = arg
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

Object.setPrototypeOf(Arch.prototype, Number.prototype)

Arch.precision = 8

var PI2 = Math.PI * 2

Object.defineProperties(Arch.prototype, {
  amp: { get: function () {
    var _ = this.arg
    _ < 0.5 || (_ -= 1); _ *= PI2
    return _
  } }
, eql:   { value: function (a) { return a !== 0 && this.ord === a.ord && this.arg === a.arg } }
, shift: { get: function () { return new Arch(this.ord + 1, this.arg) } }
, succ:  { get: function () { return this.exp.shift.log } }
, conj:  { get: function () { return new Arch(this.ord, - this.arg) } }
, inv:   { get: function () { return new Arch(- this.ord, - this.arg) } }
, mul:   { value: function (a) { return a === 0 ? 0 : new Arch(this.ord + a.ord, this.arg + a.arg) } }
, neg:   { get: function () { return new Arch(this.ord, this.arg + 0.5) } }
, add:   { value: function (a) { return a === 0 ? this : this.neg.eql(a) ? 0 : this.ord < a.ord ? a.add(this) : this.mul(this.inv.mul(a).succ) } }
, log:   { get: function () {
  var _ = this
  return _.isUnity
  ? 0
  : new Arch((_.ord * _.ord + _.amp * _.amp).log * 0.5, _.amp.atan2(_.ord) / PI2)
} }
, exp:   { get: function () {
  var _ = this
  return new Arch(_.ord.exp * _.amp.cos, _.ord.exp * _.amp.sin / PI2)
} }
, toString: { value: function () {
  var _ = this, ord, arg

  ord = _.ord.toFixed(Arch.precision).split('.')
  arg = _.arg.toFixed(Arch.precision).split('.')
  ord[1] = ord[1] || '0'
  arg[1] = arg[1] || '0'
  return ord[0] + '.' + ord[1] + '.' + arg[1] + 'X'
}}
})

function Adele(r, s, n) {
  var _ = this, __, u

  r = r || 0; s = s || 1; n = n || 0
  n = n.body
  __ = s.ub(n); u = __[0]; s = __[1]
  r = (r * u._inv(n)).mod(n * s)
  _.r = r; _.s = s; _.n = n
  _._r = n === 0 ? r :
         r < n/2 ? r :
         r - n
}
var nil = new Adele(0, 0, 1)
Object.defineProperties(Adele.prototype, {
  finalize: { get: function () {
  var _ = this, d, r, s

  if (_.n === 1 || _.s === 0) {
    return nil
  }
  d = _.r.gcd(_.s); r = _.r.div(d); s = _.s.div(d)
  return new Adele(r, s, _.n)
}}
, coerce: { value: function (a) {
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
}}
, eql: { value: function (a) {
  var _ = this
  return _.n === a.n && _.r === a.r && _.s === a.s
}}
, zero: { get: function () {
  var _ = this
  return new Adele(0, _.s, _.n)
}}
, neg: { get: function () {
  var _ = this
  return _.eql(nil) ? nil : new Adele(-_.r, _.s, _.n)
}}
, res: { get: function () {
  var _ = this, __, u, n
  // return if unit? in ruby
  __ = _.r.ub(_.n); u = __[0]; n = __[1]
  return new Adele(0, 1, n)
}}
, add: { value: function (a) {
  return this._add(a).finalize()
}}
, _add: { value: function (a) {
  var __ = this.coerce(a)
  return __[0].__add(__[1])
}}
, __add: { value: function (a) {
  var _ = this
  return _.eql(nil) ? nil :
         new Adele(_.r + a.r, _.s, _.n)
}}
, unity: { get: function () {
  var _ = this
  return new Adele(_.s, _.s, _.n)
}}
, inv: { get: function () {
  var _ = this, r, s, __, u

  if (_.r === 0) {
    return nil
  }
  __ = _.r.ub(_.n); u = __[0]; s = __[1]
  r = _.s * u._inv(_.n)
  return new Adele(r, s, _.n)
}}
, mul: { value: function (a) {
  return this._mul(a).finalize()
}}
, _mul: { value: function (a) {
  var __ = this.coerce(a)

  return __[0].__mul(__[1])
}}
, __mul: { value: function (a) {
  var _ = this

  return _.eql(nil) ? nil :
         new Adele(_.r * a.r, _.s * a.s, _.n)
}}
, pow: { value: function (a) {
  var _ = this, __ = _.unity

  a = a.r
  while (a) {
    a.mod(2) === 1 && (__ = __.mul(_))
    _ = _.mul(_); a = a.div(2)
  }
  return __
}}
, unit: { get: function () {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[0]
  return new Adele(r, 1, _.n)
}}
, body: { get: function () {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[1]
  return new Adele(r, _.s, 0)
}}
, factor: { get: function () {
  var _ = this, p = (_.r * _.s).factor

  if (_.r % p) {
    return [new Adele(1, p), new Adele(_.r, _.s/p)]
  } else {
    return [new Adele(p, 1), new Adele(_.r/p, _.s)]
  }
}}
, toString: { value: function () {
  var _ = this, __ = ''

  if (_.eql(nil)) {
    return 'nil'
  }
  _.n === 0 || (__ +=       _.n.toString() + '\\')
                __ +=       _.r.toString()
  _.s === 1 || (__ += '/' + _.s.toString())
  return __
}}
})
