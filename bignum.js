class Integer extends Uint8Array {
  constructor(a) {
    super(a)
  }
  get last() {
    return this[this.length - 1]
  }
  get next() {
    return this.last < 0x80 ? 0 : 0xff
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
        (_.last)
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
              (_[i] = x & 0xff), x >> 8
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
              (_[_i + ai] = x & 0xff), x >> 8
            ))
            (x + _e * ae)
          ), 0)
        )),
        _.final
      ))
      (new Integer(this.length + a.length))
    )
  }
  shiftLeft(a) {
    return (
      ((_) => (
        (
          _[this.length] = this.reduce((x, e, i) => (
            ((x) => (
              (_[i] = x & 0xff), x >> 8
            ))
            ((e << a) + x)
          ), 0)
        ),
        _
      ))
      (new Integer(this.length + 1)) // is 0 OK?
    )
  }
  shiftRight(a) {
    return (
      ((_) => (
        this.reduceRight((x, e, i) => (
          ((x) => (
            (_[i] = x >> a), x & ((1 << a) - 1)
          ))
          (e + (x << 8))
        ), 0), // is 0 OK?
        _
      ))
      (new Integer(this.length))
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
        // 正規化　<< shiftLeft
        // 非正規化 >> shiftRight
        ((_, d) => (
          (() => {
            while (!((_ << d) & 0x80)) d++
          })(),
          ((_, a) => (
            _.length === a.length && (
              _ = new Integer([..._, 0])
            ),
            (([q, r]) => (
              [q.shiftRight(d), a.shiftRight(d)] // final ?
            ))
            (_.g(a, Integer.zero))
          ))
          (this.shiftLeft(d), a.shiftLeft(d))
        ))
        (a.last, 0)
      )
    )
  }
  g(a, q) {
    console.log({ function: 'g', _: this, a, q })
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
    console.log({ function: 'f', _: this, a })
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
          (a[a.length - 2]) // 1 -> 2 にした
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
