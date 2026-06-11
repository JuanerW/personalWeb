import Tile from './Tile'
import styles from './Board.module.css'

const BG_CELLS = Array.from({ length: 16 }, (_, i) => i)

export default function Board({ tiles }) {
  return (
    <div className={styles.board}>
      {BG_CELLS.map(i => <div key={i} className={styles.cell} />)}
      {tiles.map(tile => (
        <Tile key={tile.id} {...tile} />
      ))}
    </div>
  )
}
