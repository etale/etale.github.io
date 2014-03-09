var calc = function () {
  document.body.appendChild(calc.display)
  document.body.appendChild(calc.keypad)
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
  data.cell = cell

  return cell
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
func['⎵'] = function () {
  fix(); set(new Adele(e.value.n))
}
func['↕'] = function () {
  fix()
  if (e.previousSibling) {
    e.parentNode.insertBefore(e, e.previousSibling)
    e.nextSibling.focus()
  }
}
func['↺'] = function () {}
func['/'] = function () {
  fix(); set(e.value.inv())
}
func['−'] = function () {
  fix(); set(e.value.neg())
}
func['\\'] = function () {
  fix(); set(e.value.res())
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
func['✃'] = function () {
  var _

  fix(); _ = e.value
  set(_.body()); push()
  set(_.unit())
}
func['✁'] = function () {
  var _

  fix(); _ = e.value
  set(new Adele(_._r, _.s)); push()
  set(new Adele(0, 1, _.n))
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
  ['⎵', '↕', '↺', '4', '5', '6'],
  ['✃', ' ', '/', '1', '2', '3'],
  ['✁', '+', '−', '0', '.', '\\']
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

}()

onload = calc