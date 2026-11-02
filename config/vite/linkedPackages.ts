import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

// Mantém os caminhos dos pacotes locais legíveis nos sourcemaps.
export function figmaLinkedPackageSourcemaps(projectRoot: string): Plugin {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(projectRoot, 'package.json'), 'utf8'))
  const linkedPackages = Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }).flatMap((name) => {
    const installedDir = path.resolve(projectRoot, 'node_modules', name)
    try {
      const realDir = fs.realpathSync(installedDir)
      return realDir.split(path.sep).includes('node_modules') ? [] : [{ installedDir, realDir }]
    } catch {
      return []
    }
  })
  const sourceMappingUrl = /\/\/# sourceMappingURL=(\S+)\s*$/

  function installedPath(file: string) {
    const linked = linkedPackages.find(({ realDir }) => file.startsWith(realDir + path.sep))
    return linked && path.join(linked.installedDir, path.relative(linked.realDir, file))
  }
  function readSourceMap(file: string, code: string) {
    const url = sourceMappingUrl.exec(code)?.[1]
    try {
      if (url?.startsWith('data:')) {
        return {
          map: JSON.parse(Buffer.from(url.split(',')[1], 'base64').toString()),
          mapDir: path.dirname(file),
        }
      }
      if (url) {
        const mapFile = path.resolve(path.dirname(file), url)
        return {
          map: JSON.parse(fs.readFileSync(mapFile, 'utf8')),
          mapDir: path.dirname(mapFile),
        }
      }
    } catch {
      // Se o mapa não puder ser lido, usamos as linhas do próprio arquivo abaixo.
    }

    const mappings = code.split('\n').map((_, i) => (i ? 'AACA' : 'AAAA'))
    const map = {
      version: 3,
      sources: [file],
      sourcesContent: [code],
      names: [],
      mappings: mappings.join(';'),
    }
    return { map, mapDir: path.dirname(file) }
  }

  return {
    name: 'figma-linked-package-sourcemaps',
    enforce: 'pre',
    load(id) {
      // Imports com ?raw ou ?url continuam com os carregadores do Vite.
      if (id.includes('?') || !/\.[cm]?[jt]sx?$/.test(id) || !installedPath(id)) return null

      const code = fs.readFileSync(id, 'utf8')
      const { map, mapDir } = readSourceMap(id, code)
      const sourceRoot = path.resolve(mapDir, map.sourceRoot ?? '')
      map.sources = map.sources.map((source: string) => {
        const original = path.resolve(sourceRoot, source)
        return installedPath(original) ?? original
      })
      delete map.sourceRoot
      return { code: code.replace(sourceMappingUrl, ''), map }
    },
  }
}
