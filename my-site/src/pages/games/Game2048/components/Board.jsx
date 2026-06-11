import Tile from './Tile'
import styles from './Board.module.css'

export default function Board({ board, lastMove }) {
  return (
    <div className={styles.board}>
      {board.map((row, r) =>
        row.map((val, c) => {
          const key = `${r}-${c}`
          const isNew = lastMove && lastMove.board[r][c] === 0 && val !== 0
          const isMerged = lastMove && lastMove.board[r][c] !== 0 && val !== 0 && lastMove.board[r][c] !== val
          return (
            <Tile key={`${key}-${val}`} value={val} isNew={isNew} isMerged={isMerged} />
          )
        })
      )}
    </div>
  )
}