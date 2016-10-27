class Algebraic {
  eq(a) {
    return (
      Reflect.getPrototypeOf(this) === Reflect.getPrototypeOf(Object(a))
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
    return (([_, a]) => (
      _._add(a).finalize
    ))
    (this.coerce(a))
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
}

let toUint8Array = (a) => (
  a < 0 ? (
    ((arr) => (
      arr[arr.length - 1] >= 0x80 ? (
        arr
      ) : (
        new Uint8Array([...arr, 255])
      )
    ))
    (
      ((arr) => (
        arr.map((e) => (
          0xff - e
        )).reduce(({ ua, carry }, e) => (
          (([carry, e]) => (
            {
              ua: new Uint8Array([...ua, e]),
              carry
            }
          ))
          ((carry + e).divmod(0x100))
        ), { ua: new Uint8Array, carry: 1})
        .ua
      ))
      (aux(-a))
    )
  ) : (
    ((arr) => (
      arr[arr.length - 1] < 0x80 ? (
        arr
      ) : (
        new Uint8Array([...arr, 0])
      )
    ))
    (aux(a))
  )
)
let aux = (a) => (
  a.isZero ? new Uint8Array :
  (([q, r]) => (
    new Uint8Array([r, ...aux(q)])
  ))
  (a.divmod(0x100))
)
let fromUint8Array = (a) => (
  a.reduce((_, e, i) => (
    _ + e * Math.pow(0x100, i)
  ), 0)
)
Object.defineProperties(Number.prototype, {
  finalize: { get() {
    return this.valueOf()
  } },
  coerce: { value(a) {
    return (
      this.eq(a)
      ? [this, a]
      : (
        (([a, _]) => (
          [_, a]
        ))
        (a.coerce(this))
      )
    )
  } },
  _eql: { value(a) {
    return this.valueOf() === a.valueOf()
  } },
  _zero: { get() { return 0 } },
  _neg: { get() { return 0 - this } },
  _add: {
    value(a) {
      return (
        Number.isInteger(this) && Number.isInteger(a)
        ? (new Integer(toUint8Array(this)))._add(
          new Integer(toUint8Array(a))
        )
        : this + a
      )
    }
  },
  _unity: { get() { return 1 } },
  _inv: {
    get() {
      return (
        Number.isInteger(this)
        ? new Adele(1, this.valueOf())
        : 1 / this
      )
    }
  },
  _mul: {
    value(a) {
      return (
        Number.isInteger(this.valueOf()) && Number.isInteger(a)
        ? (new Integer(toUint8Array(this)))._mul(
          new Integer(toUint8Array(a))
        )
        : this * a
      )
    }
  },

  divmod: {
    value(a) {
      return (
        a.isZero
        ? [0, this.valueOf()]
        : (
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
  div: {
    value(a) {
      return (
        (([q, r]) => (
          q
        ))
        (this.divmod(a))
      )
    }
  },
  mod: {
    value(a) {
      return (
        (([q, r]) => (
          r
        ))
        (this.divmod(a))
      )
    }
  },

  exp: { get() { return Math.exp(this) } },
  log: { get() {
    return (
      this.isZero
      ? undefined
      : this < 0
      ? Arch.zero.cast(this).log
      : Math.log(this)
    )
  } },
  cos: { get() { return Math.cos(this) } },
  sin: { get() { return Math.sin(this) } },
  atan2: { value(a) { return Math.atan2(this, a) } },
  hypot: { value(...a) { return Math.hypot(this, ...a) } }
})
Reflect.setPrototypeOf(Number.prototype, Algebraic.prototype)

class Integer extends Algebraic {
  constructor(ua = new Uint8Array) {
    super()
    this.ua = ua
  }
  get finalize() {
    return (
      ((ua) => (
        ua.length.isZero
        ? 0
        : ua.length < 6
        ? fromUint8Array(ua)
        : this
      ))
      (this.ua)
    )
  }
  coerce(a) {
    return (
      this.eq(a)
      ? [this, a]
      : Number.isInteger(a)
      ? [this, new Integer(toUint8Array(a))]
      : [toFloat(this), a]
    )
  }
  _eql(a) {
    return (
      this.ua.length === a.ua.length
      && this.ua.every((e, i) => (
        e === a[i]
      ))
    )
  }
  get _zero() { return Integer.zero }
  get _neg() {
    return (
      this.complement._add(this._unity)
    )
  }
  get complement() {
    return (
      new Integer(
        this.ua.map((a) => (
          0xff - a
        ))
      )
    )
  }
  _add(a) {
    return (
      this.isZero ? a :
      a.isZero ? this : (
        ((_, a) => (
          _.length < a.length
          ? a._add(this)
          : (
            (({ ua, carry }) => (
              new Integer([...ua, carry])
            ))
            (
              _.reduce(({ ua, carry }, e, i) => (
                (([q, r]) => (
                  {
                    ua: [...ua, r],
                    carry: q
                  }
                ))
                (carry + e + (a[i] || 0)).divmod(0x100)
              ), { ua: new Uint8Array, carry: 0 })
            )
          )
        ))
        (this.ua, a.ua)
      )
    )
  }
  get _unity() { return Integer.unity }
  get _inv() {
    return new Adele(this._unity, this, this._zero)
  }
  _mul(a) {
    return (
      this.isZero || a.isZero
      ? this._zero
      : (
        ((_, a) => (
          ((x) => (
            _.map((_e, _i) => (
              a.map((ae, ai) => (
                (([q, r]) => (
                  (x[_i + ai    ] = (x[_i + ai    ] || 0) + r),
                  (x[_i + ai + 1] = (x[_i + ai + 1] || 0) + q),
                  (([q, r]) => (
                    (x[_i + ai    ] = r),
                    (x[_i + ai + 1] += q)
                  ))
                  (x[_i + ai    ].divmod(0x100)),
                  (([q, r]) => (
                    (x[_i + ai + 1] += r),
                    (x[_i + ai + 2] = (x[_i + ai + 2] || 0) + q)
                  ))
                  (x[_i + ai + 1].divmod(0x100))
                ))
                ((_e * ae).divmod(0x100))
              ))
            )),
            new Integer(new Uint8Array(x))
          ))
          ([])
          )
        )
        (this.ua, a.ua)
      )
    )
  }
}
Integer.zero = new Integer
Integer.unity = new Integer(new Uint8Array([1]))

class Adele extends Algebraic {
  constructor(r = 0, s = 1, n = 0) {
    super()
    n = n.body
    (([u, s]) => (
      ((r) => (
        this.r = r,
        this.s = s,
        this.n = n
      ))
      ((r * u.__inv(n)).mod(n * s))
    ))
    (s.ub(n))
  }
  get finalize() {}
  coerce(a) {}
  _eql(a) {}
  get _zero() {}
  get _neg() {}
  _add(a) {}
  get _unity() {}
  get _inv() {}
  _mul(a) {}
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
  get finalize() { return this }
  coerce(a) {
    return (
      this.eq(a)
      ? [this, a]
      : a === 0
      ? [this, Arch.zero]
      : (
        a > 0
        ? [this, new Arch(a.log, 0)]
        : [this, new Arch((-a).log, 0.5)]
      )
    )
  }
  _eql(a) {
    return (
      this.ord === a.ord && this.arg === a.arg
    )
  }
  get _zero() { return Arch.zero }
  get _neg() {
    return new Arch(this.ord, this.arg + 0.5)
  }
  _add(a) {
    return (
      a.isZero
      ? this
      : this._eql(a._neg)
      ? this.zero
      : this.ord < a.ord
      ? a._add(this)
      : this._mul(this._inv._mul(a).succ)
    )
  }
  get _unity() { return Arch.unity }
  get _inv() {
    return new Arch(-this.ord, -this.arg)
  }
  _mul(a) {
    return (
      a.isZero
      ? a
      : new Arch(this.ord + a.ord, this.arg + a.arg)
    )
  }
  get shift() {
    return (
      this.isZero
      ? this
      : new Arch(this.ord + 1, this.arg)
    )
  }
  get succ() {
    return this.exp.shift.log
  }
  get exp() {
    return (
      this.isZero
      ? Arch.unity
      : (
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
      this.isZero
      ? undefined
      : this.isUnity
      ? Arch.zero
      : (
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
