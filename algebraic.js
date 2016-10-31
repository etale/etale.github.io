class Algebraic {
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
  _eql(a) { return new Error('_eql is missing') }
  get finalize() { return new Error('finalize is missing') }
  coerce(a) { return new Error('coerce is missing') }
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
  get _zero() { return new Error('_zero is missing') }
  get neg() {
    return this._neg.finalize
  }
  get _neg() { return new Error('_neg is missing') }
  add(a) {
    return (
      (([_, a]) => (
        _._add(a).finalize
      ))
      (this.coerce(a))
    )
  }
  _add(a) { return new Error('_add is missing') }
  get unity() {
    return this._unity.finalize
  }
  get _unity() { return new Error('_unity is missing') }
  get inv() {
    return this._inv.finalize
  }
  get _inv() { return new Error('_inv is missing') }
  mul(a) {
    return (
      (([_, a]) => (
        _._mul(a).finalize
      ))
      (this.coerce(a))
    )
  }
  _mul(a) { return new Error('_mul is missing') }
  get isZero() {
    return this._eql(this._zero)
  }
  get isUnity() {
    return this._eql(this._unity)
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
  gcd(a = 0) {
    let _ = this.abs
    a = a.abs
    while (!a.isZero) {
      [_, a] = [a, _.mod(a)]
    }
    return _
  }
  lcm(a = 1) {
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
    new Integer(toUint8Array(- a)).neg._
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
  finalize: {
    get() {
      return this.valueOf()
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
  _eql: {
    value(a) {
      return (
        this.finalize === a.finalize
      )
    }
  },
  _zero: {
    get() {
      return 0
    }
  },
  _neg: {
    get() {
      return 0 - this
    }
  },
  _add: {
    value(a) {
      return (
        (([_, a]) => (
          ((r) => (
            Number.isInteger(_) &&
            Number.isInteger(a)
            ? (
              ((R) => (
                R._.length < 6 ? r : R
              ))
              (Integer.cast(r))
            )
            : r
          ))
          (_ + a)
        ))
        (this.coerce(a))
      )
    }
  },
  _unity: {
    get() {
      return 1
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
  _mul: {
    value(a) {
      return (
        (([_, a]) => (
          ((r) => (
            Number.isInteger(_) &&
            Number.isInteger(a)
            ? (
              ((R) => (
                R._.length < 6 ? r : R
              ))
              (Integer.cast(r))
            )
            : r
          ))
          (_ * a)
        ))
        (this.coerce(a))
      )
    }
  },

  divmod: {
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
  __inv: {
    value(a = 0) {
      let _ = this.finalize
      let x = 1
      let z = 0
      let n = a.abs
      let [q, r] = _.divmod(a)

      if (a === 0 && _ === -1) {
        return -1
      }

      while (a !== 0) {
        [q, r] = _.divmod(a)
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
  _cmp: {
    value(a) {
      return this - a
    }
  }
})
Reflect.setPrototypeOf(Number.prototype, Algebraic.prototype)

class Integer extends Algebraic {
  constructor(_ = new Uint8Array) {
    super()
    this._ = _
  }
  get finalize() {
    let a = Array.from(this._)

    while (
      (a.last === 0x00 && a[a.length - 2] < 0x80) ||
      (a.last === 0xff && a[a.length - 2] > 0x7f)
    ) {
      a.pop()
    }

    return (
      ((_) => (
        _.isZero ? 0 :
        _._.length < 6 ? _.number : _
      ))
      (new Integer(new Uint8Array(a)))
    )
  }
  get number() {
    return (
      this.gte(0) ? (
        ((_) => (
          Array.from(_)._join(0x100)
        ))
        (this._)
      ) : (
        this._neg.number._neg
      )
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
  get _zero() { return Integer.zero }
  get _neg() {
    return (
      this.isZero ? this :
      new Integer(
        this._.map((e) => (
          0xff - e
        ))
      )
      ._add(this._unity)
    )
  }
  _add(a) {
    return (
      this.isZero ? a :
      a.isZero ? this : (
        ((arr) => (
          new Integer(arr)
        ))
        (
          ((_, a) => (
            _ = Array.from(_), // for Array#last
            a = Array.from(a), // for Array#last

            _.length < a.length && ([_, a] = [a, _]),
            _ = [..._, _.last < 0x80 ? 0 : 0xff],
            a = [...a, ...Array(_.length - a.length).fill(
              a.last < 0x80 ? 0 : 0xff
            )],
            Array(_.length).fill().map((_, i) => i)
            .reduce(({ arr, carry }, i) => (
              (([q, r]) => (
                arr[i] = r,
                carry = q,
                { arr, carry }
              ))
              ((carry + _[i] + a[i]).divmod(0x100))
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
  get _unity() {
    return Integer.unity
  }
  get _inv() {
    return new Adele(this._unity, this, this._zero)
  }
  _mul(a) {
    if (this.isZero || a.isZero) {
      return this._zero
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
      let i, j, q, r

      for (i = 0; i < _len; i ++) {
        for (j = 0; j < alen; j ++) {
          [q, r] = (ua[i + j] + _[i] * a[j]).divmod(0x100)
          ua[i + j] = r
          i + j + 1 < ualen && (ua[i + j + 1] += q)
        }
      }

      return new Integer(ua)
    }
  }
  _cmp(a) {
    return (
      ((d) => (
        d.isZero ? 0 :
        d._.last < 0x80 ? 1 : -1
      ))
      (this._add(a.neg))
    )
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
  coerce(a) {
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
  }
  _eql(a) {
    return (
      this.n._eql(a.n) &&
      this.r._eql(a.r) &&
      this.s._eql(a.s)
    )
  }
  get _zero() {
    return new Adele(this.r.zero, this.s, this.n)
  }
  get _neg() {
    return new Adele(this.r.neg, this.s, this.n)
  }
  get res() {
    return new Adele(
      this.r.zero,
      this.s.unity,
      (([u, n]) => (
        n
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
  get _unity() {
    return new Adele(
      this.s,
      this.s,
      this.n
    )
  }
  get _inv() {
    return (
      this.isZero ? Adele.nil :
      (([u, s]) => (
        ((r) => (
          new Adele(r, s, this.n)
        ))
        (this.s.mul(u.__inv(this.n)))
      ))
      (this.r.ub(this.n))
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
//Adele.nil = new Adele(0, 0, 1)

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
  get finalize() {
    return this
  }
  coerce(a) {
    return (
      this.eq(a) ? [this, a] :
      a === 0 ? [this, Arch.zero] :
      a > 0 ? [this, new Arch(a.log)] :
      [this, new Arch((- a).log, 0.5)]
    )
  }
  _eql(a) {
    return (
      this.ord === a.ord &&
      this.arg === a.arg
    )
  }
  get _zero() {
    return Arch.zero
  }
  get _neg() {
    return new Arch(this.ord, this.arg + 0.5)
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
  get _unity() {
    return Arch.unity
  }
  get _inv() {
    return new Arch(
      - this.ord,
      - this.arg
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
