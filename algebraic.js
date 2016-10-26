class Algebraic {
  get finalize() { return this }
  coerce(a) { return [this, a] }
  get zero() { return this._zero.finalize }
  get neg() { return this._neg.finalize }
  add(a) {
    return (([x, y]) => (
      x._add(y).finalize
    ))
    (this.coerce(a))
  }
  get unity() { return this._unity.finalize }
  get inv() { return this._inv.finalize }
  mul(a) {
    return (
      (([x, y]) => (
        x._mul(y).finalize
      ))
      (this.coerce(a))
    )
  }
}

Object.defineProperties(Number.prototype, {
  _zero: { get() { return 0 } },
  _neg: { get() { return 0 - this } },
  _add: { value() { return this + a } },
  _unity: { get() { return 1 } },
  _inv: { get() { return 1 / this } },
  _mul: { value() { return this * a } }
})
Reflect.setPrototypeOf(Number.prototype, Algebraic.prototype)

class Arch extends Algebraic {
  constructor(ord, arg) {
    this.ord = ord;
    this.arg = arg;
  }
  get _zero() { return Arch.zero }
  get _neg() { return new Arch(this.ord, this.arg + 0.5) }
  _add(a) { return new Arch() }
  get _unity() { return Arch.unity }
  get _inv() { return new Arch(-this.ord, -this.arg) }
  _mul(a) { return new Arch(this.ord + a.ord, this.arg + a.arg) }
}
Arch.zero = new Arch
Arch.unity = new Arch(0, 0)
