const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORTA = process.env.PORT ?? 4735;

const inicio = fs.readFileSync(path.join(__dirname, "public", "index.html"), "utf-8");

const servidor = http.createServer((request, response) => {
	const { method, url } = request;
	if (method == "GET") {
		if (url == "/") {
			response.writeHead(200, {
				"www-authenticate": "molas do ártico",
			});
			response.end(inicio);
		} else {
			const urlObject = new URL(
				new URL(
					`http://${process.env.HOST ?? "localhost"}${
						process.env.NODE_ENV?.toLowerCase() == "production" ? "" : ":" + PORTA
					}${url}`
				)
			);
			response.end(urlObject.href);
		}
	} else {
		response.statusCode = 404;
		response.sendDate();
		response.end("erro Desconhecido");
	}
});

servidor.listen(PORTA, () => console.log(`Listening <${new Date().toLocaleTimeString()}>`));
