import styles from './Tile.module.css'

const tileStyles = {
  0:    { bg: '#F1EFE8', color: 'transparent', size: '20px' },
  2:    { bg: '#FAEEDA', color: '#633806', size: '20px' },
  4:    { bg: '#FAC775', color: '#412402', size: '20px' },
  8:    { bg: '#EF9F27', color: '#412402', size: '20px' },
  16:   { bg: '#F5C4B3', color: '#4A1B0C', size: '20px' },
  32:   { bg: '#D85A30', color: '#FAECE7', size: '20px' },
  64:   { bg: '#F4C0D1', color: '#4B1528', size: '20px' },
  128:  { bg: '#D4537E', color: '#FBEAF0', size: '18px' },
  256:  { bg: '#993556', color: '#FBEAF0', size: '18px' },
  512:  { bg: '#7F77DD', color: '#EEEDFE', size: '18px' },
  1024: { bg: '#534AB7', color: '#EEEDFE', size: '16px' },
  2048: { bg: '#3C3489', color: '#CECBF6', size: '16px' },
}

export default function Tile({ value, isNew, isMerged }) {
  const t = tileStyles[value] || { bg: '#3C3489', color: '#CECBF6', size: '16px' }
  let className = styles.tile
  if (isNew) className += ' ' + styles.appear
  if (isMerged) className += ' ' + styles.merge

  if (value === 0) return <div className={styles.tile} />

  return (
    <div
      className={className}
      style={{
        backgroundColor: t.bg,
        color: t.color,
        fontSize: t.size,
      }}
    >
      {value}
    </div>
  )
}