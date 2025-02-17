# bunreverseproxy

To install dependencies:

```bash
bun install
```

To configure the proxy, modify the `proxyConfig` object:

```typescript
const proxyConfig: { [key: string]: string } = {
    "example.com": "http://localhost:3000",
};
```

To run:

```bash
bun run .
```

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
