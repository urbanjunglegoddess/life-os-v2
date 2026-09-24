# Life OS

A multi-tenant, mobile-first personal life OS. Expo SDK 57, Expo Router, NativeWind,
Supabase. See `docs/BUILD-SPEC.md` for the slice one spec and `CLAUDE.md` for the
rules that govern changes here.

## Running it

```bash
npm install
cp env.example .env      # Windows: copy env.example .env
npm start
```

Scan the QR code with the iPhone Camera app to open in Expo Go, or press `a` for an
Android emulator.

### "Could not connect to development server"

Metro serves the bundle over your local network, so the phone has to be able to reach
the computer. It often cannot — a phone hotspot, a guest network, or a firewall will
each break it, and the error looks identical in every case.

```bash
npm run start:tunnel
```

That relays through a public tunnel instead of the local network, so none of it
matters. Reloads are slower; it works anywhere. Expo installs `@expo/ngrok` the first
time you run it.

To fix the LAN properly instead, on Windows: Settings → Network & Internet → the
active connection → set the profile to **Private** (Defender blocks inbound on
**Public**, which is what a hotspot gets classified as), or allow Node.js through
Defender Firewall on public networks.

### What does not work in Expo Go

**The journal's biometric gate.** It needs the Face ID usage string that
`app.config.ts` installs through a config plugin, and config plugins do not apply in
Expo Go. Everything else — sign-in, Capture, Today, Settings — runs there. The gate
needs a development build:

```bash
eas build --profile development --platform ios
```

which signs for a physical iPhone and so needs a paid Apple Developer account. EAS
builds in the cloud, so no Mac is required at any point.

## Checks

```bash
npm test         # unit tests
npm run typecheck
npm run lint
```

## Environment

`env.example` documents every variable and is the file to copy. `src/lib/env.ts`
validates them with Zod at import and **throws at startup** if the Supabase variables
are missing — a deliberate loud failure, since the alternative is a client that
constructs fine and then 401s on every call with nothing pointing at the cause.

Only the **publishable** Supabase key belongs in anything the bundle can reach. The
service-role key must never appear in `.env`, in an EAS secret exposed to the bundle,
or anywhere else a React Native bundle can be unpacked to find it — `env.ts` throws if
it detects one in the publishable slot.
