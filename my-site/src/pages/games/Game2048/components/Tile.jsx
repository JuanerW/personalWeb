import styles from './Tile.module.css'

const tileColors = {
  2:    { bg: '#FAEEDA', color: '#633806' },
  4:    { bg: '#FAC775', color: '#412402' },
  8:    { bg: '#EF9F27', color: '#412402' },
  16:   { bg: '#F5C4B3', color: '#4A1B0C' },
  32:   { bg: '#D85A30', color: '#FAECE7' },
  64:   { bg: '#F4C0D1', color: '#4B1528' },
  128:  { bg: '#D4537E', color: '#FBEAF0' },
  256:  { bg: '#993556', color: '#FBEAF0' },
  512:  { bg: '#7F77DD', color: '#EEEDFE' },
  1024: { bg: '#534AB7', color: '#EEEDFE' },
  2048: { bg: '#3C3489', color: '#CECBF6' },
}

function fontSize(value) {
  if (value >= 1024) return '16px'
  if (value >= 128)  return '18px'
  return '20px'
}

export default function Tile({ value, row, col, isNew, isMerged }) {
  const { bg, color } = tileColors[value] || { bg: '#3C3489', color: '#CECBF6' }

  let cls = styles.tile
  if (isNew)    cls += ' ' + styles.appear
  if (isMerged) cls += ' ' + styles.merge

  return (
    <div
      className={cls}
      style={{
        '--r': row,
        '--c': col,
        backgroundColor: bg,
        color,
        fontSize: fontSize(value),
      }}
    >
      {value}
    </div>
  )
}
