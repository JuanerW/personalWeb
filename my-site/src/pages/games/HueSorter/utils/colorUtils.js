// Each palette: two HSL endpoints; the gradient interpolates between them.
// Shortest-path hue interpolation avoids going the "long way around" the colour wheel.

export const PALETTES = [
  { name: 'Ocean to Mint',  nameZh: '深海薄荷', from: { h: 218, s: 72, l: 32 }, to: { h: 168, s: 58, l: 62 } },
  { name: 'Sunset Coral',   nameZh: '夕阳珊瑚', from: { h:  12, s: 88, l: 52 }, to: { h:  44, s: 92, l: 60 } },
  { name: 'Aurora',         nameZh: '极光',     from: { h: 258, s: 62, l: 48 }, to: { h: 152, s: 67, l: 55 } },
  { name: 'Cherry Blossom', nameZh: '樱花',     from: { h: 340, s: 72, l: 72 }, to: { h: 275, s: 50, l: 76 } },
  { name: 'Forest Morning', nameZh: '晨林',     from: { h: 128, s: 58, l: 28 }, to: { h:  82, s: 68, l: 56 } },
  { name: 'Dusk',           nameZh: '暮紫',     from: { h: 272, s: 65, l: 42 }, to: { h: 320, s: 55, l: 60 } },
]

/**
 * Generate `count` colours evenly spaced along the HSL gradient between
 * palette.from and palette.to, using the short arc around the hue wheel.
 */
export function generateGradient(palette, count) {
  const { from, to } = palette
  const colors = []
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    // Shortest-path hue delta (stays within ±180°)
    let dh = to.h - from.h
    if (dh >  180) dh -= 360
    if (dh < -180) dh += 360
    const h = ((from.h + dh * t) % 360 + 360) % 360
    const s = from.s + (to.s - from.s) * t
    const l = from.l + (to.l - from.l) * t
    colors.push({ h, s, l })
  }
  return colors
}

export function hslStr({ h, s, l }) {
  return `hsl(${h.toFixed(1)},${s.toFixed(1)}%,${l.toFixed(1)}%)`
}
