const proxyConfig: { [key: string]: string } = {
    "example.com": "http://localhost:3000",
};

Bun.serve({
    port: process.env.PORT || 80,
    async fetch(req) {
        const url = new URL(req.url);
        const host = url.hostname;

        const targetUrl = proxyConfig[host];
        if (!targetUrl) {
            return new Response("Host not configured", { status: 404 });
        }

        const targetURL = new URL(url.pathname + url.search, targetUrl);

        const newRequest = new Request(targetURL, {
            ...req,
            redirect: "manual",
        });

        let res = await fetch(newRequest);
        res.headers.set("server", "BunReverseProxy");
        res.headers.delete("content-encoding");

        return res;
    },
});
