#!/usr/bin/env node
import { decode, sigBytes } from './decode.js'

const R  = '\x1b[0m'
const B  = '\x1b[1m'
const D  = '\x1b[2m'
const GR = '\x1b[32m'
const RE = '\x1b[31m'
const CY = '\x1b[36m'
const YE = '\x1b[33m'

function pretty(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, null, 2)
    .replace(/"([^"]+)":/g, `${CY}"$1"${R}:`)
    .replace(/: "([^"]+)"/g,  `: ${GR}"$1"${R}`)
    .replace(/: (-?\d+(?:\.\d+)?)/g, `: ${YE}$1${R}`)
    .replace(/: (true|false|null)/g,  `: ${YE}$1${R}`)
}

function indent(s: string, n = 4): string {
  return s.split('\n').map(l => ' '.repeat(n) + l).join('\n')
}

function expiry(payload: Record<string, unknown>) {
  const now = Math.floor(Date.now() / 1000)
  if (typeof payload['exp'] === 'number') {
    const diff = (payload['exp'] as number) - now
    const date = new Date((payload['exp'] as number) * 1000).toISOString()
    if (diff < 0)
      console.log(`  ${RE}✗ expired${R}  ${D}${Math.abs(diff)}s ago  ${date}${R}`)
    else
      console.log(`  ${GR}✓ valid${R}    ${D}expires in ${diff}s  ${date}${R}`)
  }
  if (typeof payload['nbf'] === 'number' && (payload['nbf'] as number) > now)
    console.log(`  ${RE}✗ not valid yet${R}  ${D}nbf: ${new Date((payload['nbf'] as number)*1000).toISOString()}${R}`)
  if (typeof payload['iat'] === 'number')
    console.log(`  ${D}issued ${new Date((payload['iat'] as number)*1000).toISOString()}${R}`)
}

const argv = process.argv.slice(2)

function getToken(): string | undefined {
  const sub = ['decode','check','header','payload','sig']
  if (argv.length === 0) return undefined
  if (sub.includes(argv[0])) return argv[1]
  return argv[0]
}

const sub   = ['decode','check','header','payload','sig'].includes(argv[0]) ? argv[0] : 'decode'
const token = getToken()

if (!token || argv[0] === '--help' || argv[0] === '-h') {
  console.log(`
  claim — JWT decoder

  usage:
    claim <token>            decode header + payload
    claim decode <token>     same
    claim check  <token>     check expiry and timing claims
    claim header <token>     header only
    claim payload <token>    payload only
    claim sig <token>        raw signature as hex

  examples:
    claim eyJhbGc...
    claim check eyJhbGc...
`)
  process.exit(0)
}

try {
  const { header, payload, sig } = decode(token)

  if (sub === 'header')  { console.log(pretty(header));  process.exit(0) }
  if (sub === 'payload') { console.log(pretty(payload)); process.exit(0) }
  if (sub === 'sig')     { console.log(sigBytes(sig).toString('hex')); process.exit(0) }

  console.log()
  console.log(`  ${B}header${R}`)
  console.log(indent(pretty(header)))
  console.log()
  console.log(`  ${B}payload${R}`)
  console.log(indent(pretty(payload)))
  console.log()
  expiry(payload)
  console.log()
} catch (e: any) {
  console.error(`  ${RE}error:${R} ${e.message}`)
  process.exit(1)
}
