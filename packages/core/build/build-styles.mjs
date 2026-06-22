import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileString } from 'sass'

const currentDir = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(currentDir, '..')
const repoRoot = resolve(pkgRoot, '../..')
const componentsRoot = resolve(pkgRoot, '../components')
const themeRoot = resolve(pkgRoot, '../theme')
const distRoot = resolve(pkgRoot, 'dist')
const themeDist = resolve(distRoot, 'theme')
const esComponentsRoot = resolve(distRoot, 'es/components')
const umdDist = resolve(distRoot, 'umd')

const entryContent = readFileSync(resolve(componentsRoot, 'index.ts'), 'utf-8')
const componentDirs = [...entryContent.matchAll(/export \* from '\.\/(.+)'/g)]
  .map(([, name]) => name)
  .sort((a, b) => a.localeCompare(b))

const styleDirs = readdirSync(componentsRoot, { withFileTypes: true })
  .filter(
    (item) =>
      item.isDirectory() && existsSync(resolve(componentsRoot, item.name, 'style/index.scss'))
  )
  .map((item) => item.name)
  .sort((a, b) => a.localeCompare(b))

function compileScss(file) {
  return compileString(readFileSync(file, 'utf-8'), {
    loadPaths: [repoRoot, themeRoot, componentsRoot],
    style: 'expanded',
  }).css
}

function getComponentStyleFile(componentName) {
  return resolve(componentsRoot, componentName, 'style/index.scss')
}

function getComponentStyleEntry(componentName) {
  return resolve(componentsRoot, componentName, 'style/css.ts')
}

function resolveImportedComponentStyle(componentName, importPath) {
  const importFile = resolve(componentsRoot, componentName, 'style', importPath)
  const componentDir = relative(componentsRoot, importFile).split(/[\\/]/)[0]

  return componentDir
}

function toCssImport(componentName) {
  return builtComponents.has(componentName) ? `import 'moe-cute-ui/theme/${componentName}.css'` : ''
}

function transformStyleEntry(componentName) {
  const sourceEntry = getComponentStyleEntry(componentName)

  if (!existsSync(sourceEntry)) {
    throw new Error(`Missing style entry: ${sourceEntry}`)
  }

  const source = readFileSync(sourceEntry, 'utf-8')

  return source
    .replace(/import ['"]@moe-ui\/theme\/index\.scss['"]/g, "import 'moe-cute-ui/theme/index.css'")
    .replace(/import ['"]\.\/index\.scss['"]/g, () => toCssImport(componentName))
    .replace(/import ['"]([^'"]+\/style\/index\.scss)['"]/g, (_match, importPath) => {
      const importedComponentName = resolveImportedComponentStyle(componentName, importPath)

      return toCssImport(importedComponentName)
    })
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
    .concat('\n')
}

rmSync(themeDist, { recursive: true, force: true })
mkdirSync(themeDist, { recursive: true })

const baseCss = compileScss(resolve(themeRoot, 'index.scss'))
writeFileSync(resolve(themeDist, 'index.css'), baseCss, 'utf-8')

const fullCssParts = [baseCss]
const builtComponents = new Set()

for (const componentName of styleDirs) {
  try {
    const componentCss = compileScss(getComponentStyleFile(componentName))

    if (!componentCss.trim()) continue

    writeFileSync(resolve(themeDist, `${componentName}.css`), componentCss, 'utf-8')
    builtComponents.add(componentName)
    fullCssParts.push(componentCss)
  } catch (error) {
    throw new Error(`Failed to build style for ${componentName}: ${error.message}`, {
      cause: error,
    })
  }
}

for (const componentName of componentDirs) {
  try {
    const styleEntryDir = resolve(esComponentsRoot, componentName, 'style')
    mkdirSync(styleEntryDir, { recursive: true })
    writeFileSync(resolve(styleEntryDir, 'css.mjs'), transformStyleEntry(componentName), 'utf-8')
  } catch (error) {
    throw new Error(`Failed to build style entry for ${componentName}: ${error.message}`, {
      cause: error,
    })
  }
}

const fullCss = `${fullCssParts.join('\n')}\n`
writeFileSync(resolve(distRoot, 'index.css'), fullCss, 'utf-8')

if (
  readdirSync(distRoot, { withFileTypes: true }).some(
    (item) => item.name === 'umd' && item.isDirectory()
  )
) {
  mkdirSync(umdDist, { recursive: true })
  writeFileSync(resolve(umdDist, 'index.css'), fullCss, 'utf-8')
}
