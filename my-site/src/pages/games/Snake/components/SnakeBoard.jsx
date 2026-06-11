import styles from './SnakeBoard.module.css'

function getCellClass(type) {
  switch (type) {
    case 'head': return styles.head
    case 'body': return styles.body
    case 'food': return styles.food
    default: return styles.empty
  }
}

export default function SnakeBoard({ snake, food }) {
  const grid = []
  const snakeSet = new Map()
  snake.forEach((seg, i) => {
    snakeSet.set(`${seg.x},${seg.y}`, i === 0 ? 'head' : 'body')
  })

  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      const key = `${x},${y}`
      let type = 'empty'
      if (snakeSet.has(key)) {
        type = snakeSet.get(key)
      } else if (food.x === x && food.y === y) {
        type = 'food'
      }
      grid.push({ x, y, type, key })
    }
  }

  return (
    <div className={styles.board}>
      {grid.map(cell => (
        <div key={cell.key} className={`${styles.cell} ${getCellClass(cell.type)}`} />
      ))}
    </div>
  )
}