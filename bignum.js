class Integer extends Uint8Array {
  constructor(a) {
    super(a)
  }
  get final() {
    let _ = Array.from(this)

    while (
      _[_.length - 1] === 0    && _[_.length - 2] < 0x80 ||
      _[_.length - 1] === 0xff && _[_.length - 2] > 0x7f
    ) _.pop()
    if (_.length === 1) {
      if (_[0] === 0) {
        return Integer.zero
      } else
      if (_[0] === 1) {
        return Integer.unity
      }
    }
    return new Integer(_)
  }
  get zero() { return Integer.zero }
  get unity() { return Integer.unity }
  get neg() {
    return this.map((a) => (
      0xff - a
    )).add(Integer.unity)
  }
  add(a) {
    return ((_, a) => {
      _.length < a.length && (
        [a, _] = [_, a]
      )
      _ = new Integer([..._, _[_.length - 1] < 0x80 ? 0 : 0xff])
      a = new Integer([...a, Array(_.length - a.length).fill(
        a[a.length - 1] < 0x80 ? 0 : 0xff
      )])
      let i
      for (i = 0; i < _.length; i++) {
        ((x) => {
          _[i] = x & 0xff
          _[i + 1] = x >>> 8
        })
        (_[i] + a[i])
      }
      return _.final
    })
    (this, a)
  }
  mul(a) {
    let _ = new Integer(this.length + a.length)
    let i, j
    for (i = 0; i < this.length; i++) {
      for (j = 0; j < a.length; j++) {
        ((x) => {
          _[i + j] = x & 0xff
          _[i + j + 1] = x >>> 8
        })
        (_[i + j] + this[i] * a[j])
      }
    }
    return _.final
  }
  divmod(a) {
    return
  }
}
Integer.zero = new Integer
Integer.unity = new Integer([1])
Integer.negUnity = Integer.unity.neg

module.exports = Integer
