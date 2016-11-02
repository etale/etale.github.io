class Integer extends Uint8Array {
  constructor(a) {
    super(a)
  }
  get next() {
    return this[this.length - 1] < 0x80 ? 0 : 0xff
  }
  get final() {
    return (
      ((_) => (
        _.length === 1
        ? (
          _[0] === 0 ? Integer.zero :
          _[0] === 1 ? Integer.unity :
          _
        )
        : _
      ))
      (
        ((i) => (
          (() => {
            while (
              this[i - 1] === 0    && this[i - 2] < 0x80 ||
              this[i - 1] === 0xff && this[i - 2] > 0x7f
            ) i --
          })(),
          this.slice(0, i)
        ))
        (this.length)
      )
    )
  }
  get zero() { return Integer.zero }
  get unity() { return Integer.unity }
  get neg() {
    return (
      this.map((a) => (
        0xff - a
      )).add(Integer.unity)
    )
  }
  add(a) {
    return (
      ((_, a) => (
        _.length < a.length && (
          [a, _] = [_, a]
        ),
        ((_, a) => (console.log({ _, a }),
          _.reduce((carry, e, i) => (console.log({ _, a }),
            ((x) => (
              (_[i] = x & 0xff), x >>> 8
            ))
            (carry + e + a[i])
          ), 0),
          _.final
        ))
        (
          new Integer([
            ..._, _.next
          ]),
          new Integer([
            ...a, Array(
              _.length - a.length + 1
            ).fill(a.next)
          ])
        )
      ))
      (this, a)
    )
  }
  mul(a) {
    return (
      ((_) => (
        this.forEach((_e, _i) => (
          a.forEach((ae, ai) => (
            ((x) => {
              _[_i + ai] = x & 0xff;
              _[_i + ai + 1] = x >>> 8
            })
            (_[_i + ai] + _e * ae)
          ))
        )),
        _.final
      ))
      (new Integer(this.length + a.length))
    )
  }
  divmod(a) {
    return
  }
}
Integer.zero = new Integer
Integer.unity = new Integer([1])
Integer.unityNeg = Integer.unity.neg

module.exports = Integer
