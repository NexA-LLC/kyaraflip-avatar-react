Original prompt: はい ,kyaraflipにライブカードを使うシューティングとか入れてこうよ. シューティングつくってたよね、 なんか良い感じに動くところまであると嬉しいな. キャラクターが上向きでシューティングのキャラみたいになる画像変換ロジックも欲しいわね

## Progress

- Added a plan to implement an exportable React mini-game in `kyaraflip-avatar-react` rather than a standalone app.
- Target components:
  - `LiveCardShip`: transforms an avatar/live-card identity into an upward shooter ship.
  - `LiveCardShooter`: playable vertical shooter using live-card-style ships.
- Implemented `LiveCardShip`, `renderLiveCardShipParts`, and `LiveCardShooter`.
- Added `examples/live-card-shooter.html` as a browser fixture backed by the package build.
- Verification:
  - `pnpm run check` passed.
  - `pnpm run build` passed and refreshed committed `dist/`.
  - Opened `examples/live-card-shooter.html` via local HTTP server and Playwright MCP.
  - Verified `window.render_game_to_text()` reports playing/gameOver state, bullets, enemies, score, and lives.
  - Verified deterministic stepping with `window.advanceTime(ms)` and confirmed a hit path reaches `score: 100`.
- Follow-up correction:
  - Added explicit live-card surface details to `LiveCardShip`: card frame, LC badge, rarity, element, serial, foil stripe, and name band.
  - Added `liveCard: true` to enemy text state and a `LIVE CARD RAID` HUD label.
- Follow-up correction 2:
  - Removed cat/dog avatar artwork from the Live Card ship face.
  - Added `imageUrl` support for real Live Card images and deterministic non-avatar fallback artwork for demos.
  - Added `playerCard` and `enemyCards` props so the shooter can receive actual Artifact/Live Card records.

## Follow-ups

- Tune enemy patterns, bullet visuals, and hit feedback once this is wired into the larger KyaraFlip app.
- Add a package-level automated browser test if this repo grows a persistent demo/test harness.
