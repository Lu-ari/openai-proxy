const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const url = require("url");

const app = express();
app.use(morgan("dev")); // İstekleri loglamak için

app.use("/", (req, res, next) => {
  const parsedUrl = url.parse(req.url.slice(1));
  const target = ${parsedUrl.protocol}//${parsedUrl.host};

  if (!/^https?:$/.test(parsedUrl.protocol)) {
    return res.status(400).send("Lütfen geçerli bir URL girin.");
  }

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: true,
    pathRewrite: (path, req) => {
      const pathname = parsedUrl.pathname || "/";
      const search = parsedUrl.search || "";
      return pathname + search;
    },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", target);
    },
    onError: (err, req, res) => {
      console.error("Proxy hatası:", err);
      res.status(500).send("Proxy sunucusunda bir hata oluştu.");
    },
  });

  return proxy(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Proxy sunucusu ${port} portunda çalışıyor.');
});
