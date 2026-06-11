import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import useAmbient, { SOUND_DEFS } from './hooks/useAmbient'
import styles from './AmbientMixer.module.css'

export default function AmbientMixer() {
  const { T } = useLang()
  const { sounds, master, toggle, setVolume, setMaster } = useAmbient()

  const anyActive = sounds.some(s => s.active)

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <Link to="/" className={styles.back}>{T.back}</Link>
          <h1 className={styles.title}>{T.ambientTitle}</h1>
        </div>

        {/* Master volume */}
        <div className={styles.masterRow}>
          <span className={styles.masterLabel}>{T.ambientMaster}</span>
          <input
            type="range" min={0} max={100} value={master}
            onChange={e => setMaster(+e.target.value)}
            className={styles.slider}
            aria-label={T.ambientMaster}
          />
          <span className={styles.masterVal}>{master}</span>
        </div>

        {/* Sound grid */}
        <div className={styles.grid}>
          {SOUND_DEFS.map(def => {
            const state  = sounds.find(s => s.id === def.id)
            const active = state?.active ?? false
            const vol    = state?.volume ?? 65
            const info   = T.ambientSounds[def.id]

            return (
              <div key={def.id} className={`${styles.card} ${active ? styles.cardActive : ''}`}>
                <div className={styles.cardEmoji}>{info.emoji}</div>
                <div className={styles.cardName}>{info.label}</div>

                <button
                  className={`${styles.toggleBtn} ${active ? styles.toggleOn : ''}`}
                  onClick={() => toggle(def.id)}
                  aria-pressed={active}
                >
                  {active ? T.ambientStop : T.ambientPlay}
                </button>

                <div className={`${styles.volRow} ${active ? styles.volVisible : ''}`}>
                  <input
                    type="range" min={0} max={100} value={vol}
                    onChange={e => setVolume(def.id, +e.target.value)}
                    className={styles.slider}
                    disabled={!active}
                    aria-label={`${info.label} volume`}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {!anyActive && (
          <p className={styles.hint}>{T.ambientHint}</p>
        )}
      </div>
    </div>
  )
}
