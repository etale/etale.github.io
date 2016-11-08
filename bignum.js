class Integer extends Uint8Array {
  constructor(a) {
    super(a)
  }
  get last() {
    return (
      this.length < 1 ? 0 :
      this[this.length - 1]
    )
  }
  get secondLast() {
    return (
      this.length < 2 ? 0 :
      this[this.length - 2]
    )
  }
  get next() {
    return this.last < 0x80 ? 0 : 0xff
  }
  get n2i() {
    return (
      this.last > 0x7f ? new Integer([...this, 0]) : this
    )
  }
  get i2n() {
    // assume this is natural
    return this.finaln
  }
  get finaln() {
    return (
      this.isZero ? Integer.zero :
      this.last === 0 ? this.slice(0, this.length - 1).finaln :
      this
    )
  }
  get final() {
    return (
      this.isZero ? Integer.zero :
      this.last === 0    && this.secondLast < 0x80 ||
      this.last === 0xff && this.secondLast > 0x7f ? this.slice(0, this.length - 1).final :
      this
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
  cmpn(a) {
    return (
      this.length > a.length ? 1 :
      this.length < a.length ? -1 :
      this.last > a.last ? 1 :
      this.last < a.last ? -1 :
      0
    )
  }
  ltn(a) { return this.cmpn(a) < 0 }
  gtn(a) { return this.cmpn(a) > 0 }
  lten(a) { return this.cmpn(a) <= 0 }
  gten(a) { return this.cmpn(a) >= 0 }
  get isNegative() { return this.last > 0x7f }
  cmp(a) {
    return (
      ((_) => (
        _.isZero ? 0 :
        _.isNegative ? -1 :
        1
      ))
      (this.sub(a))
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
      this.isZero ? Integer.zero :
      this.map((a) => (
        0xff - a
      )).add(Integer.unity)
    )
  }
  addn(a) {
    return (
      ((_) => (
        ((x) => (
          new Integer([..._, x]).finaln
        ))
        (_.reduce((x, e, i) => (
          ((_i, ai) => (
            (e = x + _i + ai),
            (_[i] = e & 0xff), e >> 8
          ))
          (this[i] || 0, a[i] || 0)
        ), 0))
      ))
      (new Integer(Math.max(this.length, a.length)))
    )
  }
  add(a) {
    return (
      ((_) => (
        ((x) => (
          new Integer([..._, x]).final
        ))
        (_.reduce((x, e, i) => (
          ((_i, ai) => (
            _i === undefined && (_i = this.next),
            ai === undefined && (ai = a.next),
            (e = x + _i + ai),
            (_[i] = e & 0xff), e >> 8
          ))
          (this[i], a[i])
        ), 0) + this.next + a.next)
      ))
      (new Integer(Math.max(this.length, a.length)))
    )
  }
  sub(a) {
    return this.add(a.neg)
  }
  muln(a) {
    return (
      this.isZero || a.isZero ? Integer.zero :
      ((_) => (
        this.forEach((_e, _i) => (
          _[_i + a.length] = a.reduce((x, ae, ai) => (
            ((e, i) => (
              (_[i] += e & 0xff), e >> 8
            ))
            (_e * ae, _i + ai)
          ), 0)
        )),
        _.finaln
      ))
      (new Integer(this.length + a.length))
    )
  }
  mul(a) {
    return (
      this.isNegative
      ? a.isNegative
        ? this.neg.i2n.muln(a.neg.i2n).n2i
        : this.neg.i2n.muln(a.i2n).n2i.neg
      : a.isNegative
        ? this.i2n.muln(a.neg.i2n).n2i.neg
        : this.i2n.muln(a.i2n).n2i
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
        _.final
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
    // assume a = 0, ..., 2 ** 32 - 1
    return (
      ((_, r) => (
        (() => {
          while (a) {
            a & 1 === 1 && (r = r.mul(_)),
            _ = _.mul(_),
            a = a >>> 1
          }
        })(),
        r.final
      ))
      (this, Integer.unity)
    )
  }
  get d() {
    return (
      ((_, d) => (
        (() => {
          while (((_ << d) & 0x80) === 0) d++
        })(), d
      ))
      (this.last || this.secondLast, 0)
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
        ((d) => (
          ((_, a) => (
            (([q, r]) => (
              [q.shiftRight(d), r.shiftRight(d)]
            ))
            (_.g(a, Integer.zero))
          ))
          (this.shiftLeft(d), a.shiftLeft(d))
        ))
        (a.d)
      )
    )
  }
  div(a) {
    return (
      ((q, r) => q)
      (...this.divmod(a))
    )
  }
  mod(a) {
    return (
      ((q, r) => r)
      (...this.divmod(a))
    )
  }
  g(a, q) {
    console.log({ func: 'g', _: this, a, q })
    return (
      this.lt(a) ? [q, this] : (
        ((_) => (
          _.length === a.length && (
            _ = new Integer([..._, 0])
          ),
          ((x, r) => (
            new Integer([
              ..._.slice(0, _.length - a.length - 1),
              ...r
            ]).g(a, new Integer([x, ...q]))
          ))
          (..._.slice(
            _.length - a.length - 1,
            _.length).f(a))
        ))
        (this)
      )
    )
  }
  _g(a, q) {
    let _ = this
    if (this.lt(a)) {
      return [q, this]
    }
    while (_.last === 0) { _ = _.slice(0, _.length - 1) }
    while (a.last === 0) { a = a.slice(0, a.length - 1) }
    if (_.length === a.length) { _ = new Integer([..._, 0]) }
    let [_q, r] = _.slice(_.length - a.length - 1, _.length).f(a)
    _ = new Integer([..._.slice(0, _.length - a.length - 1), ...r])
    q = new Integer([_q, ...q])
    return _._g(a, q)
  }
  f(a) {
    console.log({ func: 'f', _: this, a })
    return (
      ((q) => (
        ((r) => (
          (() => {
            while (r.isNegative) {
              [q, r] = [q - 1, r.add(a)]
            }
          })(),
          [q, r]
        ))
        (this.sub(a._mul(q)))
      ))
      (((_) => {
        while (_.last === 0) _ = _.slice(0, _.length - 1)
        while (a.last === 0) a = a.slice(0, a.length - 1)
        return Math.min(((_.last << 8) + _.secondLast).div(a.last), 0xff)
      })
      (this))
    )
  }
  _mul(a) {
    return (
      this.isZero || a === 0 ? Integer.zero : (
        ((_) => (
          ((last) => (
            new Integer([..._, last]).final
          ))
          (this.reduce((x, e, i) => (
            ((e) => (
              (_[i] = e & 0xff), e >> 8
            ))
            (x + e * a)
          ), 0) + this.next + (a < 0x80 ? 0 : 255))
        ))
        (new Integer(this.length))
      )
    )
  }
  _divmod(a) {
    return (
      ((_) => (
        ((r) => (
          [_.final, r]
        ))
        (this.reduceRight((x, e, i) => (
          ((q, r) => (
            (_[i] = q), r
          ))
          (...((x << 8) + e).divmod(a))
        ), 0))
      ))
      (new Integer(this.length))
    )
  }
}
Integer.zero = new Integer
Integer.unity = new Integer([1])
Integer.unityNeg = Integer.unity.neg

Number.prototype.divmod = function (a) {
  return (
    ((r) => (
      [(this - r) / a, r]
    ))
    (this % a)
  )
}
Number.prototype.div = function (a) {
  return (
    ((q, r) => (
      q
    ))
    (...this.divmod(a))
  )
}

module.exports = Integer
