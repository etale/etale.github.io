class Algebraic {
  _eql(a) { throw new Error('_eql is missing') }
  coerce(a) { throw new Error('coerce is missing') }
  get finalize() { throw new Error('finalize is missing') }
  get _zero() { throw new Error('_zero is missing') }
  get _unity() { throw new Error('_unity is missing') }
  get _neg() { throw new Error('_neg is missing') }
  get _res() { throw new Error('_res is missing') }
  get _inv() { throw new Error('_inv is missing') }
  _add(a) { throw new Error('_add is missing') }
  _mul(a) { throw new Error('_mul is missing') }
  _divmod(a) { throw new Error('_divmod is missing') }
  _cmp(a) { throw new Error('_cmp is missing') }

  eq(a) {
    return (
      Reflect.getPrototypeOf(this) ===
      Reflect.getPrototypeOf(Object(a))
    )
  }
  eql(a) {
    return (
      this.eq(a) && this._eql(a)
    )
  }
  cast(a) {
    return (
      (([_, a]) => (
        a
      ))
      (this.coerce(a))
    )
  }
  get zero() {
    return this._zero.finalize
  }
  get unity() {
    return this._unity.finalize
  }
  get neg() {
    return this._neg.finalize
  }
  get res() {
    return this._res.finalize
  }
  get inv() {
    return this._inv.finalize
  }
  add(a) {
    return (
      (([_, a]) => (
        _._add(a).finalize
      ))
      (this.coerce(a))
    )
  }
  mul(a) {
    return (
      (([_, a]) => (
        _._mul(a).finalize
      ))
      (this.coerce(a))
    )
  }
  divmod(a) {
    return (
      (([_, a]) => (
        (([_, a]) => (
          [_, a] // [_.finalize, a.finalize]
        ))
        (_._divmod(a))
      ))
      (this.coerce(a))
    )
  }
  pow(a) {
    if (a < 0) {
      return this.pow(-a).inv
    }
    let _ = this
    let r = _._unity

    while (a) {
      if (a & 1 === 1) {
        r = r.mul(_)
      }
      [_, a] = [_._mul(_), a >>> 1]
    }

    return r.finalize
  }
  div(a) {
    return (
      (([q, r]) => (
        q
      ))
      (this.divmod(a))
    )
  }
  mod(a) {
    return (
      (([q, r]) => (
        r
      ))
      (this.divmod(a))
    )
  }
  gcd(a) {
    let _ = this.abs
    a = a.abs
    while (!a.isZero) {
      [_, a] = [a, _.mod(a)]
    }
    return _
  }
  lcm(a) {
    return (
      ((_, a) => (
        _.mul(a).div(_.gcd(a))
      ))
      (this.abs, a.abs)
    )
  }
  ub(a) {
    let _ = this.finalize
    if (_.isZero || a.isZero) {
      return [_.unit, _.abs]
    }
    let [b, d] = [_.unity, _.gcd(a)]
    while (!d.isUnity) {
      [_, b] = [_.div(d), b.mul(d)],
      d = _.gcd(a)
    }
    return [_, b]
  }
  __inv(a = this._zero) {
    let _ = this
    let x = this._unity
    let z = this._zero
    let n = a.abs
    let [q, r] = _._divmod(a)

    if (a.isZero && _._neg.isUnity) {
      return _._neg
    }

    while (!a.isZero) {
      [q, r] = _._divmod(a)
      [_, a, x, z] = [a, r, z, x._add(q._mul(z)._neg)]
    }
    return x.mod(n)
  }
  get isZero() {
    return this._eql(this._zero)
  }
  get isUnity() {
    return this._eql(this._unity)
  }
  cmp(a) {
    return (
      (([_, a]) => (
        _._cmp(a)
      ))
      (this.coerce(a))
    )
  }
  lt(a) {
    return this.cmp(a) < 0
  }
  gt(a) {
    return this.cmp(a) > 0
  }
  lte(a) {
    return this.cmp(a) <= 0
  }
  gte(a) {
    return this.cmp(a) >= 0
  }
  split(a) {
    return (
      this.isZero ? [] : (
        (([q, r]) => (
          [r, ...(q.split(a))]
        ))
        (this.divmod(a))
      )
    )
  }
}
let toUint8Array = (a) => (
  a < 0 ? (
    new Integer(toUint8Array(- a))._neg._
  ) : (
    ((arr) => (
      new Uint8Array(arr.length.isZero || arr.last < 0x80 ? arr : [...arr, 0])
    ))
    (a.split(0x100))
  )
)

Object.defineProperties(Array.prototype, {
  last: {
    get() {
      return this[this.length - 1]
    }
  },
  _join: {
    value(a) {
      return (
        this.reverse().reduce((_, e) => (
          _ * a + e
        ), 0)
      )
    }
  }
})

Object.defineProperties(Number.prototype, {
  _eql: {
    value(a) {
      return (
        this.finalize === a.finalize
      )
    }
  },
  coerce: {
    value(a) {
      return (
        ((_, a) => (
          typeof a === 'number'
          ? [_, a] : (
            (([a, _]) => (
              [_, a]
            ))
            (a.coerce(this))
          )
        ))
        (this.finalize, a.finalize)
      )
    }
  },
  finalize: {
    get() {
      return this.valueOf()
    }
  },
  _zero: {
    get() {
      return 0
    }
  },
  _unity: {
    get() {
      return 1
    }
  },
  _neg: {
    get() {
      return 0 - this
    }
  },
  _res: {
    get() {
      return new Adele(0, 1, this.finalize)
    }
  },
  _inv: {
    get() {
      return (
        ((_) => (
          Number.isInteger(_)
          ? (
            _ ===  1 ?  1 :
            _ === -1 ? -1 :
            new Adele(1, _)
          )
          : 1 / _
        ))
        (this.finalize)
      )
    }
  },
  _add: {
    value(a) {
      return (
        (([_, a]) => (
          Number.isInteger(_) &&
          Number.isInteger(a)
          ? Integer.cast(_).add(Integer.cast(a))
          : _ + a
        ))
        (this.coerce(a))
      )
    }
  },
  _mul: {
    value(a) {
      return (
        (([_, a]) => (
          Number.isInteger(_) &&
          Number.isInteger(a)
          ? Integer.cast(_).mul(Integer.cast(a))
          : _ + a
        ))
        (this.coerce(a))
      )
    }
  },
  _divmod: {
    value(a) {
      return (
        (([_, a]) => (
          a.isZero ? [0, _] : (
            ((r) => (
              r < 0 && (r += a),
              ((q) => (
                [q, r]
              ))
              ((_ - r) / a)
            ))
            (_ % a)
          )
        ))
        (this.coerce(a))
      )
    }
  },
  _cmp: {
    value(a) {
      return this - a
    }
  },
  __inv: {
    value(a = 0) {
      let _ = this.finalize
      let x = 1
      let z = 0
      let n = a.abs
      let [q, r] = _._divmod(a)

      if (a === 0 && _ === -1) {
        return -1
      }

      while (a !== 0) {
        [q, r] = _._divmod(a)
        [_, a, x, z] = [a, r, z, x - q * z]
      }
      return x.mod(n)
    }
  },
  unit: {
    get() {
      return this < 0 ? -1 : 1
    }
  },
  sign: {
    get() {
      return Math.sign(this)
    }
  },
  abs: {
    get() {
      return Math.abs(this)
    }
  },
  floor: {
    get() {
      return Math.floor(this)
    }
  },
  factor: {
    get() {
      let [_, p, bound] = [this.abs, 7, Math.sqrt(this) + 1]

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
  },
  factorize: {
    get() {
      let _ = this.finalize, fs = {}, p

      while (_ !== 1) {
        p = _.factor
        fs[p] || (fs[p] = 0)
        fs[p] += 1
        _ /= p
      }
      return fs
    }
  },
  exp: {
    get() {
      return Math.exp(this)
    }
  },
  log: {
    get() {
      return (
        this.isZero
        ? undefined
        : this < 0
        ? Arch.cast(this).log
        : Math.log(this)
      )
    }
  },
  cos: {
    get() {
      return Math.cos(this)
    }
  },
  sin: {
    get() {
      return Math.sin(this)
    }
  },
  atan2: {
    value(a) {
      return Math.atan2(this, a)
    }
  },
  hypot: {
    value(...a) {
      return Math.hypot(this, ...a)
    }
  },
  f0: {
    get() {
      let [_, e] = [this.valueOf(), 0]
      while (_ >= 2) {
        [_, e] = [_ / 2, e + 1]
      }
      while (_ < 1) {
        [_, e] = [_ * 2, e - 1]
      }
      return [_, e]
    }
  },
  f1: {
    get() {
      let [_, e] = [this.valueOf(), 0]
      while (!Number.isInteger(_)) {
        [_, e] = [_ * 2, e + 1]
      }
      return [_, e]
    }
  },
  f2: {
    get() {
      let [u, e0] = this.f0
      let [r, e1] = u.f1
      return [r, e0 - e1]
    }
  },
  adele: {
    get() {
      let [r, e] = this.f2
      return r.mul(2 .pow(e))
    }
  }
})
Reflect.setPrototypeOf(Number.prototype, Algebraic.prototype)

class Integer extends Algebraic {
  constructor(_ = new Uint8Array) {
    super()
    this._ = _
  }
  _eql(a) {
    return (
      ((_, a) => (
        _.length === a.length
        && _.every((e, i) => (
          e === a[i]
        ))
      ))
      (this._, a._)
    )
  }
  coerce(a) {
    return (
      this.eq(a)
      ? [this, a]
      : (
        ((a) => (
          typeof a === 'number'
          ? (
            Number.isInteger(a)
            ? [this, new Integer(toUint8Array(a))]
            : [this.number, a]
          )
          : (
            (([a, _]) => (
              [_, a]
            ))
            (a.coerce(_))
          )
        ))
        (a.finalize)
      )
    )
  }
  get finalize() {
    return (
      ((_) => (
        _._.length > 6 ? _ : _.number
      ))
      (this.canonicalize)
    )
  }
  get canonicalize() {
    let a = Array.from(this._)

    while (
      (a.last === 0x00 && a[a.length - 2] < 0x80) ||
      (a.last === 0xff && a[a.length - 2] > 0x7f)
    ) a.pop()

    return (
      a.length === 1 ? (
        a[0] === 0 ? Integer.zero :
        a[0] === 1 ? Integer.unity :
        new Integer(new Uint8Array(a))
      ) : (
        new Integer(new Uint8Array(a))
      )
    )
  }
  get number() {
    return (
      this.isZero ? 0 : (
        ((_) => (
          _.last < 0x80
          ? _._join(0x100)
          : this._neg.number._neg
        ))
        (Array.from(this._))
      )
    )
  }
  get arch() {
    return (
      this.isZero ? 0 : (
        ((_) => (
          _.last < 0x80
          ? _.reverse().reduce((a, b) => (
            a.mul(256).add(b)
          ), Arch.zero)
          : this._neg.arch._neg
        ))
        (Array.from(this._))
      )
    )
  }
  get _zero() {
    return Integer.zero
  }
  get _unity() {
    return Integer.unity
  }
  get _neg() {
    return (
      this.isZero ? this :
      new Integer(
        this._.map((e) => (
          0xff - e
        ))
      )
      ._add(this._unity)
      .canonicalize
    )
  }
  get _res() {
    return (
      new Adele(0, 1, this)
    )
  }
  get _inv() {
    return (
      this.isZero ? undefined :
      this.isUnity ? Integer.unity :
      this._eql(Integer.unity._neg) ? Integer.unity._neg :
      new Adele(1, this)
    )
  }
  _add(a) {
    return (
      this.isZero ? a :
      a.isZero ? this : (
        ((arr) => (
          (new Integer(arr)).canonicalize
        ))
        (
          ((_, a) => (
            (_ = Array.from(_)), // for Array#last
            (a = Array.from(a)), // for Array#last

            _.length < a.length && ([_, a] = [a, _]),
            (_ = [..._, _.last < 0x80 ? 0 : 0xff]),
            (a = [...a, ...Array(_.length - a.length).fill(
              a.last < 0x80 ? 0 : 0xff
            )]),
            Array(_.length).fill().map((_, i) => i)
            .reduce(({ arr, carry }, i) => (
              ((x) => (
                arr[i] = x & 0xff,
                carry = x >>> 8,
                { arr, carry }
              ))
              (carry + _[i] + a[i])
            ), {
              arr: new Uint8Array(_.length),
              carry: 0
            }).arr
          ))
          (this._, a._)
        )
      )
    )
  }
  _mul(a) {
    if (this.isZero || a.isZero) {
      return Integer.zero
    } else
    if (this.isUnity) {
      return a
    } else
    if (a.isUnity) {
      return this
    } else
    {
      let _ = this._; a = a._
      let _len = _.length, alen = a.length, ualen = _len + alen
      let ua = new Uint8Array(_len + alen)
      let i, j

      for (i = 0; i < _len; i ++) {
        for (j = 0; j < alen; j ++) {
          ((x) => {
            ua[i + j] = x & 0xff
            i + j + 1 < ualen && (
              ua[i + j + 1] += x >>> 8
            )
          })
          (ua[i + j] + _[i] * a[j])
        }
      }

      return new Integer(ua)
    }
  }
  _divmod(a) {
    let [q, r] = [Integer.zero, this]
    let c

    if (!a.isZero) {
      while (r._cmp(a) > 0) {
        if (r._.last > a._.last) {
          c = (r._.last / a._.last).floor
        } else
        {
          c = ((r._.last * 0x100 + r._[r._.length - 2]) / a._.last).floor
        }
        if (a.mul(c)._cmp(r) > 0) {
          c -= 1
        }
        [q, r] = [q.add(c), r._add(a.mul(c)._neg)]
        console.log({ q, r })
      }
    }
    return [q, r]
  }
  _cmp(a) {
    return (
      ((d) => (
        d.isZero ? 0 :
        d._.last < 0x80 ? 1 : -1
      ))
      (this._add(a._neg).canonicalize)
    )
  }
  get unit() {
    return (
      this.isZero ? Integer.unity :
      Array.from(this._).last < 0x80 ? Integer.unity :
      Integer.unity._neg
    )
  }
  get abs() {
    return this._mul(this.unit)
  }
}
Integer.zero = new Integer
Integer.unity = new Integer(new Uint8Array([1]))
Integer.cast = (a) => Integer.zero.cast(a)

class Adele extends Algebraic {
  constructor(r = 0, s = 1, n = 0) {
    super()
    n = n.abs;
    (([u, s]) => (
      ((r) => (
        this.r = r,
        this.s = s,
        this.n = n
      ))
      ((r.mul(u.__inv(n))).mod(n.mul(s)))
    ))
    (s.ub(n))
  }
  _eql(a) {
    return (
      this.n._eql(a.n) &&
      this.r._eql(a.r) &&
      this.s._eql(a.s)
    )
  }
  coerce(a) {
    if (a.eq(this)) {
      var _ = this, n, _u, _s, au, as, s, _r, ar

      n = _.n.gcd(a.n)

      if (n.isUnity) {
        return [Adele.nil, Adele.nil]
      }

      [_u, _s] = _.s.ub(n)
      [au, as] = a.s.ub(n)
      s = _s.lcm(as)
      _r = _.r.mul(_u.__inv(n)).mul(s.div(_s))
      ar = a.r.mul(au.__inv(n)).mul(s.div(as))
      return (
        [new Adele(_r, s, n), new Adele(ar, s, n)]
      )
    } else
    if (a.eq(Integer.zero)) {
      return (
        [this, new Adele(a, 1)]
      )
    } else
    if (a.eq(0)) {
      return (
        [this, a.adele]
      )
    } else
    if (a.eq(Arch.zero)) {
      return [this, new Error('not yet')]
    } else
    {// fix later
      return [this, new Error('not yet')]
    }
  }
  get finalize() {
    return (
      this.n.isUnity || this.s.isZero
      ? this
      : (
        ((d) => (
          new Adele(this.r.div(d), this.s.div(d), this.n)
        ))
        (this.r.gcd(this.s))
      )
    )
  }
  get _zero() {
    return new Adele(this.r.zero, this.s, this.n)
  }
  get _unity() {
    return new Adele(
      this.s,
      this.s,
      this.n
    )
  }
  get _neg() {
    return new Adele(this.r.neg, this.s, this.n)
  }
  get _res() {
    return new Adele(
      this.r.zero,
      this.s.unity,
      (([u, n]) => (
        n
      ))
      (this.r.ub(this.n))
    )
  }
  get _inv() {
    return (
      (([u, s]) => (
        ((r) => (
          new Adele(r, s, this.n)
        ))
        (this.s.mul(u.__inv(this.n)))
      ))
      (this.r.ub(this.n))
    )
  }
  _add(a) {
    return new Adele(
      this.r._add(a.r),
      this.s,
      this.n
    )
  }
  _mul(a) {
    return (
      new Adele(
        this.r.mul(a.r),
        this.s.mul(a.s),
        this.n
      )
    )
  }
  _divmod(a) {
    throw new Error('Adele#_divmod not yet')
  }
  _cmp(a) {
    throw new Error('Adele#_cmp not yet')
  }
  get unit() {
    return (
      (([u, b]) => (
        new Adele(u, this.s.unity, this.n)
      ))
      (this.r.ub(this.n))
    )
  }
  get abs() {
    return (
      (([u, b]) => (
        new Adele(b, this.s, this.n.zero)
      ))
    )
  }
}

let PI2 = 2 * Math.PI
class Arch extends Algebraic {
  constructor(ord, arg) {
    super()
    ord === undefined && arg === undefined || (
      ((ord, arg) => (
        (arg %= 1),
        arg < 0 && (arg += 1),
        (this.ord = ord),
        (this.arg = arg)
      ))
      (ord || 0, arg || 0)
    )
  }
  _eql(a) {
    return (
      this.ord === a.ord &&
      this.arg === a.arg
    )
  }
  coerce(a) {
    return (
      this.eq(a) ? [this, a] :
      a === 0 ? [this, Arch.zero] :
      a > 0 ? [this, new Arch(a.log)] :
      [this, new Arch((- a).log, 0.5)]
    )
  }
  get finalize() {
    return this
  }
  get _zero() {
    return Arch.zero
  }
  get _unity() {
    return Arch.unity
  }
  get _neg() {
    return new Arch(this.ord, this.arg + 0.5)
  }
  get _res() {
    throw new Error('Arch#_res not yet')
  }
  get _inv() {
    return new Arch(
      - this.ord,
      - this.arg
    )
  }
  _add(a) {
    return (
      a.isZero ? this :
      this._eql(a._neg) ? this.zero :
      this.ord < a.ord ? a._add(this) :
      this._mul(
        this._inv._mul(a).succ
      )
    )
  }
  _mul(a) {
    return (
      a.isZero
      ? a
      : new Arch(
        this.ord + a.ord,
        this.arg + a.arg
      )
    )
  }
  _divmod(a) {
    throw new Error('Arch#_divmod not yet')
  }
  _cmp(a) {
    let _ = this._mul(this.sign.inv)
    a = a._mul(this.sign.inv)
    return a.arg === 0 || a.arg === 0.5 ? (
      (_.exp.ord)._cmp(a.exp.ord)
    ) : undefined
  }
  get shift() {
    return (
      this.isZero
      ? this
      : new Arch(
        this.ord + 1,
        this.arg
      )
    )
  }
  get succ() {
    return this.exp.shift.log
  }
  get unit() {
    return (
      this.isZero ? Arch.unity :
      this.sign
    )
  }
  get sign() {
    return (
      this.isZero ? this :
      new Arch(0, this.arg)
    )
  }
  get abs() {
    return (
      this.isZero ? this :
      new Arch(this.ord, 0)
    )
  }
  get exp() {
    return (
      this.isZero ? Arch.unity : (
        ((ord, arg) => (
          arg < 0.5 || (arg -= 1),
          (arg *= PI2),
          new Arch(
            ord * arg.cos,
            ord * arg.sin / PI2
          )
        ))
        (this.ord.exp, this.arg)
      )
    )
  }
  get log() {
    return (
      this.isZero ? undefined :
      this.isUnity ? Arch.zero : (
        ((ord, arg) => (
          arg < 0.5 || (arg -= 1),
          (arg *= PI2),
          new Arch(
            ord.hypot(arg).log,
            arg.atan2(ord) / PI2
          )
        ))
        (this.ord, this.arg)
      )
    )
  }
}
Arch.zero = new Arch
Arch.unity = new Arch(0, 0)
Arch.cast = (a) => Arch.zero.cast(a)

typeof module === 'undefined' || (
  module.exports = { Algebraic, toUint8Array, Integer, Adele, PI2, Arch }
)
