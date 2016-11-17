Array.prototype.convolute = function (a, i) {
  return (
    ((x) => (
      ((j) => {
        while (j <= i) {
          x += this[j] * a[i - j]; j++
        }
      })(0), x
    ))(0)
  )
}
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
  get final() {
    return (
      this.isZero ? this.zero :
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
  get zero() { return Integer.zero }
  get isZero() { return this.length === 0 }
  get unity() { return Integer.unity }
  get isUnity() { return this.length === 1 && this[0] === 1 }
  get neg() {
    return (
      this.isZero ? this.zero :
      this.map((a) => (
        0xff - a
      )).add(this.unity)
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
  mul(a) {
    return (
      ((_) => (
        _.isZero || a.isZero ? _.zero :
        ((r) => (
          ((_, a) => (
            r.reduce((x, __, i) => (
              ((x) => (
                (r[i] = x & 0xff), x >> 8
              ))
              (x + _.convolute(a, i))
            ), 0)
          ))
          (Array(..._, ...Array(a.length).fill(_.next)),
           Array(...a, ...Array(_.length).fill(a.next))),
          r.final
        ))
        (new Integer(_.length + a.length))
      ))
      (this)
    )
  }
  divmod(a) {
    return (
      this.isZero || a.isZero
      ? [this.zero, this]
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
      : (([q, r]) => (
        [q.n2i, r.n2i]
      ))
      (this.i2n.divmodn(a.i2n))
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
      (this, this.unity)
    )
  }
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

/*
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
 */
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
      this.isZero ? this.zero :
      this.last === 0 ? this.slice(0, this.length - 1).finaln :
      this
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
  muln(a) {
    return (
      this.isZero || a.isZero ? this.zero :
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
        _.finaln
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
        _.finaln
      ))
      (new Integer(this.length))
    )
  }
  divmodn(a) {
    return (
      ((d) => (
        ((_, a) => (
          (([q, r]) => (
            [q.shiftRight(d), r.shiftRight(d)]
          ))
          (_._divmodn(a, this.zero))
        ))
        (this.shiftLeft(d), a.shiftLeft(d))
      ))
      (d(a.last))
    )
  }
  _divmodn(a, q) {
    // assume a is normalized
    p({ x: this, a, q })
    return (
      this.ltn(a) ? [q, this] : (
        ((_) => (
          _.length === a.length && (
            _ = new Integer([..._, 0])
          ),
          ((_q, r) => (
            p(new Integer([
              ..._.slice(0, _.length - a.length - 1),
              ...r
            ])._divmodn(a, new Integer([_q, ...q])))
          ))
          (..._
            .slice(_.length - a.length - 1, _.length)
            .f(a))
        ))
        (this)
      )
    )
  }
  f(a) {
    p({ x: this, a })
    return (
      ((q) => (
        ((r) => (
          (() => {
            while (r.isNegative) {
              [q, r] = [q - 1, r.add(a)]
            }
          })(),
          p([q, r.i2n])
        ))
        (this.n2i.sub(a.mulnSmall(q).n2i))
      ))
      (Math.min(((this.last << 8) + this.secondLast).div(a.last), 0xff))
    )
  }
  mulnSmall(a) {
    return (
      this.isZero || a === 0 ? this.zero : (
        ((_) => (
          ((last) => (
            new Integer([..._, last]).finaln
          ))
          (this.reduce((x, e, i) => (
            ((e) => (
              (_[i] = e & 0xff), e >> 8
            ))
            (x + e * a)
          ), 0))
        ))
        (new Integer(this.length))
      )
    )
  }
  divmodnSmall(a) {
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
let d = (a) => {
  let d = 0
  while (((a << d) & 0x80) === 0) {
    d++
  }
  return d
}
let p = (a) => (
  console.log(a), a
)

module.exports = { Integer, d, p }
