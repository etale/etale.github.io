class Algebraic {
  get r() { console.log('r is missing') }
  get s() { console.log('s is missing') }
  get n() { console.log('n is missing') }
  get ord() { console.log('ord is missing') }
  get arg() { console.log('arg is missing') }
  _eql(a) { console.log('_eql is missing') }
  coerce(a) { console.log('coerce is missing') }
  get final() { console.log('final is missing') }
  get _zero() { console.log('_zero is missing') }
  get _unity() { console.log('_unity is missing') }
  get _neg() { console.log('_neg is missing') }
  get _res() { console.log('_res is missing') }
  get _inv() { console.log('_inv is missing') }
  get unit() { console.log('unit is missing') }
  get sign() { console.log('sign is missing') }
  get abs() { console.log('abs is missing') }
  _add(a) { console.log('_add is missing') }
  _mul(a) { console.log('_mul is missing') }
  _divmod(a) { console.log('_divmod is missing') }
  _cmp(a) { console.log('_cmp is missing') }

  eq(a) {
    return (
      Reflect.getPrototypeOf(Object(this)) ===
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
    return this._zero.final
  }
  get unity() {
    return this._unity.final
  }
  get neg() {
    return this._neg.final
  }
  get res() {
    return this._res.final
  }
  get inv() {
    return this._inv.final
  }
  add(a) {
    return (
      (([_, a]) => (
        _._add(a).final
      ))
      (this.coerce(a))
    )
  }
  mul(a) {
    return (
      (([_, a]) => (
        _._mul(a).final
      ))
      (this.coerce(a))
    )
  }
  divmod(a) {
    return (
      (([_, a]) => (
        (([_, a]) => (
          [_.final, a.final]
        ))
        (_._divmod(a))
      ))
      (this.coerce(a))
    )
  }
  pow(a) {
    return (
      a < 0
      ? this._inv.pow(- a)
      : (
        ((_, r) => (
          (() => {
            while (a) {
              a & 1 === 1 && (r = r.mul(_)),
              _ = _._mul(_),
              a = a >>> 1
            }
          })(),
          r.final
        ))
        (this, this._unity)
      )
    )
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
    return (
      ((_, a) => (
        (() => {
          while (! a.isZero) {
            [_, a] = [a, _.mod(a)]
          }
        }),
        _
      ))
      (this.abs, a.abs)
    )
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
    return (
      ((_) => (
        _.isZero || a.isZero
        ? [_.unit, _.abs]
        : (
          ((b, d) => (
            (() => {
              while (!d.isUnity) {
                _ = _.div(d)
                b = b.mul(d)
                d = _.gcd(a)
              }
            })(),
            [_, b]
          ))
          (_.unity, _.gcd(a))
        )
      ))
      (this)
    )
  }
  invmod(a) {
    let _ = this
    let x = this._unity
    let z = this._zero
    let n = a.abs
    let [q, r] = _._divmod(a)

    if (a.isZero && _.isUnit) {
      return _._inv
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
  get isUnit() {
    return this._eql(this.unit)
  }
  get isSign() {
    return this._eql(this.sign)
  }
  get isAbs() {
    return this._eql(this.abs)
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
    return (
      ((_) => (
        _ === undefined ? _ : _ < 0
      ))
      (this.cmp(a))
    )
  }
  gt(a) {
    return (
      ((_) => (
        _ === undefined ? _ : _ > 0
      ))
      (this.cmp(a))
    )
  }
  lte(a) {
    return (
      ((_) => (
        _ === undefined ? _ : _ <= 0
      ))
      (this.cmp(a))
    )
  }
  gte(a) {
    return (
      ((_) => (
        _ === undefined ? _ : _ >= 0
      ))
      (this.cmp(a))
    )
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
      ((arg) => (
        new Uint8Array(arg)
      ))
      (
        arr.length.isZero || arr.last < 0x80
        ? arr
        : [...arr, 0]
      )
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
  r: {
    get() {
      return this.final
    }
  },
  s: {
    get() {
      return 1
    }
  },
  n: {
    get() {
      return 0
    }
  },
  ord: {
    get() {
      return (
        this.isZero ? undefined : this.abs.log
      )
    }
  },
  arg: {
    get() {
      return (
        this.isZero ? undefined : (
          this >= 0 ? 0 : 0.5
        )
      )
    }
  },
  _eql: {
    value(a) {
      return (
        this.final === a.final
      )
    }
  },
  coerce: {
    value(a) {
      return (
        a.eq(this)
        ? [this, a]
        : (
          (([a, _]) => (
            [_, a]
          ))
          (a.coerce(this))
        )
      )
    }
  },
  final: {
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
      return new Adele(0, 1, this.abs)
    }
  },
  isInteger: {
    get() {
      return Number.isInteger(this.final)
    }
  },
  _inv: {
    get() {
      return (
        ((_) => (
          _.isZero ? undefined :
          _.isInteger ? (
            _ ===  1 ?  1 :
            _ === -1 ? -1 :
            new Adele(1, _)
          ) : (1 / _)
        ))
        (this.final)
      )
    }
  },
  _add: {
    value(a) {
      return (
        (([_, a]) => (
          _.isInteger && a.isInteger
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
        this.isInteger && a.isInteger
        ? Integer.cast(this).mul(Integer.cast(a))
        : this * a
      )
    }
  },
  _divmod: {
    value(a) {
      return (
        a.isZero ? [0, this] : (
          ((r) => (
            r < 0 && (r += a),
            ((q) => (
              [q, r]
            ))
            ((this - r) / a)
          ))
          (this % a)
        )
      )
    }
  },
  _cmp: {
    value(a) {
      return this - a
    }
  },
  invmod: {
    value(a) {
      return (
        a.isZero && this.isUnit
        ? this.inv : (
          ((_, x, z, n, q, r) => (
            (() => {
              while (! a.isZero) {
                [q, r] = _._divmod(a)
                [_, a, x, z] = [a, r, z, x - q * z]
              }
            })(),
            x.mod(n)
          ))
          (this, 1, 0, a.abs, ...this._divmod(a))
        )
      )
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
  sqrt: {
    get() {
      this < 0
      ? Arch.cast(this).sqrt
      : Math.sqrt(this)
    }
  },
  factor: {
    get() {
      let [_, p, bound] = [this.abs, 7, this.sqrt + 1]

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
      return (
        ((_, fs, p) => {
          while (!_.isUnity) {
            p = _.factor
            fs[p] || (fs[p] = 0)
            fs[p] =+ 1
            _ /= p
          }
          return fs
        })
        (this, {}, this.factor)
      )
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
        this.isZero ? undefined :
        this < 0 ? Arch.cast(this).log : Math.log(this)
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
      let [_, e] = [this, 0]
      while (_ >= 2) {
        [_, e] = [_ / 2, e + 1]
      }
      while (_ < 1) {
        [_, e] = [_ * 2, e - 1]
      }
      return [_.final, e]
    }
  },
  f1: {
    get() {
      let [_, e] = [this, 0]
      while (!_.isInteger) {
        [_, e] = [_ * 2, e + 1]
      }
      return [_.final, e]
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
  get r() {
    return this
  }
  get s() {
    return this._unity
  }
  get n() {
    return this._zero
  }
  get ord() {
    return (
      this.isZero ? undefined :
      this._cmp(Integer.zero) > 0 ? (
        Array.from(this._).reverse().reduce((a, b) => (
          a * 0x100 + b
        )).ord
      ) : (
        this._neg.ord
      )
    )
  }
  get arg() {
    return (
      this.isZero ? undefined :
      this._cmp(Integer.zero) > 0 ? 0 : 0.5
    )
  }
  constructor(_ = new Uint8Array) {
    super()
    this._ = _
  }
  _eql(a) {
    return (
      ((_, a) => (
        _.length === a.length &&
        _.every((e, i) => (
          e === a[i]
        ))
      ))
      (this._, a._)
    )
  }
  coerce(a) {
    return (
      a.eq(this)
      ? [this, a]
      : a.eq(0)
      ? (
        ((a) => (
          typeof a === 'number'
          ? (
            a.isInteger
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
        (a.final)
      )
      : a.eq(Adele.zero)
      ? (
        [new Adele(this.r, this.s, this.n), a]
      )
      : a.eq(Arch.zero)
      ? (
        [new Arch(this.ord, this.arg), a]
      )
      : (
        (([a, _]) => (
          [_, a]
        ))
        (a.coerce(this))
      )
    )
  }
  get final() {
    return (
      ((_) => (
        _._.length > 6 ? _ : _.number
      ))
      (this.canonical)
    )
  }
  get canonical() {
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
      ._add(Integer.unity)
      .canonical
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
      this._eql(Integer.negUnity) ? Integer.negUnity : (
        new Adele(1, this, 0)
      )
    )
  }
  _add(a) {
    return (
      this.isZero ? a :
      a.isZero ? this : (
        ((arr) => (
          (new Integer(arr)).canonical
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
                (arr[i] = x & 0xff),
                (carry = x >>> 8),
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
      (this._add(a._neg).canonical)
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
Integer.negUnity = Integer.unity._neg
Integer.cast = (a) => Integer.zero.cast(a)

class Adele extends Algebraic {
  constructor(r = 0, s = 1, n = 0) {
    super()
    n = n.abs;
    (([u, s]) => (
      ((r) => (
        Reflect.defineProperty(this, 'r', { value: r }),
        Reflect.defineProperty(this, 's', { value: s }),
        Reflect.defineProperty(this, 'n', { value: n })
      ))
      ((r.mul(u.invmod(n))).mod(n.mul(s)))
    ))
    (s.ub(n))
  }
  get ord() {
    return (
      this.isZero ? undefined :
      this.r.ord - this.s.ord
    )
  }
  get arg() {
    return (
      this.isZero ? undefined :
      this.r.arg - this.s.arg
    )
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
      _r = _.r.mul(_u.invmod(n)).mul(s.div(_s))
      ar = a.r.mul(au.invmod(n)).mul(s.div(as))
      return (
        [new Adele(_r, s, n), new Adele(ar, s, n)]
      )
    } else
    if (a.eq(Integer.zero)) {
      return (
        [this, new Adele(a.r, a.s, a.n)]
      )
    } else
    if (a.eq(0)) {
      return (
        [this, a.adele]
      )
    } else
    if (a.eq(Arch.zero)) {
      return [this, new Adele(a.r, a.s, a.n)] // Arch#r, s, n
    } else
    {
      return (
        (([a, _]) => (
          [_, a]
        ))
        (a.coerce(this))
      )
    }
  }
  get final() {
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
        (this.s.mul(u.invmod(this.n)))
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
    console.log('Adele#_divmod not yet')
  }
  _cmp(a) {
    console.log('Adele#_cmp not yet')
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
// Adele.zero = new Adele

let PI2 = 2 * Math.PI
class Arch extends Algebraic {
  constructor(ord, arg) {
    super()
    ord === undefined && arg === undefined || (
      ((ord, arg) => (
        (arg %= 1),
        arg < 0 && (arg += 1),
        Reflect.defineProperty(this, 'ord', { value: ord, enumerative: true }),
        Reflect.defineProperty(this, 'arg', { value: arg, enumerative: true })
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
      a.eq(this) ? [this, a] :
      a.eq(0) ? [this, new Arch(a.ord, a.arg)] :
      a.eq(Integer.zero) ? [this, new Arch(a.ord, a.arg)] :
      a.eq(Adele.zero) ? [this, new Arch(a.ord, a.arg)] : ( // Adele#ord, arg, Adele.zero
        (([a, _]) => (
          [_, a]
        ))
        (a.coerce(this))
      )
    )
  }
  get final() {
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
    console.log('Arch#_res not yet')
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
    console.log('Arch#_divmod not yet')
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
  get sqrt() {
    return (
      this.isZero ? Arch.zero : (
        this.log.mul(0.5).exp
      )
    )
  }
  inspect() {
    let aux = (a) => (
      a.toFixed(Arch.precision).split('.')
    )
    return (
      this.isZero
      ? '0 (complex)'
      : (
        ((a, b, _, c) => (
          b || (b = '0'),
          c || (c = '0'),
          [a, b, c].join('.') + 'X'
        ))
        (...aux(this.ord), ...aux(this.arg))
      )
    )
  }
}
Arch.zero = new Arch
Arch.unity = new Arch(0, 0)
Arch.cast = (a) => Arch.zero.cast(a)
Arch.precision = 20

typeof module === 'undefined' || (
  module.exports = { Algebraic, toUint8Array, Integer, Adele, PI2, Arch }
)
