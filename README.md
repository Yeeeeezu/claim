# claim

decode and inspect JWT tokens. no dependencies, no network, just the token.

```
claim eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwiZXhwIjoxNzAwMDAwMDAwfQ.sig
```
```
  header
    {
      "alg": "HS256",
      "typ": "JWT"
    }

  payload
    {
      "sub": "1234",
      "exp": 1700000000
    }

  ✗ expired  3287291s ago  2023-11-14T22:13:20.000Z
```

## usage

```
claim <token>            decode header + payload
claim decode <token>     same
claim check  <token>     check expiry and timing claims
claim header <token>     header section only
claim payload <token>    payload section only
claim sig <token>        raw signature as hex
```

## install

```
npm install
npm run build
node dist/cli.js <token>
```

or link it globally:
```
npm link
claim eyJ...
```

TypeScript, Node 18+. zero runtime dependencies.
