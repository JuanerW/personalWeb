# personalWeb

Personal website for Zhiyuan Wang, live at **https://juanerw.github.io/personalWeb/**.

---

## Site structure

```
personalWeb/
├── home.html          ← Resume homepage (deployed as site root index.html)
├── index.html         ← Meta-refresh fallback redirect → home.html
├── my-site/           ← React SPA: games & tools playground
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx            ← HashRouter + all routes
│   │   ├── LangContext.jsx    ← React context for EN/ZH
│   │   ├── lang.js            ← All bilingual strings (single source of truth)
│   │   ├── components/
│   │   │   ├── AppCard/       ← Card used on the home grid
│   │   │   └── Navbar/
│   │   ├── pages/
│   │   │   ├── Home/          ← Grid of all games & tools
│   │   │   ├── games/
│   │   │   │   ├── Game2048/
│   │   │   │   └── Snake/
│   │   │   └── tools/
│   │   │       ├── Notepad/
│   │   │       ├── Calendar/
│   │   │       ├── Calculator/
│   │   │       └── Spinner/
│   │   └── styles/
│   │       └── global.css     ← Design tokens + shared body styles
│   └── vite.config.js         ← base: '/personalWeb/my-site/'
├── TBA.io-main/       ← Static HTML task-management app (no build step)
└── .github/
    └── workflows/
        └── deploy.yml ← Builds React, assembles _site/, deploys to Pages
```

### Deployed URLs

| Path | Source |
|------|--------|
| `/personalWeb/` | `home.html` |
| `/personalWeb/my-site/` | `my-site/dist/` (Vite build) |
| `/personalWeb/TBA/` | `TBA.io-main/` (copied as-is) |

---

## Deployment pipeline

Push to `main` → GitHub Actions builds → deploys to GitHub Pages.

The workflow (`deploy.yml`) does three things:
1. Runs `npm ci && npm run build` inside `my-site/`
2. Assembles `_site/`: copies `home.html` → `_site/index.html`, React build → `_site/my-site/`, static folders → `_site/<name>/`
3. Uploads `_site/` as a Pages artifact and deploys

**Settings → Pages → Source must be "GitHub Actions"** (set once, never needs to change).

---

## Language system

Language is stored in `localStorage` under the key `lang` (`'en'` or `'zh'`). Both parts of the site read and write the same key so switching language on one page persists to the other.

### home.html

- `translations` object at bottom of file holds every EN/ZH string
- `applyLang(lang)` sets all element text via `getElementById`
- Add a new translatable element: (1) give it an `id`, (2) add the string to both `en` and `zh` objects, (3) add one `getElementById` line in `applyLang`

### my-site React app

- `lang.js` exports `{ en: {...}, zh: {...} }` — **single file, single source of truth**
- `LangContext.jsx` provides `{ lang, T }` (where `T = t[lang]`) via React context
- Every component reads strings with `const { T } = useLang()`
- `App.jsx` wraps everything in `<LangProvider>`

---

## Design tokens

Defined in `my-site/src/styles/global.css` and mirrored inline in `home.html`:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f4f1ea` | Page background |
| `--bg-card` | `#fbf9f4` | Card surface |
| `--ink` | `#20211c` | Primary text |
| `--ink-soft` | `#54564d` | Secondary text |
| `--ink-faint` | `#8a8b80` | Captions, labels |
| `--accent` | `#1d6b5f` | Teal — links, borders, buttons |
| `--accent-deep` | `#134a41` | Hover state |
| `--line` | `#ddd8cb` | Borders, dividers |
| `--display` | Fraunces | Headings |
| `--body` | Newsreader | Body text |
| `--mono` | JetBrains Mono | Labels, buttons, code |

---

## How to add a new in-app game or tool

### 1. Create the page

```
my-site/src/pages/games/MyGame/
├── MyGame.jsx
└── MyGame.module.css
```

Minimal page structure:
```jsx
import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import styles from './MyGame.module.css'

export default function MyGame() {
  const { T } = useLang()
  return (
    <div className={styles.page}>
      <Link to="/">{T.back}</Link>
      {/* game content */}
    </div>
  )
}
```

### 2. Add a route in App.jsx

```jsx
import MyGame from './pages/games/MyGame/MyGame'

// inside <Routes>:
<Route path="/games/mygame" element={<MyGame />} />
```

### 3. Add strings in lang.js

```js
// in both en.apps and zh.apps:
mygame: { title: 'My Game', desc: 'One-line description.' },
```

### 4. Add a card in Home.jsx

```js
const games = [
  ...
  { key: 'mygame', path: '/games/mygame', emoji: '🎯' },
]
```

### 5. Add a card in home.html

In the `play-grid` div:
```html
<a class="play-card" href="./my-site/#/games/mygame">
  <div class="play-card-icon">🎯</div>
  <div class="play-card-type" id="card-type-game3">Game</div>
  <div class="play-card-title" id="card-title-mygame">My Game</div>
  <div class="play-card-desc" id="card-desc-mygame">One-line description.</div>
</a>
```

Then add to `translations.en` and `translations.zh`, and two `getElementById` lines in `applyLang`.

---

## How to add a new static external project (like TBA)

Static projects are standalone HTML apps that live outside the React SPA.

### 1. Put the project folder at repo root

```
personalWeb/
└── MyProject/
    ├── index.html
    └── ...
```

### 2. Add a copy step in deploy.yml

```yaml
- name: Assemble site
  run: |
    mkdir -p _site/my-site _site/TBA _site/MyProject
    cp home.html _site/index.html
    cp -r my-site/dist/. _site/my-site/
    cp -r TBA.io-main/. _site/TBA/
    cp -r MyProject/. _site/MyProject/   # ← add this
```

### 3. Add a card in Home.jsx

Use `href` instead of `path` — this bypasses React Router and navigates directly:
```js
const tools = [
  ...
  { key: 'myproject', href: '/personalWeb/MyProject/', emoji: '🔧' },
]
```

### 4. Add strings in lang.js and a card in home.html

Same as step 3–5 above, with `href="./MyProject/"` for the `<a>` tag in home.html.

---

## AppCard props

| Prop | Type | Notes |
|------|------|-------|
| `emoji` | string | Shown large at card top |
| `type` | string | Small uppercase label (`T.games` or `T.tools`) |
| `title` | string | Card heading (Fraunces font) |
| `description` | string | Body text |
| `path` | string | React Router path — use for in-app pages |
| `href` | string | Plain `<a>` href — use for external/static pages |

Providing `href` takes priority over `path`.
