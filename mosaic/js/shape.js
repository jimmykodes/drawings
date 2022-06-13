function applyRotation(ctx, side, rotation) {
  const t = side / 2
  ctx.translate(t, t)
  ctx.rotate(rotation)
  ctx.translate(-t, -t)
}

function circle(ctx, x, y, side, rotation, color, bgColor) {
  ctx.save()
  ctx.translate(x, y)
  applyRotation(ctx, side, rotation)
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.moveTo(0, 0)
  ctx.lineTo(0, side)
  ctx.moveTo(0, 0)
  ctx.lineTo(side, 0)
  ctx.arc(0, 0, side, 0, Math.PI / 2)
  ctx.fill()
  ctx.restore()
}

function hollowArc(ctx, x, y, side, rotation, color, bgColor) {
  ctx.save()
  ctx.translate(x, y)
  applyRotation(ctx, side, rotation)
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.moveTo(0, 0)
  ctx.lineTo(0, side)
  ctx.moveTo(0, 0)
  ctx.lineTo(side, 0)
  ctx.arc(0, 0, side, 0, Math.PI / 2)
  ctx.fill()
  ctx.beginPath()
  ctx.fillStyle = bgColor
  ctx.moveTo(0, 0)
  ctx.lineTo(0, side * .85)
  ctx.moveTo(0, 0)
  ctx.lineTo(side * .85, 0)
  ctx.arc(0, 0, side * .85, 0, Math.PI / 2)
  ctx.fill()
  ctx.restore()
} 

function dots(ctx, x, y, side, rotation, color, bgColor) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = color
  const r = side / 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.beginPath()
      ctx.arc((r * i) + r * .5, r * j + r * .5, r * .4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

