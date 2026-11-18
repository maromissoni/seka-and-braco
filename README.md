# Seka & Braco: A Slavonian Escape

A two-player co-op puzzle platformer for **one keyboard**. Seka and her brother Braco work together through **100 levels** set in Osijek and Slavonia.

- **Part 1 (levels 1–50):** the red-brick old town, the tram lines, the Drava riverfront, the golden fields and the fiš festival.
- **Part 2 (levels 51–100, a bit harder):** Tvrđa by night, Advent in Osijek, the marshes of Kopački rit, the Baranja vineyards, and a Pannonian finale.

It is a plain web page (HTML, CSS and JavaScript), so it runs in any modern desktop browser and can be hosted on **GitHub Pages for free**. There is no build step, server, account or API key.

---

## Play it on your own computer (no internet needed)

1. Download or copy this whole folder.
2. Double-click `index.html`. It opens in your browser and you can play.

> If your browser opens it but saving doesn't work, that's a local-file restriction in some browsers. The GitHub Pages version below always saves normally.

## Put it online with GitHub Pages (free)

You only need a free GitHub account.

1. **Create a repository**
   - Sign in at [github.com](https://github.com) and click **+** (top right), then **New repository**.
   - Name it, for example `seka-and-braco`.
   - Make it **Public**. Free GitHub Pages needs a public repository.
   - Click **Create repository**.
2. **Upload the files**
   - On the new repository page, click **uploading an existing file**. You can also use **Add file → Upload files**.
   - Drag in everything from this folder: `index.html`, `README.md`, `LEVELS.md`, `ART_GUIDE.md`, `.nojekyll`, and the `css`, `js`, `assets` and `tools` folders.
     - Dragging the folders themselves keeps their structure.
     - Files starting with a dot (like `.nojekyll`) may be hidden on your computer. The game works without it.
   - Click **Commit changes**.
3. **Turn on Pages**
   - In the repository, open **Settings**, then **Pages** (left sidebar).
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Under **Branch**, choose `main` and the `/ (root)` folder, then click **Save**.
4. **Open the game**
   - Wait a minute or two, then refresh the Pages settings page.
   - It shows your link, for example `https://YOUR-USERNAME.github.io/seka-and-braco/`.
   - Open it and share it with the players.

All paths in the game are relative, so it works inside the `/seka-and-braco/` sub-folder that GitHub Pages uses.

### Updating the game later

- **Change a file:** open it on GitHub, click the ✏️ pencil, edit, then **Commit changes**.
- **Replace files:** use **Add file → Upload files** again. Files with the same name are replaced.
- The live site updates about a minute later. If you still see the old version, do a hard refresh (Ctrl+Shift+R, or Cmd+Shift+R on Mac).
- Players' saved progress is kept when you update. It is stored in their browser, not in the files.

---

## Controls

| | Seka (player 1) | Braco (player 2) |
|---|---|---|
| Move | **A** / **D** | **←** / **→** |
| Jump (hold to jump higher; Seka: hold in the air to glide) | **W** | **↑** |
| Use a lever | **S** | **↓** |

**Esc** or **P** pauses, **R** restarts the level, and **H** shows a hint. In menus, use the mouse or the arrow keys, Enter and Esc.

All player keys can be changed in **Settings → Controls**. Click a key, then press the new one. If a key is already used, the two swap.

### Keyboard ghosting
Many keyboards can't register more than a few keys at the same moment, especially letter keys combined with the arrow keys. If a jump sometimes "doesn't work" while both players are holding keys, that's the keyboard hardware, not the game.

To fix it, remap one player to keys further apart. For example, give Braco **J / L / I / K**.

## Wardrobe

Open **Wardrobe** from the title menu or the pause menu to choose an outfit for each character. There are 10 outfits each:

- **Seka:** Classic Black, Red Dress, Šokačka Folk, Ball Gown, Tuxedo, Sunflower Sundress, Winter Coat, Tracksuit, Festival Chef, Denim Day.
- **Braco:** Classic Vest, Tuxedo, Slavonian Folk, Navy Suit, Holiday Shirt, Festival Chef, Lumberjack, Drava Fisherman, Cosy Hoodie, Football Kit.

Outfits only change how the characters look, never what they can do. The choice is saved with your progress.

## What each character can do

- **Seka** jumps higher (3 blocks) and glides with her paprika parasol (hold jump while falling). She can also walk on the red embroidered ribbon bridges.
- **Braco** pushes crates, smashes cracked walls by walking into them, and is heavy enough for **kg** plates.
- **Both** can stand on each other's heads, press plates, ring bells and pull levers.
- Every switch and the gate, lift or bridge it controls share a **colour and a shape**. A crossed symbol marks a bridge that appears while it is powered.
- Stew, river water and spikes send you back to the start of the level instantly. There are no lives and no clock to beat (bell timers only hold doors open for a few seconds).

## Saving

- Progress saves automatically: unlocked levels, completed levels, treats found and settings. It saves when a level is finished and whenever a setting changes.
- Saves live in **this browser on this device only**. They do not sync to other browsers, computers or phones.
  - Private/incognito windows forget everything when closed. The game shows a notice when it can't save.
  - Clearing browser data for the site erases the save.
- **Moving a save:** open **Backup** to copy a code (or download it as a file). Paste the code into **Backup → Restore** on the other browser.
- **Damaged save:** if the save is damaged, the game repairs what it can. If nothing can be read, it starts fresh, keeps a copy of the damaged data, and tells you.
- **Starting over:**
  - **New Game** starts from level 1 but keeps what you've unlocked.
  - **Settings → Reset progress** erases progress after asking you to confirm. Names, keys and sound settings are kept.

## Files

| File | What it is |
|---|---|
| `index.html` | The page that loads everything |
| `css/style.css` | Menu styles |
| `js/engine.js` | Physics and puzzle logic (no drawing, so it also runs in Node for testing) |
| `js/levels.js`, `js/levels-ch1.js` … `levels-ch10.js` | The 100 levels, as text maps plus objects |
| `js/outfits.js` | The 20 Wardrobe outfits (colours and pieces; drawn by `render.js`) |
| `js/render.js` | All the art, drawn in code (no image files) |
| `js/audio.js` | Synthesised sound effects and music |
| `js/input.js` | Keyboard handling and remapping |
| `js/save.js` | Saving, validation and backups |
| `js/ui.js` | Menus and the game loop |
| `tools/verify.js` | Plays every level automatically to prove it can be solved |
| `tools/solutions2.js` | Scripted solutions for levels 51–100 (generated) |
| `tools/part2/` | Python sources for levels 51–100; `python3 tools/part2/build.py` rebuilds `levels-ch6.js` … `levels-ch10.js` and `solutions2.js` |
| `LEVELS.md` | The idea and mechanics of every level |
| `ART_GUIDE.md` | Palette, character and style rules |

## Checking the levels (optional, for tinkerers)

If you have [Node.js](https://nodejs.org) installed:

```bash
node tools/verify.js
```

It plays all 100 levels with scripted moves using the real game physics. It prints `PASS` when both characters reach the exit with all 3 treats. `node tools/verify.js 12 13` checks only levels 12 and 13, and adding `--trace` shows each step.

Levels 51–100 are written in `tools/part2/ch6.py` … `ch10.py`; after editing one, run `python3 tools/part2/build.py` first. If you edit a level's map or objects, run the checker again so you know the level is still solvable. After editing names or ideas, regenerate the level list with `node tools/make-levels-md.js`.

## Credits

An original game made as a gift. Characters, art, levels, sounds and music were all created for this project. The menu font is [Fredoka](https://fonts.google.com/specimen/Fredoka) (SIL Open Font License), loaded from Google Fonts. Without internet, a system font is used instead.
