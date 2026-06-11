import AppCard from '../../components/AppCard/AppCard'
import { useLang } from '../../LangContext'
import styles from './Home.module.css'

export default function Home() {
  const { T } = useLang()

  const games = [
    { key: '2048',   path: '/games/2048',   emoji: '🔢' },
    { key: 'snake',  path: '/games/snake',  emoji: '🐍' },
    { key: 'wordle', path: '/games/wordle', emoji: '🟩' },
  ]
  const tools = [
    { key: 'notepad',    path: '/tools/notepad',    emoji: '📝' },
    { key: 'calendar',   path: '/tools/calendar',   emoji: '📅' },
    { key: 'calculator', path: '/tools/calculator', emoji: '🧮' },
    { key: 'spinner',    path: '/tools/spinner',    emoji: '🎡' },
    { key: 'tba',        href: '/personalWeb/TBA/', emoji: '📋' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <h1 className={styles.heroTitle}>{T.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{T.heroSubtitle}</p>
        </div>
      </div>

      <div className={styles.inner}>
        <section className={styles.section}>
          <div className={styles.secLabel}>{T.games}</div>
          <div className={styles.cardGrid}>
            {games.map(g => (
              <AppCard key={g.key} path={g.path} emoji={g.emoji}
                type={T.games}
                title={T.apps[g.key].title}
                description={T.apps[g.key].desc} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.secLabel}>{T.tools}</div>
          <div className={styles.cardGrid}>
            {tools.map(t => (
              <AppCard key={t.key} path={t.path} href={t.href} emoji={t.emoji}
                type={T.tools}
                title={T.apps[t.key].title}
                description={T.apps[t.key].desc} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
