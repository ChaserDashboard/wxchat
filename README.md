# WxChat — Internet / Cloud Edition

Real-time weather operations chat for spotters, chasers, forecasters, and coordinators.
Runs on Railway (free) — everyone connects over the internet, no shared network needed.

---

## Deploy to Railway (one-time, ~5 minutes)

### Step 1 — Put the files on GitHub
1. Go to https://github.com and sign in (or create a free account)
2. Click the **+** button (top right) → **New repository**
3. Name it `wxchat`, set it to **Public**, click **Create repository**
4. On the next page, click **uploading an existing file**
5. Drag ALL the files from this zip into the upload area:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - the entire `public/` folder (drag the folder itself)
6. Click **Commit changes**

### Step 2 — Deploy on Railway
1. Go to https://railway.app and click **Start a New Project**
2. Sign in with your GitHub account
3. Click **Deploy from GitHub repo**
4. Select your `wxchat` repository
5. Railway will detect it automatically and start deploying — takes about 60 seconds
6. Once deployed, click **Settings** → **Networking** → **Generate Domain**
7. You'll get a URL like `wxchat-production-abc1.up.railway.app`

### Step 3 — Share with your team
Send everyone that URL. They open it in any browser, enter their callsign and role, and they're in.

---

## Features
- Real-time chat with role color-coding (Spotter, Chaser, NWS, Coordinator, Ham, Observer)
- UTC clock in topbar
- Storm Reports — submit with type, location, magnitude, notes
- Alerts panel with active warnings/watches
- Online users list
- Message history for late joiners
- Duplicate callsign protection

---

## Cost
Railway's free tier covers small teams easily. No credit card required.
If you ever exceed the free tier limits, the Hobby plan is $5/month.

---

WxChat v1.0 · Cloud Edition
