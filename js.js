var Complex = function(ord, arg) {
  var _
  ord = ord || 0; arg = arg || 0
  arg %= 1; arg < 0 && (arg += 1)
  this.ord = ord; this.arg = arg
  _ = arg; _ < 0.5 || (_ -= 1); _ *= this.pi2
  this._arg = _
  ord === 0 && arg === 0 && (this.isUnity = true)
}

!function(){

var _ = Complex.prototype

_.pi2 = Math.PI * 2

_.shift = function() {
  return new Complex(this.ord + 1, this.arg)
}
_.succ = function() {
  return this.exp().shift().log()
}
_.conjugate = function() {
  return new Complex(this.ord, -this.arg)
}

_.eql = function(a) {
  return this.ord === a.ord && this.arg === a.arg
}
_.inv = function() {
  return new Complex(-this.ord, -this.arg)
}
_.mul = function(a) {
  return new Complex(this.ord + a.ord, this.arg + a.arg)
}
_.neg = function() {
  return new Complex(this.ord, this.arg + 0.5)
}
_.add = function(a) {
  return a === 0           ? this        :
         this.neg().eql(a) ? 0           :
         this.ord < a.ord  ? a.add(this) :
         this.mul(this.inv().mul(a).succ())
}
_.log = function() {
  return this.isUnity ? 0 :
         new Complex(
           Math.log  (this.ord * this.ord + this._arg * this._arg) * 0.5,
           Math.atan2(this._arg, this.ord) / this.pi2
         )
}
_.exp = function() {
  var _ = Math.exp(this.ord)

  return new Complex(
           _ * Math.cos(this._arg),
           _ * Math.sin(this._arg) / this.pi2
         )
}
_.toString = function() {
  var ord, arg

  ord = this.ord.toFixed(8).split('.')
  arg = this.arg.toFixed(8).split('.')
  ord[1] = ord[1] || '0'
  arg[1] = arg[1] || '0'
  return ord[0] + '.' + ord[1] + '.' + arg[1] + 'X'
}

}()