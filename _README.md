etale.github.io
===============

[Render TeX](javascript:!function(){function a(a){var b='.MathJax .mn {background: inherit;} .MathJax .mi {color: inherit;} .MathJax .mo {background: inherit;}',c=a.createElement('style');c.innerText=b;try{c.textContent=b}catch(d){}a.getElementsByTagName('body')[0].appendChild(c);var f,e=a.createElement('script');e.src='//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML.js',e.type='text/javascript',f='MathJax.Ajax.config.path[\'Contrib\']=\'//cdn.mathjax.org/mathjax/contrib\';MathJax.Hub.Config({tex2jax:{inlineMath:[[\'$\',\'$\'],[\'$$\', \'$$\']],displayMath:[[\'\\\\[\',\'\\\\]\']],processEscapes:true},TeX:{extensions: [\'[Contrib]/xyjax/xypic.js\']}});MathJax.Hub.Startup.onload();',window.opera?e.innerHTML=f:e.text=f,a.getElementsByTagName('head')[0].appendChild(e)}function b(b){void 0===b.MathJax?a(b.document):b.MathJax.Hub.Queue(new b.Array('Typeset',b.MathJax.Hub))}var d,e,c=document.getElementsByTagName('iframe');for(b(window),d=0;d<c.length;d++)e=c[d].contentWindow||c[d].contentDocument,e.document||(e=e.parentNode),b(e)}();)

Everyone knows
the rationals $\mathbb{Q} = \varinjlim \mathbb{Z}/s$,
the residues  $\widehat{\mathbb{Z}} = \varprojlim n \backslash \mathbb{Z} = \prod_p \mathbb{Z}_p$,
the reals     $\mathbb{R} = \mathbb{Q}_\infty$ and
the adeles    $\mathbb{A_Q} = \widehat{\mathbb{Z}} \otimes \mathbb{Q} \times \mathbb{R}$.

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
  + $n\backslash r /s$ means $r/s$ in $n\Z$ which approximates $\prod_{p|n} Z_p \otimes Q$

## calc/arch

A calculator works at infinity point.

+ Planck Unit System (c = h / 2πi = G = 1)
  + `kg` kilogram
  + `m` meter
  + `s` second
+ Complex numbers
  + `log` logarithmic function
  + `exp` exponential function
  + `†` conjugate
+ Logarithmic representation
  + a.b.c = a.b + 2πi × 0.c
    + `.``.``5``↑` =  0.0 + 2πi × 0.5 = πi
  + z X = exp z
    + `0``exp` = 1
    + `1``exp` = e
    + `.``.``2``5``exp` = i
    + `.``.``5``exp` = -1
