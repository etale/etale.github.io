class Algebraic {
  eq(a) { return Reflect.getPrototypeOf(this) === Reflect.getPrototypeOf(Object(a)) }
  eql(a) { return this.eq(a) && this._eql(a) }
  get finalize() { return this }
  coerce(a) { return [this, a] }
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
}

Object.defineProperties(Number.prototype, {
  coerce: { value(a) {
    return (
      this.eq(a)
      ? [this, a]
      : a.coerce(this)
    )
  } },
  _eql: { value(a) { return this.valueOf() === a.valueOf() } },
  _zero: { get() { return 0 } },
  _neg: { get() { return 0 - this } },
  _add: { value() { return this + a } },
  _unity: { get() { return 1 } },
  _inv: { get() { return 1 / this } },
  _mul: { value(a) { return this * a } },

  exp: { get() { return Math.exp(this) } },
  log: { get() {
    return (
      this.valueOf() === 0
      ? undefined
      : this < 0
      ? Arch.zero.coerce(this)[1].log
      : Math.log(this)
    )
  } },
  cos: { get() { return Math.cos(this) } },
  sin: { get() { return Math.sin(this) } },
  atan2: { value(a) { return Math.atan2(this, a) } }
})
Reflect.setPrototypeOf(Number.prototype, Algebraic.prototype)

class Arch extends Algebraic {
  constructor(ord, arg) {
    super()
    ord === undefined && arg === undefined || (
      ((ord, arg) => (
        (arg %= 1),
        arg < 0 && (arg += 1),
        Reflect.set(this, 'ord', ord),
        Reflect.set(this, 'arg', arg)
      ))
      (ord || 0, arg || 0)
    )
  }
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
    return this.ord === a.ord && this.arg === a.arg
  }
  get _zero() { return Arch.zero }
  get _neg() { return new Arch(this.ord, this.arg + 0.5) }
  _add(a) {
    return (
      a.isZero
      ? this
      : this.eql(a.neg)
      ? this.zero
      : this.ord < a.ord
      ? a._add(this)
      : this.mul(this.inv.mul(a).succ)
    )
  }
  get _unity() { return Arch.unity }
  get _inv() { return new Arch(-this.ord, -this.arg) }
  _mul(a) { return new Arch(this.ord + a.ord, this.arg + a.arg) }
  get shift() { return new Arch(this.ord + 1, this.arg) }
  get succ() { return this.exp.shift.log }
  get exp() {
    return (
      this === Arch.zero
    ? Arch.unity
    : (
      ((ord, arg) => (
        arg < 0.5 && (arg -= 1),
        (arg *= Math.PI * 2),
        new Arch(
          ord * arg.cos,
          ord * arg.sin / (Math.PI * 2)
        )
      ))
      (this.ord.exp, this.arg)
    ))
  }
  get log() {
    return (
      this === Arch.zero
      ? undefined
      : this === Arch.unity
      ? Arch.zero
      : (
        ((ord, arg) => (
          arg < 0.5 || (arg -= 1),
          (arg *= Math.PI * 2),
          new Arch(
            (ord * ord + arg * arg).log * 0.5,
            arg.atan2(ord) / (Math.PI * 2)
          )
        ))
        (this.ord, this.arg)
      )
    )
  }
}
Arch.zero = new Arch
Arch.unity = new Arch(0, 0)
