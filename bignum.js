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
  eql(a) {
    return (
      this.length === a.length &&
      this.every((e, i) => (
        e === a[i]
      ))
    )
  }
  cmp(a) {
    return (
      ((_) => (
        _.isZero ? 0 :
        ((_) => (
          _ < 0x80 ? _ : _ - 0x100
        ))
        (_[_.length - 1])
      ))
      (this.add(a.neg))
    )
  }
  lt(a) { return this.cmp(a) < 0 }
  gt(a) { return this.cmp(a) > 0 }
  lte(a) { return this.cmp(a) <= 0 }
  gte(a) { return this.cmp(a) >= 0 }
  get zero() { return Integer.zero }
  get isZero() { return this.length === 0 }
  get unity() { return Integer.unity }
  get isUnity() { return this.length === 1 && this[0] === 1 }
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
        ((_, a) => (
          _.reduce((x, e, i) => (
            ((x) => (
              (_[i] = x & 0xff), x >>> 8
            ))
            (x + e + a[i])
          ), 0),
          _.final
        ))
        (
          new Integer([
            ..._, _.next
          ]),
          new Integer([
            ...a, ...Array(
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
          a.reduce((x, ae, ai) => (
            ((x) => (
              (_[_i + ai] = x & 0xff), x >>> 8
            ))
            (x + _e * ae)
          ), 0)
        )),
        _.final
      ))
      (new Integer(this.length + a.length))
    )
  }
  divmod(a) {
    return (
      this.isZero || a.isZero
      ? [Integer.zero, this]
      : this.negative
      ? (([q, r]) => (
        // -x = q a + r
        [q.neg, r.neg]
      ))
      (this.neg.divmod(a))
      : a.negative
      ? (([q, r]) => (
        // x = (-q) (-a) + r
        [q.neg, r]
      ))
      (this.divmod(a.neg))
      : (
        (([q, r]) => (
          [q.final, r.final]
        ))
        (this.g(a, Integer.zero))
      )
    )
  }
  g(a, q) {
    return (
      this.lt(a) ? [q, this] : (
        (([x, r]) => (
          new Integer([
            ...this.slice(0, this.length - a.length -1),
            ...r
          ]).g(a, new Integer([x, ...q]))
        ))
        (this.slice(this.length - a.length - 1, this.length).f(a))
      )
    )
  }
  f(a) {
    return (
      ((q) => (
        ((r) => (
          (() => {
            while (r.next === 0xff) {
              [q, r] = [q - 1, r.add(a)]
            }
          })(),
          (r = r.slice(0, a.length)),
          [q, new Integer([
            ...r,
            ...Array(a.length - r.length).fill(0)
          ])]
        ))
        (this.add(a.mul(new Integer([q, 0])).neg))
      ))
      (
        ((_) => (
          ((a) => (
            Math.min(Math.floor(_ / a), 0xff)
          ))
          (a[a.length - 1])
        ))
        (
          ((_1, _0) => (
            _0 << 8 + _1
          ))
          (...this.slice(this.length - 2, this.length))
        )
      )
    )
  }
}
Integer.zero = new Integer
Integer.unity = new Integer([1])
Integer.unityNeg = Integer.unity.neg

module.exports = Integer
