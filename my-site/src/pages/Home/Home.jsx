import { Link } from 'react-router-dom'
import AppCard from '../../components/AppCard/AppCard'
import styles from './Home.module.css'

const games = [
  { title: '2048',   description: '合并数字，挑战 2048！',  path: '/games/2048',  color: '--color-amber-100', emoji: '🔢' },
  { title: '贪吃蛇', description: '经典贪吃蛇，吃得越多越难', path: '/games/snake', color: '--color-amber-100', emoji: '🐍' }
]

const tools = [
  { title: '记事本',   description: '随手记，自动保存',     path: '/tools/notepad',    color: '--color-coral-50', emoji: '📝' },
  { title: '日历',     description: '查看日期与备忘',       path: '/tools/calendar',   color: '--color-coral-50', emoji: '📅' },
  { title: '计算器',   description: '日常计算用',           path: '/tools/calculator', color: '--color-coral-50', emoji: '🔢' },
  { title: '转盘抽奖', description: '填入选项，转盘决定！',  path: '/tools/spinner',    color: '--color-coral-50', emoji: '🎡' }
]

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>欢迎来到我的小站 🎉</h1>
        <p className={styles.heroSubtitle}>这里有休闲小游戏和实用的日常工具，随取随用</p>
      </section>

      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎮</span>
            <h2>游戏</h2>
          </div>
          <div className={styles.cardGrid}>
            {games.map(game => (
              <AppCard key={game.path} {...game} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔧</span>
            <h2>工具</h2>
          </div>
          <div className={styles.cardGrid}>
            {tools.map(tool => (
              <AppCard key={tool.path} {...tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}