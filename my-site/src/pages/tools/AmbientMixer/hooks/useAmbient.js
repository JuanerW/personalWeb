import { useState, useRef, useCallback, useEffect } from 'react'

// Sound definitions: noise type + filter + LFO settings
const DEFS = [
  { id: 'rain',  noise: 'pink',  filter: ['highpass', 500, 0.5],  lfo: [12,   0.10, 'sine']     },
  { id: 'ocean', noise: 'brown', filter: ['lowpass',  280, 1.0],  lfo: [0.10, 0.50, 'sine']     },
  { id: 'wind',  noise: 'pink',  filter: ['bandpass', 450, 0.4],  lfo: [0.35, 0.30, 'sine']     },
  { id: 'fire',  noise: 'brown', filter: ['lowpass',  700, 1.0],  lfo: [3.5,  0.15, 'sawtooth'] },
  { id: 'white', noise: 'white', filter: null, lfo: null                                         },
]

// --- Noise generation (runs once per type, buffers are cached) ---
function genNoise(ctx, type) {
  const sr  = ctx.sampleRate
  const len = sr * 8        // 8-second buffer → long enough to avoid noticeable repetition
  const buf = ctx.createBuffer(1, len, sr)
  const d   = buf.getChannelData(0)

  if (type === 'white') {
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1

  } else if (type === 'pink') {
    // Paul Kellet's pink noise approximation
    let b = [0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      b[0] = 0.99886*b[0] + w*0.0555179; b[1] = 0.99332*b[1] + w*0.0750759
      b[2] = 0.96900*b[2] + w*0.1538520; b[3] = 0.86650*b[3] + w*0.3104856
      b[4] = 0.55000*b[4] + w*0.5329522; b[5] = -0.7616*b[5]  - w*0.0168980
      d[i] = (b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6] + w*0.5362) * 0.11
      b[6] = w * 0.115926
    }

  } else if (type === 'brown') {
    let last = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      d[i]  = (last + 0.02 * w) / 1.02
      last  = d[i]
      d[i] *= 3.5
    }
  }

  // Normalize, then fade loop ends to minimise click at boundary
  let peak = 0
  for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i]))
  if (peak > 0) for (let i = 0; i < len; i++) d[i] = d[i] / peak * 0.85

  const fade = Math.round(sr * 0.05)  // 50 ms crossfade
  for (let i = 0; i < fade; i++) { d[i] *= i / fade; d[len - 1 - i] *= i / fade }

  return buf
}

// --- Build one sound's audio graph and start it ---
function buildSound(ctx, masterGain, def, buf, vol) {
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop   = true

  let prev = src

  if (def.filter) {
    const filt = ctx.createBiquadFilter()
    filt.type            = def.filter[0]
    filt.frequency.value = def.filter[1]
    filt.Q.value         = def.filter[2]
    prev.connect(filt)
    prev = filt
  }

  // Envelope gain (driven by LFO → amplitude modulation)
  const envGain = ctx.createGain()
  envGain.gain.value = 1.0
  prev.connect(envGain)

  let lfoOsc = null
  if (def.lfo) {
    lfoOsc = ctx.createOscillator()
    lfoOsc.type            = def.lfo[2]
    lfoOsc.frequency.value = def.lfo[0]
    const depth = ctx.createGain()
    depth.gain.value = def.lfo[1]
    lfoOsc.connect(depth)
    depth.connect(envGain.gain)   // adds ±depth to envGain.gain (which starts at 1.0)
    lfoOsc.start()
  }

  // User volume gain
  const volGain = ctx.createGain()
  volGain.gain.value = vol / 100
  envGain.connect(volGain)
  volGain.connect(masterGain)

  src.start()
  return { src, volGain, lfoOsc }
}

// --- Hook ---
export const SOUND_DEFS = DEFS   // exported so component can read labels/emojis from lang

export default function useAmbient() {
  const [sounds, setSounds] = useState(
    DEFS.map(d => ({ id: d.id, active: false, volume: 65 }))
  )
  const [master, setMasterState] = useState(80)

  const ctxRef      = useRef(null)
  const masterRef   = useRef(null)
  const nodesRef    = useRef({})    // { [id]: { src, volGain, lfoOsc } }
  const buffersRef  = useRef({})    // { [noiseType]: AudioBuffer }
  const masterVolRef = useRef(80)

  // Clean up everything on unmount
  useEffect(() => () => {
    Object.values(nodesRef.current).forEach(n => {
      try { n.src.stop() } catch {}
      try { n.lfoOsc?.stop() } catch {}
    })
    if (ctxRef.current?.state !== 'closed') ctxRef.current?.close()
  }, [])

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      masterRef.current = ctxRef.current.createGain()
      masterRef.current.gain.value = masterVolRef.current / 100
      masterRef.current.connect(ctxRef.current.destination)
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const getBuffer = useCallback((ctx, noiseType) => {
    if (!buffersRef.current[noiseType]) {
      buffersRef.current[noiseType] = genNoise(ctx, noiseType)
    }
    return buffersRef.current[noiseType]
  }, [])

  const toggle = useCallback(id => {
    setSounds(prev => {
      const sound = prev.find(s => s.id === id)
      if (!sound) return prev

      if (sound.active) {
        // Stop
        const nodes = nodesRef.current[id]
        if (nodes) {
          try { nodes.src.stop() }   catch {}
          try { nodes.lfoOsc?.stop() } catch {}
          delete nodesRef.current[id]
        }
        return prev.map(s => s.id === id ? { ...s, active: false } : s)
      } else {
        // Start
        const ctx  = getCtx()
        const def  = DEFS.find(d => d.id === id)
        const buf  = getBuffer(ctx, def.noise)
        nodesRef.current[id] = buildSound(ctx, masterRef.current, def, buf, sound.volume)
        return prev.map(s => s.id === id ? { ...s, active: true } : s)
      }
    })
  }, [getCtx, getBuffer])

  const setVolume = useCallback((id, vol) => {
    setSounds(prev => prev.map(s => s.id === id ? { ...s, volume: vol } : s))
    if (nodesRef.current[id]) {
      nodesRef.current[id].volGain.gain.value = vol / 100
    }
  }, [])

  const setMaster = useCallback(vol => {
    masterVolRef.current = vol
    setMasterState(vol)
    if (masterRef.current) masterRef.current.gain.value = vol / 100
  }, [])

  return { sounds, master, toggle, setVolume, setMaster }
}
