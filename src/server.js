import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'node:path'
import http from 'node:http'
import open from 'open'

export const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
}

export const formatNots = notes => {
    return notes.map(note => {
        return `
        <div class="notes">
            <p>${note.content}</p>
            <div class="tags">
                 ${note.tags.map(tag => `<span class="tag">Tags : • ${tag}</span>`).join('') }
            </div>
        </div>`
    }).join('\n')
}

export const createServer = (notes) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    return http.createServer(async (req, res) => {
        const HTML_PATH = resolve(__dirname, '.',  'template.html')
        const template = await fs.readFile(HTML_PATH, 'utf-8');
        const html = interpolate(template, {notes : formatNots(notes)});

        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html)
    })
}

export const start = (notes, port) => {
    const server = createServer(notes);
    server.listen(port, () => {
        const address = `http//localhost:${port}`
        console.log(`listening on port ${address}`)

        open(`http://localhost:${port}`)
    })
}