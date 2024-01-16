class Cell {
  constructor(rules) {
    this.value = 0
    this.rules = rules
    this.colors = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
  }


  fromAbove(left, middle, right) {
    for (let i = 0; i < this.colors.length; i++) {
      const row = this.colors[i]
      for (let j = 0; j < row.length; j++) {
        const idx = left.colors[i][j] << 2 | middle.colors[i][j] << 1 | right.colors[i][j]
        const mask = idx > 0 ? 1 << idx : 0
        if ((mask & this.rules[i][j]) > 0) {
          this.colors[i][j] = 1
        }
      }
    }
  }

  color() {
    const r = this.colors[0].reduce((a, b) => a + b) * 85
    const g = this.colors[1].reduce((a, b) => a + b) * 85
    const b = this.colors[2].reduce((a, b) => a + b) * 85
    return `rgb(${255 - r}, ${255 - g}, ${255 - b})`
  }

  draw(ctx, x, y, dim) {
    ctx.save()
    ctx.fillStyle = this.color()
    ctx.beginPath()
    ctx.rect(x, y, dim, dim)
    ctx.fill()
    ctx.restore()
  }
}

function drawer(ctx, width, height) {
  const numCells = 200
  const cellDim = width / numCells
  const maxRows = Math.ceil(height / cellDim)
  const rules = [
    [13, 1, 18],
    [89, 3, 28],
    [126, 9, 30],
  ]

  const fourth = Math.floor(numCells / 4)
  let cells = []
  for (let y = 0; y < maxRows; y++) {
    cells.push([])
    for (let x = 0; x < numCells; x++) {
      const c = new Cell(rules)
      if (y == 0 && x == fourth) {
        c.colors = [
          [0, 0, 1],
          [0, 1, 0],
          [1, 0, 0],
        ]
      } else if (y == 0 && x == (fourth * 2)) {
        c.colors = [
          [0, 1, 0],
          [1, 0, 0],
          [0, 0, 1],
        ]
      } else if (y == 0 && x == (fourth * 3)) {
        c.colors = [
          [1, 0, 0],
          [0, 0, 1],
          [0, 1, 0],
        ]
      }

      cells[y].push(c)
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height)
    for (let y = 0; y < cells.length; y++) {
      for (let x = 0; x < numCells; x++) {
        const X = cellDim * x
        const Y = height - cellDim - (cellDim * y)
        cells[y][x].draw(ctx, X, Y, cellDim)
      }
    }
    iterate(cells, rules)
    window.setTimeout(() => {
      window.requestAnimationFrame(draw)
    }, 10)
  }
  return draw
}

function iterate(cells, rule) {
  for (let y = cells.length - 1; y > 0; y--) {
    cells[y] = cells[y - 1]
  }
  row = cells[1]
  newRow = []
  {
    const c = new Cell(rule)
    c.fromAbove(row[row.length - 1], row[0], row[1])
    newRow.push(c)
  }
  for (let x = 1; x < row.length - 1; x++) {
    const c = new Cell(rule)
    c.fromAbove(row[x - 1], row[x], row[x + 1])
    newRow.push(c)
  }
  {
    // calc last cell using wrap to front
    const c = new Cell(rule)
    c.fromAbove(row[row.length - 2], row[row.length - 1], row[0])
    newRow.push(c)
  }
  cells[0] = newRow
}

function main() {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx.scale(dpr, dpr)

  draw = drawer(ctx, width, height)
  window.requestAnimationFrame(draw)
}

window.onload = main
