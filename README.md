etale.github.io
===============

# calc/*

Series of calculators for minimalist.

## Keys

+ RPN
  + `↑` push
  + `↓` pop
  + `←` backspace
+ Arithmetics
  + ` ` multiply
  + `/` invert
  + `1` unity
  + `+` add
  + `-` negate
  + `0` zero
  + `.` radix point

## calc/adele

A calculator works on finite points.

+ Arithmetics
  + `\` reduce, i.e., set modulus
  + `^` power
  + `:` split multiplicatively
  + `..` split additively
+ Residual and Rational representation
  + n\r/s means r/s in n\Z which approximates Π_{p|n} Z_p &otimes; Q

## calc/arch

A calculator works at infinity point.

+ Planck Unit System (
![c=h/2πi=G=1](https://etale.github.io/svg/unit.svg)
)
  + `kg` kilogram
  + `m` meter
  + `s` second
+ Complex numbers
  + `log` logarithmic function
  + `exp` exponential function
  + `†` conjugate
+ Logarithmic representation
  + a.b.c = a.b + 2πi × 0.c
    + `.` `.` `5` `↑` =  0.0 + 2πi × 0.5 = πi
  + z X = exp z
    + `0` `exp` = 1
    + `1` `exp` = e
    + `.` `.` `2` `5` `exp` = i
    + `.` `.` `5` `exp` = -1
