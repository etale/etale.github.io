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
  get finalize() { return new Error('finalize is missing') }
  coerce(a) { return new Error('coerce is missing') }
  cast(a) { return this.coerce(a)[1] }
  get zero() { return this._zero.finalize }
  get neg() { return this._neg.finalize }
  add(a) {
    return (([_, a]) => (
      _._add(a).finalize
    ))
    (this.coerce(a))
  }
  get unity() { return this._unity.finalize }
  get inv() { return this._inv.finalize }
  mul(a) {
    return (
      (([_, a]) => (
        _._mul(a).finalize
      ))
      (this.coerce(a))
    )
  }
  get isZero() {
    return this._eql(this._zero)
  }
  get isUnity() {
    return this._eql(this._unity)
  }
}

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
  _add: { value() { return this + a } },
  _unity: { get() { return 1 } },
  _inv: { get() { return 1 / this } },
  _mul: { value(a) { return this * a } },

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
