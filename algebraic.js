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
  _eql(a) { return new Error('_eql is missing') }
  get finalize() { return new Error('finalize is missing') }
  coerce(a) { return new Error('coerce is missing') }
  cast(a) {
    return (
      (([_, a]) => (
        a
      ))
      (this.coerce(a))
    )
  }
  get zero() {
    return this._zero.finalize
  }
  get _zero() { return new Error('_zero is missing') }
  get neg() {
    return this._neg.finalize
  }
  get _neg() { return new Error('_neg is missing') }
  add(a) {
    return (([_, a]) => (
      _._add(a).finalize
    ))
    (this.coerce(a))
  }
  _add(a) { return new Error('_add is missing') }
  get unity() {
    return this._unity.finalize
  }
  get _unity() { return new Error('_unity is missing') }
  get inv() {
    return this._inv.finalize
  }
  get _inv() { return new Error('_inv is missing') }
  mul(a) {
    return (
      (([_, a]) => (
        _._mul(a).finalize
      ))
      (this.coerce(a))
    )
  }
  _mul(a) { return new Error('_mul is missing') }
  get isZero() {
    return this._eql(this._zero)
  }
  get isUnity() {
    return this._eql(this._unity)
  }
  split(a) {
    return (
      this.isZero ? [] : (
        (([q, r]) => (
          [r, ...q.split(a)]
        ))
        (this.divmod(a))
      )
    )
  }
}
let toUint8Array = (a) => (
  a < 0 ? (
    new Integer(toUint8Array(-a))._
  ) : (
    ((arr) => (
      new Uint8Array(arr.last < 0x80 ? arr : [...arr, 0])
    ))
    (a.split)
  )
)

Object.defineProperties(Array.prototype, {
  last: {
    get() {
      return this[this.length - 1]
    }
  },
  _join: {
    value(a = 0x100) {
      return (
        this.reverse().reduce((_, e) => (
          _.mul(a).add(e)
        ), a.zero)
      )
    }
  }
})

Object.defineProperties(Number.prototype, {
  finalize: {
    get() {
      return this.valueOf()
    }
  },
  coerce: {
    value(a) {
      return (
        ((_, a) => (
          typeof a === 'number'
          ? [_, a] : (
            (([a, _]) => (
              [_, a]
            ))
            (a.coerce(this))
          )
        ))
        (this.finalize, a.finalize)
      )
    }
  },
  _eql: {
    value(a) {
      return (
        ((_, a) => (
          _ === a
        ))
        (this.coerce(a))
      )
    }
  },
  _zero: {
    get() {
      return 0
    }
  },
  _neg: {
    get() {
      return 0 - this
    }
  },
  _add: {
    value(a) {
      return (
        (([_, a]) => (
          Number.isInteger(_) && Number.isInteger(a)
          ? Integer.cast(_)._add(Integer.cast(a))
          : _ + a
        ))
        (this.coerce(a))
      )
    }
  },
  _unity: {
    get() {
      return 1
    }
  },
  _inv: {
    get() {
      return (
        ((_) => (
          Number.isInteger(_)
          ? new Adele(1, _)
          : 1 / _
        ))
        (this.finalize)
      )
    }
  },
  _mul: {
    value(a) {
      return (
        (([_, a]) => (
          Number.isInteger(_) && Number.isInteger(a)
          ? Integer.cast(_)._mul(Integer.cast(a))
          : _ * a
        ))
        (this.coerce(a))
      )
    }
  },

  divmod: {
    value(a) {
      return (
        (([_, a]) => (
          a.isZero ? [0, _] : (
            ((r) => (
              r < 0 && (r += a),
              ((q) => (
                [q, r]
              ))
              ((_ - r) / a)
            ))
            (_ % a)
          )
        ))
        (this.coerce(a))
      )
    }
  },
  div: {
    value(a) {
      return (
        (([q, r]) => (
          q
        ))
        (this.divmod(a))
      )
    }
  },
  mod: {
    value(a) {
      return (
        (([q, r]) => (
          r
        ))
        (this.divmod(a))
      )
    }
  },
  gcd: {
    value(a = 0) {
      let _ = Math.abs(this)
      a = Math.abs(a)
      while (a !== 0) {
        [_, a] = [a, _.mod(a)]
      }
      return _
    }
  },
  lcm: {
    value(a = 1) {
      let _ = Math.abs(this)
      a = Math.abs(a)
      return _ * a / _.gcd(a)
    }
  },
  __inv: {
    value(a = 0) {
      let _ = this.finalize
      let x = 1
      let z = 0
      let [q, r] = _.divmod(a)

      if (a === 0 && _ === -1) {
        return -1
      }

      while (a !== 0) {
        [q, r] = _.divmod(a)
        [_, a, x, z] = [a, r, z, x - q * z]
      }
      return x.mod(n)
    }
  },
  unit: {
    get() {
      return this < 0 ? -1 : 1
    }
  },
  body: {
    get() {
      return Math.abs(this)
    }
  },
  ub: {
    value(a = 0) {
      let _ = this.finalize
      let b = 1
      let d = _.gcd(a)

      if (_ * a === 0) {
        return [_.unit, _.body]
      }
      while (d !== 1) {
        [_, b, d] = [_ / d, b * d, _.gcd(a)]
      }
      return [_, b]
    }
  },
  factor: {
    get() {
      let [_, p, bound] = [this.body, 7, Math.sqrt(this) + 1]

      if (!(_ % 2))
        return 2
      if (!(_ % 3))
        return 3
      if (!(_ % 5))
        return 5

      while (p < bound) {
        if (!(_ % p)) //  7
          return p
        p += 4
        if (!(_ % p)) // 11
          return p
        p += 2
        if (!(_ % p)) // 13
          return p
        p += 4
        if (!(_ % p)) // 17
          return p
        p += 2
        if (!(_ % p)) // 19
          return p
        p += 4
        if (!(_ % p)) // 23
          return p
        p += 6
        if (!(_ % p)) // 29
          return p
        p += 2
        if (!(_ % p)) //  1
          return p
        p += 6
      }
      return _
    }
  },
  factorize: {
    get() {
      let _ = this.finalize, fs = {}, p

      while (_ !== 1) {
        p = _.factor
        fs[p] || (fs[p] = 0)
        fs[p] += 1
        _ /= p
      }
      return fs
    }
  },




  exp: {
    get() {
      return Math.exp(this)
    }
  },
  log: {
    get() {
      return (
        this.isZero
        ? undefined
        : this < 0
        ? Arch.cast(this).log
        : Math.log(this)
      )
    }
  },
  cos: {
    get() {
      return Math.cos(this)
    }
  },
  sin: {
    get() {
      return Math.sin(this)
    }
  },
  atan2: {
    value(a) {
      return Math.atan2(this, a)
    }
  },
  hypot: {
    value(...a) {
      return Math.hypot(this, ...a)
    }
  }
})
Reflect.setPrototypeOf(Number.prototype, Algebraic.prototype)

class Integer extends Algebraic {
  constructor(_ = new Uint8Array) {
    super()
    this._ = _
  }
  get finalize() {
    return (
      ((_) => (
        _.length < 6
        ? Array.from(_)._join()
        : this
      ))
      (this._)
    )
  }
  get float() {
    return (
      ((_) => (
        Array.from(_)._join()
      ))
      (this._)
    )
  }
  coerce(a) {
    return (
      ((_, a) => (
        typeof a === 'number'
        ? (
          Number.isInteger(a)
          ? [_, new Integer(toUint8Array(a))]
          : [_.float, a]
        )
        : (
          this.eq(a)
          ? [this, a]
          : (
            ((a, _) => (
              [_, a]
            ))
            (a.coerce(_))
          )
        )
      ))
      (this, a.finalize)
    )
  }
  _eql(a) {
    return (
      ((_, a) => (
        _.length === a.length
        && _.every((e, i) => (
          e === a[i]
        ))
      ))
      (this.ua, a.ua)
    )
  }
  get _zero() { return Integer.zero }
  get _neg() {
    return (
      new Integer(
        this._.map((e) => (
          0xff - e
        ))
      )
      ._add(this._unity)
    )
  }
  _add(a) {
    return (
      this.isZero ? a :
      a.isZero ? this : (
        ((arr) => (
          new Integer(arr)
        ))
        (
          ((_, a) => (
            _.length < a.length && ([_, a] = [a, _]),
            _ = [..._, _.last < 0x80 ? 0 : 0xff],
            a = [...a, ...Array(_.length - a.length).fill(
              a.last < 0x80 ? 0 : 0xff
            )],
            Array(_.length).fill().map((_, i) => i)
            .reduce(({ arr, carry }, i) => (
              (([q, r]) => (
                arr[i] = r,
                carry = q
              ))
              ((carry + _[i] + a[i]).divmod(0x100))
            ), {
              arr: new Uint8Array(_.length),
              carry: 0
            }).arr
          ))
          (this._, a._)
        )
      )
    )
  }
  get _unity() { return Integer.unity }
  get _inv() {
    return new Adele(this._unity, this, this._zero)
  }
  _mul(a) {
    return (
      this.isZero || a.isZero
      ? this._zero
      : this.isUnity
      ? a
      : a.isUnity
      ? this
      : (
        ((_, a) => (
          ((arr) => (
            Array(_.length).fill().map((_, i) => i).forEach((i) => (
              Array(a.length).fill().map((_, j) => j).forEach((j) => (
                (([q, r]) => (
                  arr[i + j] = r,
                  i + j + 1 < arr.length && (arr[i + j + 1] += q)
                ))
                (arr[i + j] + _[i] * a[j]).divmod(0x100)
              ))
            )),
            new Integer(arr)
          ))
          (
            new Uint8Array(_.length + a.length - 1)
          )
        ))
        (this._, a._)
      )
    )
  }
}
Integer.zero = new Integer
Integer.unity = new Integer(new Uint8Array([1]))
Integer.cast = (a) => Integer.zero.cast(a)

class Adele extends Algebraic {
  constructor(r = 0, s = 1, n = 0) {
    super()
    n = n.body
    (([u, s]) => (
      ((r) => (
        this.r = r,
        this.s = s,
        this.n = n
      ))
      ((r * u.__inv(n)).mod(n * s))
    ))
    (s.ub(n))
  }
  get finalize() {}
  coerce(a) {}
  _eql(a) {}
  get _zero() {}
  get _neg() {}
  _add(a) {}
  get _unity() {}
  get _inv() {}
  _mul(a) {}
}

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
Arch.cast = (a) => Arch.zero.cast(a)

module.exports = { Algebraic, toUint8Array, Integer, Adele, PI2, Arch }
