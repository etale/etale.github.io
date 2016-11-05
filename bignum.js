class Integer extends Uint8Array {
  constructor(a) {
    super(a)
  }
  get last() {
    return (
      this.isZero ? 0 :
      this[this.length - 1]
    )
  }
  set last(a) {
    return this[this.length - 1] = a
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
  get isNegative() { return this.lt(Integer.zero) }
  get neg() {
    return (
      this.isZero ? this :
      this.map((a) => (
        0xff - a
      )).add(Integer.unity)
    )
  }
  add(a) {
    return (
      ((_) => (
        ((x) => (
          new Integer([..._, x + this.next + a.next]).final
        ))
        (
          _.reduce((x, e, i) => (
            ((e) => (
              (_[i] = e & 0xff), e >> 8
            ))
            (x + (this[i] || this.next) + (a[i] || a.next))
          ), 0)
        )
      ))
      (new Integer(Math.max(this.length, a.length)))
    )
  }
  sub(a) {
    return this.add(a.neg)
  }
  mul(a) {
    return (
      ((_) => (
        this.forEach((_e, _i) => (
          _[_i + a.length] = a.reduce((x, ae, ai) => (
            ((e, i) => (
              (_[i] += e & 0xff), e >> 8
            ))
            (_e * ae, _i + ai)
          ), 0)
        )),
        _.final
      ))
      (new Integer(this.length + a.length))
    )
  }
  shiftLeft(a) {
    // assume a = 0, ..., 7
    return (
      ((_) => (
        _.reduce((x, e, i) => (
          ((x) => (
            (_[i] = x & 0xff), x >> 8
          ))
          (((this[i] || 0) << a) + x)
        ), 0),
        _
      ))
      (new Integer(this.length + 1))
    )
  }
  shiftRight(a) {
    // assume a = 0, ..., 7
    return (
      ((_) => (
        this.reduceRight((x, e, i) => (
          ((x) => (
            (_[i] = x >> a), x & ((1 << a) - 1)
          ))
          (e + (x << 8))
        ), 0),
        _
      ))
      (new Integer(this.length))
    )
  }
  pow(a) {
    // assume a = 0, ..., 2 ** 31 - 1
    return (
      ((_, r) => (
        (() => {
          while (a) {
            a & 1 === 1 && (r = r.mul(_)),
            _ = _.mul(_),
            a = a >> 1
          }
        })(),
        r.final
      ))
      (this, Integer.unity)
    )
  }
  divmod(a) {
    return (
      this.isZero || a.isZero
      ? [Integer.zero, this]
      : this.isNegative
      ? (([q, r]) => (
        // -x = q a + r
        [q.neg, r.neg]
      ))
      (this.neg.divmod(a))
      : a.isNegative
      ? (([q, r]) => (
        // x = q (-a) + r
        [q.neg, r]
      ))
      (this.divmod(a.neg))
      : (
        ((_, a) => (
          _.last === 0 && (
            _ = _.slice(0, _.length - 1)
          ),
          a.last === 0 && (
            a = a.slice(0, a.length - 1)
          ),
          ((_, d) => (
            (() => {
              while ((_ << d) & 0x80 === 0) d++
            })(),
            ((_, a) => (
              (([q, r]) => (
                [q.shiftRight(d), r.shiftRight(d)] // final ?
              ))
              (_.g(a, Integer.zero))
            ))
            (_.shiftLeft(d), a.shiftLeft(d))
          ))
          (a.last, 0)
        ))
        (this, a)
      )
    )
  }
  h(a) {
    return (
      new Integer([...this, 0]).lt(new Integer([...a, 0]))
    )
  }
  g(a, q) {
    console.log({ func: 'g', _: this, a, q })
    return (
      this.h(a) ? [q, this] : (
        (([x, r]) => (
          new Integer([
            ...this.slice(0, this.length - a.length),
            ...r
          ]).g(a, new Integer([x, ...q]))
        ))
        (this.slice(this.length - a.length - 1, this.length).f(a))
      )
    )
  }
  f(a) {
    console.log({ func: 'f', _: this, a })
    return (
      ((q) => (
        ((r) => (
          (() => {
            while (r.next === 0xff) {
              [q, r] = [q - 1, r.add(a)]
            }
          })(),
          r.last === 0 && (
            r = r.slice(0, r.length - 1)
          ),
          [
            q,
            new Integer([
              ...r,
              ...Array(a.length - r.length).fill(0)
            ])
          ]
        ))
        (this.add(a.mul(new Integer([q, 0])).neg))
      ))
      (
        ((_) => (
          ((a) => (
            Math.min(Math.floor(_ / a), 0xff)
          ))
          (a.last)
        ))
        (
          ((_1, _0) => (
            (_0 << 8) + _1
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
