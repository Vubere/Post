import express, { Express } from "express";
import { logger, addRequestTime } from "./utils/middlewares";
import morgan from "morgan";

const app: Express = express();
app.use(express.json());
app.use(logger);
app.use(addRequestTime);
app.use(morgan("dev"));
//static files can't be defaultly accessed by the browser in nodejs, we need the express.static() middleware, it takes the path where the public files can be found, the public path won't need to be added in the url
app.use(express.static("./public"));

export default app;

/* 
vanilla node.js implementation of server
const server = http.createServer((req, res) => {
  const url = URL.parse(req.url);
  const path = url.pathname;
  if (path === "/" || path === "/home") {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "access-control-allow-origin": "*",
    });
    res.end("home");
  } else if (path === "/html-page") {
    const json_text = fs.readFileSync("./files/products.json", "utf-8");
    const file = fs.readFileSync("./files/index.html", "utf-8");
    const array = JSON.parse(json_text);
    const products = array.map((item) => item.here);
    res.writeHead(200, {
      "Content-Type": "text/html",
      "access-control-allow-origin": "*",
    });
    res.end(replaceHTML(file, products));
  } else if (path === "/json") {
    const json_text = fs.readFileSync("./files/products.json", "utf-8");
    res.writeHead(200, {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
    });
    res.end(json_text);
  } else if (path === "/stream") {
    const rs = fs.createReadStream("./files/products.json", "utf-8");
    rs.on("data", (chunk) => {
      if (res.writable) res.write(chunk);
    });
    res.on("end", () => res.end);
    res.on("error", () => res.end("an error occured"));

    //shorter way to do this is:
    //rs.pipe(res)
    //
  } else {
    res.end("page not found");
  }
});

server.listen(port, "localhost", () => {
  console.log("server started");
});
 */
