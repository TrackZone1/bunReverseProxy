const proxyConfig: { [key: string]: string } = {
    "example.com": "http://localhost:3000",
};

Bun.serve({
    port: process.env.PORT || 80,
    async fetch(req) {
        if (req.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                },
            });
        }

        const url = new URL(req.url);
        const host = url.host;

        const targetUrl = proxyConfig[host];
        if (!targetUrl) {
            return new Response("Host not configured", { status: 404 });
        }

        const targetURL = new URL(url.pathname + url.search, targetUrl);

        const newRequest = new Request(targetURL, {
            ...req,
            method: req.method,
            headers: req.headers,
            body: await req.blob(),
            redirect: "manual",
        });

        let res = await fetch(newRequest);
        res.headers.set("server", "BunReverseProxy");
        res.headers.delete("content-encoding");
        res.headers.set("Access-Control-Allow-Origin", "*");

        return res;
    },
});
