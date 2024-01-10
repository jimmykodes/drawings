class Cell {
  constructor(init) {
    this.value = init ? 1 : 0
  }
  draw(ctx, x, y, dim) {
    ctx.save()
    ctx.fillStyle = this.value == 1 ? "#ffffff" : "#000000"
    ctx.beginPath()
    ctx.rect(x, y, dim, dim)
    ctx.fill()
    ctx.restore()
  }
}

function drawer(ctx, width, height) {
  const numCells = 120
  const cellDim = width / numCells
  const maxRows = Math.ceil(height / cellDim)

  let cells = []
  for (let y = 0; y < maxRows; y++) {
    cells.push([])
    for (let x = 0; x < numCells; x++) {
      cells[y].push(new Cell(y == 0 && x == Math.floor(numCells / 2)))
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
    iterate(cells, 126)
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
    // calc first cell using wrap to end
    const idx = row[row.length - 1].value << 2 | row[0].value << 1 | row[1].value
    const mask = idx > 0 ? 1 << idx : 0
    const val = rule & mask

    newRow.push(new Cell(val))
  }
  for (let x = 1; x < row.length - 1; x++) {
    const idx = row[x - 1].value << 2 | row[x].value << 1 | row[x + 1].value
    const mask = idx > 0 ? 1 << idx : 0
    const val = rule & mask

    newRow.push(new Cell(val))
  }
  {
    // calc last cell using wrap to front
    const idx = row[row.length - 2].value << 2 | row[row.length - 1].value << 1 | row[0].value
    const mask = idx > 0 ? 1 << idx : 0
    const val = rule & mask

    newRow.push(new Cell(val))
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
