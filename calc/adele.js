var calc = function () {
  Number.radix = parseInt(location.hash.slice(1)) || 10
  calc.refresh()
  document.body === calc.display.parentNode || document.body.appendChild(calc.display)
  document.body === calc.keypad .parentNode || document.body.appendChild(calc.keypad)
}

!function () {

var
set = function (a) {
  e.value = a; e.data.textContent = a.toString()
},
reset = function () {
  delete e.value; e.data.textContent = '0'
},
bs = function () {
  var _ = e.data.textContent.slice(0, -1)

  e.data.textContent = _ === '' ? '0' : _
},
fix = function () {
  e.value = e.value || new Adele(parseInt(e.data.textContent))
},
focus = function () {
  e.classList.remove('focus')
  e = this
  e.classList.add('focus')
},
makeCell = function () {
  var
  cell = html.tr(),
  data = html.td()
  
  cell.appendChild(data)
  data.textContent = '0'
  cell[touch] = cell.focus = focus
  cell.data = data

  return cell
},
refresh = function () {
  var _ = calc.display.firstChild

  while (_) {
    _.value && (_.data.textContent = _.value.toString())
    _ = _.nextSibling
  }
},
push = function () {
  e.parentNode.insertBefore(makeCell(), e.nextSibling)
  e.nextSibling.focus()
},
pop = function () {
  var _ = e.value
  
  if (e.previousSibling) {
    e.previousSibling.focus()
    e.parentNode.removeChild(e.nextSibling)
  }
  
  return _
},
numeric = function () {
  var _ = this.textContent, __
  
  e.value && push()
  __ = e.data
  __.textContent = (__.textContent === '0' ? '' : __.textContent) + _
},
touch = document.createElement('div').hasOwnProperty('ontouchend') ? 'ontouchend' : 'onmouseup',
html = {}, func = {}, e

10 .forEach(function (i) {
  func[i] = numeric
})
func['.'] = function() {
  e.value && push()
  e.data.textContent += '.'
}
func['↑'] = function () {
  var _ = e.value

  _ ? push() : (_ = new Adele(parseInt(e.data.textContent)))
  set(_)
}
func['↓'] = function () {
  e.previousSibling ? pop() : reset()
}
func['←'] = function () {
  e.value ? reset() : bs()
}
func['ˆ'] = function () {
  var _

  if (e.previousSibling) {
    fix(); _ = pop(); set(e.value ? e.value.pow(_) : _)
  }
}
func['↕'] = function () {
  fix()
  if (e.previousSibling) {
    e.parentNode.insertBefore(e, e.previousSibling)
    e.nextSibling.focus()
  }
}
func['↔'] = function () {
  Number.isLittle = ! Number.isLittle
  refresh()
}
func['/'] = function () {
  var _ 

  fix(); _ = e.value
  _.isZero() || set(_.inv())
}
func['−'] = function () {
  fix(); set(e.value.neg())
}
func['\\'] = function () {
  var _

  fix(); _ = e.value
  _.isUnit() || set(_.isZero() ? new Adele(_.n) : _.res())
}
func[' '] = function () {
  var _

  if (e.previousSibling) {
    fix(); _ = pop(); set(e.value ? e.value.mul(_) : _)
  }
}
func['+'] = function () {
  var _

  if (e.previousSibling) {
    fix(); _ = pop(); set(e.value ? e.value.add(_) : _)
  }
}
func[':'] = function () {
  var _, __, p

  fix(); _ = e.value

  if (_.isZero() || _.isUnit()) {
    // do nothing
  } else
  if (_.isBody()) {
    // prime factorization
    __ = _.factor(); p = __[0]; _ = __[1]
    set(p)
    if (!_.isUnity()) {
      push(); set(_)  
    }
  } else
  {
    // ub factorization
    set(_.body()); push(); set(_.unit())
  }
}
func['..'] = function () {
  var _

  fix(); _ = e.value
  if (_.n === 0) {
    // do nothing
  } else
  if (!_.isZero()) {
    set(new Adele(_.r, _.s)); push()
    set(new Adele(0, 1, _.n))
  }
}

;['tr', 'td', 'table'].forEach(function (a) {
  html[a] = function () {
    return document.createElement(a)
  }
})

calc.display = html.table()
calc.keypad  = html.table()
;[
  ['↑', '↓', '←', '7', '8', '9'],
  ['ˆ', '↕', '↔', '4', '5', '6'],
  [':', ' ', '/', '1', '2', '3'],
  ['..', '+', '−', '0', '.', '\\']
].forEach(function (tds) {
  var tr = html.tr()

  tds.forEach(function (td) {
    var _ = html.td()
              
    _.textContent = td
    _[touch] = func[td]
    tr.appendChild(_)
  })
  calc.keypad.appendChild(tr)
})
calc.keypad.classList.add('keypad')
e = makeCell()
calc.display.appendChild(e)
calc.display.classList.add('display')
calc.refresh = refresh

}()

onload = onhashchange = calc
