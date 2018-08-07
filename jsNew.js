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
Reflect.ownKeys(Math)
.filter((p) => (
  typeof Math[p] === 'function'
))
.map((p) => (
  Object.defineProperty(
    Number.prototype
  , p
  , Math[p].length < 2
  ? {
    get() {
      return Math[p](this)
    }
  }
  : {
    value(a) {
      return Math[p](this, a)
    }
  }
)))
Object.defineProperties(BigInt.prototype, {
  divmod: { value(a) {
  var _ = this.valueOf(), q, r

  a = (a || 0n).body
  if (a === 0n) {
    return [0n, _]
  }

  r = _ % a; r < 0n && (r += a)
  q = (_ - r) / a
  return [q, r]
}}
, eql: { value(a) { return this.valueOf() === a }}
, div: { value(a) { return this.divmod(a)[0] } }
, mod: { value(a) { return this.divmod(a)[1] } }
, gcd: { value(a) {
  var _ = this.body

  a = (a || 0n).body
  while (a !== 0n) {
    [_, a] = [a, _.mod(a)]
  }
  return _
}}
, lcm: { value(a) {
  var _ = this.body

  a = (a || 1n).body
  return _ * a / _.gcd(a)
}}
, _inv: { value(a) {
  var _ = this.valueOf(), x = 1n, z = 0n, q, r, n

  n = a = (a || 0n).body
  if (a === 0n && _ === -1n)
    return -1n

  while (a !== 0n) {
    [q, r] = _.divmod(a)
    console.log({x, q, z});
    [_, a, x, z] = [a, r, z, x - q * z]
  }
  return x.mod(n)
}}
, zero: { value: 0n }
, unity: { value: 1n }
, unit: { get() { return this < 0n ? -1n : 1n }}
, body: { get() { return this < 0n ? -this : this.valueOf()}}
, isZero: { get() { return this.eql(this.zero) } }
, isUnity: { get() { return this.eql(this.unity) } }
, isUnit: { get() { return this.eql(this.unit) } }
, isBody: { get() { return this.eql(this.body) } }
, factor: { get() {
  var _ = this.body, p = 7n

  if (!(_ % 2n))
    return 2n
  if (!(_ % 3n))
    return 3n
  if (!(_ % 5n))
    return 5n

  while (p * p < _) {
    if (!(_ % p)) //  7
      return p
    p += 4n
    if (!(_ % p)) // 11
      return p
    p += 2n
    if (!(_ % p)) // 13
      return p
    p += 4n
    if (!(_ % p)) // 17
      return p
    p += 2n
    if (!(_ % p)) // 19
      return p
    p += 4n
    if (!(_ % p)) // 23
      return p
    p += 6n
    if (!(_ % p)) // 29
      return p
    p += 2n
    if (!(_ % p)) //  1
      return p
    p += 6n
  }
  return _
}}
, factorize: { get() {
  var _ = this.valueOf(), fs = {}, p

  while (_ !== 1n) {
    p = _.factor
    fs[p] || (fs[p] = 0n)
    fs[p] += 1n
    _ /= p
  }
  return fs
}}
, ub: { value(a) {
  var _ = this.valueOf(), b = 1n, d

  a = (a || 0n).body
  if (_ === 0n || a === 0n) {
    return [_.unit, _.body]
  }
  while (true) {
    d = _.gcd(a)
    if (d === 1n) {
      break
    }
    _ /= d; b *= d
  }
  return [_, b]
}}
, toArray: { value() {
  var _ = [], i = 0n, j = this

  i > j && (i = j, j = 0n)
  while (i < j) _.push(i++)
  return _
}}
, forEach: { value(a, b, c) {
  this.toArray().forEach(a, b, c)
}}
, map: { value(a, b, c) {
  return this.toArray().map(a, b, c)
}}
, s: { get() {
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
  amp: { get() {
    var _ = this.arg
    _ < 0.5 || (_ -= 1); _ *= PI2
    return _
  } }
, eql:   { value(a) { return a !== 0 && this.ord === a.ord && this.arg === a.arg } }
, shift: { get() { return new Arch(this.ord + 1, this.arg) } }
, succ:  { get() { return this.exp.shift.log } }
, conj:  { get() { return new Arch(this.ord, - this.arg) } }
, inv:   { get() { return new Arch(- this.ord, - this.arg) } }
, mul:   { value(a) { return a === 0 ? 0 : new Arch(this.ord + a.ord, this.arg + a.arg) } }
, neg:   { get() { return new Arch(this.ord, this.arg + 0.5) } }
, add:   { value(a) { return a === 0 ? this : this.neg.eql(a) ? 0 : this.ord < a.ord ? a.add(this) : this.mul(this.inv.mul(a).succ) } }
, log:   { get() {
  var _ = this
  return _.isUnity
  ? 0
  : new Arch((_.ord * _.ord + _.amp * _.amp).log * 0.5, _.amp.atan2(_.ord) / PI2)
} }
, exp:   { get() {
  var _ = this
  return new Arch(_.ord.exp * _.amp.cos, _.ord.exp * _.amp.sin / PI2)
} }
, toString: { value() {
  var _ = this, ord, arg

  ord = _.ord.toFixed(Arch.precision).split('.')
  arg = _.arg.toFixed(Arch.precision).split('.')
  ord[1] = ord[1] || '0'
  arg[1] = arg[1] || '0'
  return ord[0] + '.' + ord[1] + '.' + arg[1] + 'X'
}}
})

function Adele(r = 0n, s = 1n, n = 0n) {
  var _ = this, u

  n = n.body
  console.log({ s, n });
  [u, s] = s.ub(n)
  console.log({ u, s })
  r = (r * u._inv(n)).mod(n * s)
  _.r = r; _.s = s; _.n = n
}
const nil = new Adele(0n, 0n, 1n)
Object.defineProperties(Adele.prototype, {
  finalize: { get() {
  var _ = this, d, r, s

  if (_.n === 1n || _.s === 0n) {
    return nil
  }
  d = _.r.gcd(_.s); r = _.r.div(d); s = _.s.div(d)
  return new Adele(r, s, _.n)
}}
, coerce: { value(a) {
  var _ = this, n, _u, _s, au, as, s, _r, ar

  n = _.n.gcd(a.n)
  if (n === 1n) {
    return [nil, nil]
  }
  [_u, _s] = _.s.ub(n)
  [au, as] = a.s.ub(n)
  s = _s.lcm(as)
  _r = _.r * _u._inv(n) * s.div(_s)
  ar = a.r * au._inv(n) * s.div(as)
  _ = new Adele(_r, s, n)
  a = new Adele(ar, s, n)
  return [a, _]
}}
, eql: { value(a) {
  var _ = this
  return _.n === a.n && _.r === a.r && _.s === a.s
}}
, zero: { get() {
  var _ = this
  return new Adele(0n, _.s, _.n)
}}
, neg: { get() {
  var _ = this
  return _.eql(nil) ? nil : new Adele(-_.r, _.s, _.n)
}}
, res: { get() {
  var _ = this, u, n
  // return if unit? in ruby
  [u, n] = _.r.ub(_.n)
  return new Adele(0, 1, n)
}}
, add: { value(a) {
  return this._add(a).finalize()
}}
, _add: { value(a) {
  var __ = this.coerce(a)
  return __[0].__add(__[1])
}}
, __add: { value(a) {
  var _ = this
  return _.eql(nil) ? nil :
         new Adele(_.r + a.r, _.s, _.n)
}}
, unity: { get() {
  var _ = this
  return new Adele(_.s, _.s, _.n)
}}
, inv: { get() {
  var _ = this, r, s, __, u

  if (_.r === 0n) {
    return nil
  }
  [u, s] = _.r.ub(_.n)
  r = _.s * u._inv(_.n)
  return new Adele(r, s, _.n)
}}
, mul: { value(a) {
  return this._mul(a).finalize()
}}
, _mul: { value(a) {
  var __ = this.coerce(a)

  return __[0].__mul(__[1])
}}
, __mul: { value(a) {
  var _ = this

  return _.eql(nil) ? nil :
         new Adele(_.r * a.r, _.s * a.s, _.n)
}}
, pow: { value(a) {
  var _ = this, __ = _.unity

  a = a.r
  while (a) {
    a.mod(2) === 1 && (__ = __.mul(_))
    _ = _.mul(_); a = a.div(2)
  }
  return __
}}
, unit: { get() {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[0]
  return new Adele(r, 1n, _.n)
}}
, body: { get() {
  var _ = this, __

  __ = _.r.ub(_.n); r = __[1]
  return new Adele(r, _.s, 0n)
}}
, factor: { get() {
  var _ = this, p = (_.r * _.s).factor

  if (_.r % p) {
    return [new Adele(1n, p), new Adele(_.r, _.s/p)]
  } else {
    return [new Adele(p, 1n), new Adele(_.r/p, _.s)]
  }
}}
, toString: { value() {
  var _ = this, __ = ''

  if (_.eql(nil)) {
    return 'nil'
  }
  _.n === 0n || (__ +=       _.n.toString() + '\\')
                 __ +=       _.r.toString()
  _.s === 1n || (__ += '/' + _.s.toString())
  return __
}}
})

module.exports = { Adele, Arch }
