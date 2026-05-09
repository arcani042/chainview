# Arc Starter App 🔷

Your first dApp on Arc Testnet — built with React + TypeScript.

---

## What This App Does

- ✅ Connects to MetaMask
- ✅ Auto-adds Arc Testnet to MetaMask if not there
- ✅ Shows your USDC balance
- ✅ Swap / Bridge / Send tabs (powered by Circle App Kit)
- ✅ Links to faucet, explorer, docs

---

## Step 1 — Install Node.js (if you haven't)

1. Go to https://nodejs.org
2. Download the **LTS version** (the green button)
3. Install it — just keep clicking Next
4. To confirm it worked, open Terminal (Mac) or Command Prompt (Windows) and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x`

---

## Step 2 — Open This Project

If you downloaded this as a zip:
1. Unzip it somewhere easy (e.g. your Desktop)
2. Open Terminal / Command Prompt
3. Navigate to the folder:
   ```bash
   cd Desktop/arc-app
   ```

---

## Step 3 — Install Dependencies

This downloads all the packages the app needs:

```bash
npm install
```

Wait for it to finish (may take 1–2 minutes).

---

## Step 4 — Install the Circle App Kit

This is the magic SDK that gives you Swap, Bridge, and Send:

```bash
npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 viem
```

---

## Step 5 — Run the App

```bash
npm run dev
```

Open your browser and go to: **http://localhost:5173**

You should see the Arc Starter App! 🎉

---

## Step 6 — Connect Your Wallet

1. Click **"Connect Wallet"** in the top right
2. MetaMask will pop up — click **Connect**
3. If asked to switch network, click **Approve** / **Switch**
4. Arc Testnet will be added to MetaMask automatically

---

## Step 7 — Get Free Test USDC

Your balance will show 0.00 at first. Get free test tokens:

1. Go to https://faucet.circle.com
2. Connect your wallet
3. Select **Arc Testnet**
4. Request USDC and/or EURC (free!)
5. Come back to the app and click the **↻ refresh** button

---

## Step 8 — Use the App Kit Widgets

The Swap / Bridge / Send tabs use Circle's App Kit SDK.

To fully activate them, you need an **App Kit API key**:

1. Go to https://developers.circle.com
2. Create a free account
3. Create a new project → get your API key
4. Follow the quickstart at https://docs.arc.network/app-kit

Until then, the tabs show you exactly what to do next.

---

## Project Structure

```
arc-app/
├── src/
│   ├── main.tsx              ← Entry point (don't touch)
│   ├── App.tsx               ← Main app layout
│   ├── index.css             ← Global styles
│   ├── arc.config.ts         ← Arc Testnet settings
│   ├── hooks/
│   │   └── useWallet.ts      ← MetaMask connection logic
│   └── components/
│       ├── Header.tsx        ← Top bar with wallet button
│       ├── BalanceCard.tsx   ← Shows USDC balance
│       ├── AppKitWidget.tsx  ← Swap/Bridge/Send tabs
│       └── InfoPanel.tsx     ← Resource links
├── index.html
├── package.json
├── vite.config.ts
└── README.md  ← You are here!
```

---

## Arc Testnet Details

| Setting       | Value                                |
|---------------|--------------------------------------|
| Network Name  | Arc Testnet                          |
| RPC URL       | https://rpc.testnet.arc.network      |
| Chain ID      | 5042002                              |
| Currency      | USDC                                 |
| Explorer      | https://testnet.arcscan.app          |

---

## Useful Links

- 📖 Docs: https://docs.arc.network
- 🚰 Faucet: https://faucet.circle.com
- 🔍 Explorer: https://testnet.arcscan.app
- 💬 Community: https://community.arc.network
- 📦 App Kit: https://docs.arc.network/app-kit
- 💰 Builders Fund: https://circle.com/blog/introducing-the-arc-builders-fund

---

## Troubleshooting

**"MetaMask not found"**
→ Install MetaMask from https://metamask.io/download

**Balance shows 0.00**
→ Get test USDC from https://faucet.circle.com

**Wrong network error**
→ Click the network name in MetaMask and switch to Arc Testnet

**npm install fails**
→ Make sure Node.js is installed (Step 1 above)

---

Built with ❤️ for Arc Testnet
