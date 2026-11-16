# Midnight Dream Catcher — Desktop Companion

A Manifest V3 Chrome extension that brings The Midnight Dream Catcher to the desktop as a pitch-black side panel.

- **📝 Dream Log:** jot down dream fragments during the day, saved locally with timestamps. You can export them as JSON, copy them all, or send them to the main app.
- **🔮 Symbols:** highlight any word on a web page, right-click, and choose **Interpret '…' in Midnight Dream Catcher**. The side panel opens and decodes the symbol through a Jungian, Biblical, Islamic, Emotional or Creative lens. It uses your own OpenAI or Anthropic key if you add one, and otherwise the built-in offline symbol guide.
- **🎧 Vault:** four ambient soundscapes generated on your computer, with a sleep fade-out timer, plus playback of the frames, videos and narrated dream videos in your Cloud Room.
- **⚙️ Settings drawer:** optional AI keys, an optional Pro sign-in, the address of the full web app, and a button to delete all stored data.

## Install for testing

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose this folder.
3. Pin the extension and click the crescent icon to open the side panel.
4. The app address is already set to `https://dreamcatcherapp.co.uk`. You can change it in ⚙️.

Requires Chrome 116 or later.

## Design

Colours, fonts, buttons, inputs, cards, tabs and lens pills are copied from the web app's `index.html`: `#000` background, amber `#d97706` body text, `#fbbf24` emphasis, `#8a4b06` secondary text, `#2e1a02` borders and the system font stack. The five lenses use the app's names and order: ✝︎ Biblical, 🧠 Jungian, 💭 Waking Life, 🎬 Story Spark and 🕌 Islamic / Hadith.

## Files

| File                              | Purpose                                                                                                                                                                                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manifest.json`                   | MV3 manifest. Permissions: `sidePanel`, `contextMenus`, `storage`. No host permissions and no content scripts.                                                                                                                                                         |
| `background.js`                   | Opens the panel when you click the toolbar icon, and adds the right-click menu (`decode-dream-symbol`). On a click it writes `{ pendingSymbol, sourceUrl, capturedAt }` to `chrome.storage.local` and opens the panel, which decodes the symbol and clears those keys. |
| `sidepanel.html` / `.css` / `.js` | The three tabs and the settings drawer.                                                                                                                                                                                                                                |
| `symbols.js`                      | The offline symbol guide (about 30 symbols, each with notes for all five lenses).                                                                                                                                                                                      |
| `icons/`                          | Made from the app's `app-icon.png`: 16 and 48 px are cropped to the moon so they stay readable in the toolbar; 128 px is the full dream catcher.                                                                                                                       |

## How it connects to the web app

- **Cloud Room:** the panel calls `POST {WORKER}/room` with `{ deviceId, email?, token? }` and plays files from `GET {WORKER}/media/<key>`. The extension has its own device ID, so **your phone's files only appear after you sign in with your Pro email and DRM- token.** The reply is the same one the app's Cloud Room reads: `{ items: [{ url, kind, createdAt, dreamId, text }] }`, where `kind` is `image`, `video`, `story` (video + voice) or `audio`. The tiles use the app's own labels (🖼️ Frame, 🎬 Video, 🔊 Video + voice, 🎙️ Narration).
- **CORS:** the extension has no host permissions, so it relies on the Worker's `Access-Control-Allow-Origin: *`, which `worker.js` already sends on every route. Keep it that way, or add `chrome-extension://<your-extension-id>` if you ever restrict it.
- **Pro sign-in:** saving an email and token in ⚙️ checks them with `POST /status` and shows the credits left. `/room` replies `{ items, account }`, and the panel warns when `account` is false.
- **Send to App:** this copies the unsent fragments to the clipboard and opens the app at `#companion-import=<base64url JSON>`. The data stays in the URL hash, which is never sent to any server. The app's `index.html` reads it, opens a ➕ New Dream Entry already filled in (with a date line per fragment when there are several), saves it, and removes the hash from the address. The usual trial lock still applies, and its "Write this dream without AI" option also receives the text.

## Chrome Web Store notes

- **Single purpose:** a desktop companion for the Midnight Dream Catcher dream journal, for logging dreams, interpreting dream symbols and playing your dream media.
- **Permission justifications:**
  - `sidePanel`: the whole interface lives in Chrome's side panel.
  - `contextMenus`: adds one right-click item that sends text you have highlighted to the symbol interpreter.
  - `storage`: saves your dream fragments, decode history and settings on your computer.
- **Remote code:** none. All scripts are bundled. The network requests are calls to APIs (the user's chosen AI provider and the Midnight Dream Catcher Worker), not code downloads.
- **Page address:** the right-click handler reads `info.pageUrl`, which Chrome provides for every context-menu click, so no `tabs` permission is needed. It is kept only on the device.
- **Data disclosure:** in the privacy form, declare "Personal communications / user-generated content" (dream text) and "Authentication information" (an optional Pro token and API keys, kept locally). Data is not sold or transferred for unrelated purposes.

---

## Privacy Policy

_Last updated: 16 November 2026_

The Midnight Dream Catcher — Desktop Companion ("the extension") is built to keep your dreams private. This policy explains what the extension handles and where that data goes.

**What is stored on your computer.** The extension saves your dream fragments, your recent symbol interpretations, and your settings in Chrome's local extension storage on your own device. Settings include the app address, an optional Pro email and token, and optional AI provider keys. This data is not synced to your Google account and is not sent to us. You can delete all of it at any time from ⚙️ Settings → "Delete everything stored by this extension", or by removing the extension.

**Text you choose to interpret.** When you highlight text and choose "Interpret in Midnight Dream Catcher", that text, and the address of the page you highlighted it on, are passed to the extension's side panel only. The page's site name is kept in your local decode history (the last 20 decodes) so you can see where a symbol came from; it is never sent anywhere. The extension cannot read web pages and does not collect browsing history; it only receives text you explicitly select and send through the right-click menu.

**AI providers (optional).** If you add your own OpenAI or Anthropic API key and choose that provider, the symbol or fragment you ask to interpret is sent directly from your browser to that provider to generate a reading. Their own privacy policies govern that processing. If you add no key, interpretation happens entirely offline on your computer.

**Midnight Dream Catcher cloud room (optional).** When you choose "Load My Cloud Room", the extension sends a random device identifier, and your Pro email and token if you have entered them, to the Midnight Dream Catcher server (a Cloudflare Worker) to list your saved media. Media you play is then streamed from that server. The extension never uploads your dream log or interpretations there.

**Sending fragments to the web app.** "Send to App" copies your fragments to your clipboard and opens the Midnight Dream Catcher web app with the fragments in the page address's fragment (after the `#`), which browsers do not send to servers.

**What we do not do.** The extension has no analytics, advertising or tracking. It does not sell or share your data, and it does not use your data for creditworthiness, lending or any purpose unrelated to the extension's single purpose.

**Children.** The extension is not directed at children under 13.

**Changes.** If this policy changes, the updated version will be published with a new "Last updated" date.

**Contact.** For questions about this policy, contact: _[your support email]_.
