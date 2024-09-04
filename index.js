import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import mime from "mime";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __public = path.join(__dirname, "public");
const PORTA = process.env.PORT ?? 4735;

const servidor = http.createServer((request, response) => {
	const { method, url } = request;
	if (method == "GET") {
		if (url == "/") {
			const caminho = path.join(__public, "index.html");
			const inicio = fs.readFileSync(caminho, "utf-8");
			response.writeHead(200, {
				"content-type": mime.getType(caminho),
				"www-authenticate": "molas do ártico",
			});
			response.end(inicio);
		} else if (url.startsWith("/imagens/")) {
			const arquivo = url.split("/imagens/")[1];
			const caminho = path.join(__public, "imagens", arquivo);
			if (arquivo.indexOf("/") > -1 || !fs.existsSync(caminho)) {
				response.statusCode = 404;
				return response.end("arquivo Não encontrado");
			}
			const imagem = fs.readFileSync(caminho);
			response.writeHead(200, { "content-type": mime.getType(arquivo) });
			response.end(imagem);
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
