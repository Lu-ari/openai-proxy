const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", (req, res, next) => {
  const targetUrl = req.url.slice(1);

  if (!targetUrl.startsWith("http")) {
    return res.status(400).send("Lütfen geçerli bir URL girin.");
  }

  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/": "",
    },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", targetUrl);
    },
  });

  return proxy(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Proxy sunucusu ${port} portunda çalışıyor.');
});
