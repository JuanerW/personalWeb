import { Link } from 'react-router-dom'
import useSpinner from './hooks/useSpinner'
import styles from './Spinner.module.css'

const emojis = ['🎉', '🌟', '🎊', '✨', '🎈', '🎁', '🎀', '🌸', '🔥', '⭐', '💎', '🍀', '🌈', '🎵', '🎶', '💫', '🦋', '🌺', '🍭', '🏆']

function getSectorPath(cx, cy, r, startAngle, endAngle) {
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export default function Spinner() {
  const { items, rotation, rotating, result, addItem, updateItem, removeItem, spin, closeResult, setResult } = useSpinner()

  const cx = 150
  const cy = 150
  const r = 140
  const sectorSize = items.length > 0 ? (2 * Math.PI) / items.length : 0

  function handleEmojiSelect(itemId) {
    const currentItem = items.find(i => i.id === itemId)
    if (!currentItem) return
    const currentIndex = emojis.indexOf(currentItem.emoji)
    const nextIndex = (currentIndex + 1) % emojis.length
    updateItem(itemId, { emoji: emojis[nextIndex] })
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.back}>&larr; 返回</Link>
          <h1 className={styles.title}>转盘抽奖</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.wheelSection}>
            <div className={styles.wheelWrapper}>
              <svg width="300" height="300" viewBox="0 0 300 300" className={styles.wheelSvg}>
                <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '150px 150px', transition: rotating ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }}>
                  {items.map((item, i) => {
                    const startAngle = i * sectorSize - Math.PI / 2
                    const endAngle = (i + 1) * sectorSize - Math.PI / 2
                    const path = getSectorPath(cx, cy, r, startAngle, endAngle)
                    const midAngle = startAngle + sectorSize / 2
                    const textX = cx + (r * 0.6) * Math.cos(midAngle)
                    const textY = cy + (r * 0.6) * Math.sin(midAngle)
                    return (
                      <g key={item.id}>
                        <path d={path} fill={item.color} stroke="white" strokeWidth="2" />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="16"
                        >
                          {item.emoji}
                        </text>
                        <text
                          x={cx + (r * 0.75) * Math.cos(midAngle)}
                          y={cy + (r * 0.75) * Math.sin(midAngle)}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="11"
                          fill="#3D2B1F"
                        >
                          {item.label.length > 4 ? item.label.slice(0, 4) + '..' : item.label}
                        </text>
                      </g>
                    )
                  })}
                </g>
                {/* Pointer */}
                <polygon points="150,10 143,28 157,28" fill="var(--color-amber-800)" />
              </svg>
            </div>

            <button
              className={styles.spinBtn}
              onClick={spin}
              disabled={rotating || items.length < 2}
            >
              {rotating ? '转动中...' : '开始转动'}
            </button>
          </div>

          <div className={styles.listSection}>
            <div className={styles.listHeader}>
              <span className={styles.listTitle}>选项列表（{items.length}）</span>
              <button className={styles.addBtn} onClick={addItem}>+ 添加</button>
            </div>
            <div className={styles.list}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <button className={styles.emojiBtn} onClick={() => handleEmojiSelect(item.id)}>
                    {item.emoji}
                  </button>
                  <input
                    className={styles.nameInput}
                    value={item.label}
                    onChange={e => updateItem(item.id, { label: e.target.value })}
                    onBlur={() => {
                      const saved = localStorage.getItem('spinner-items')
                      if (saved) {
                        // Already saved via updateItem
                      }
                    }}
                    placeholder="选项名称"
                  />
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={item.color}
                    onChange={e => updateItem(item.id, { color: e.target.value })}
                  />
                  <button
                    className={styles.delBtn}
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 2}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className={styles.overlay} onClick={closeResult}>
          <div
            className={styles.resultCard}
            style={{ backgroundColor: result.color }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.resultEmoji}>{result.emoji}</div>
            <div className={styles.resultLabel}>恭喜！</div>
            <div className={styles.resultName}>{result.label}</div>
            <button className={styles.reSpinBtn} onClick={closeResult}>再转一次</button>
          </div>
        </div>
      )}
    </div>
  )
}