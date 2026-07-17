#!/usr/bin/env node
// Every internal link must resolve to a page that exists. Mintlify does not fail a build on a dead
// internal link, it just serves a 404, so this is the only thing standing between us and a docs
// site that quietly links into nowhere.
// Usage: node scripts/check-links.js
const fs = require("node:fs")
const path = require("node:path")

const root = path.join(__dirname, "..")

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith(".mdx")) out.push(full)
  }
  return out
}

const files = walk(root)
const pages = new Set(files.map((f) => "/" + path.relative(root, f).replace(/\.mdx$/, "")))
// index.mdx also answers at /
pages.add("/index")
pages.add("/")

// Static assets that links may point at.
const assets = new Set()
for (const dir of ["logos", "images"]) {
  const d = path.join(root, dir)
  if (!fs.existsSync(d)) continue
  for (const f of fs.readdirSync(d)) assets.add(`/${dir}/${f}`)
}

const LINK = /\]\(([^)]+)\)|href="([^"]+)"|icon="(\/[^"]+)"/g

let broken = 0
let checked = 0
for (const file of files) {
  const src = fs.readFileSync(file, "utf8")
  const rel = path.relative(root, file)
  for (const m of src.matchAll(LINK)) {
    const raw = (m[1] ?? m[2] ?? m[3] ?? "").trim()
    if (!raw) continue
    if (/^(https?:|mailto:|#)/.test(raw)) continue
    if (!raw.startsWith("/")) continue
    checked++
    const target = raw.split("#")[0].split("?")[0].replace(/\/$/, "") || "/"
    if (pages.has(target) || assets.has(target)) continue
    // API endpoint pages are real files, already covered by `pages`.
    console.log(`✗ ${rel} links to ${target} which does not exist`)
    broken++
  }
}

// Every page should be reachable from the nav, or it is orphaned.
const config = JSON.parse(fs.readFileSync(path.join(root, "docs.json"), "utf8"))
const inNav = new Set()
// Only strings inside a `pages` array are page refs. Group names and icons are not.
const collect = (node) => {
  if (Array.isArray(node)) return node.forEach(collect)
  if (!node || typeof node !== "object") return
  for (const [key, value] of Object.entries(node)) {
    if (key === "pages" && Array.isArray(value)) {
      for (const entry of value) {
        if (typeof entry === "string") inNav.add("/" + entry)
        else collect(entry)
      }
      continue
    }
    if (typeof value === "object") collect(value)
  }
}
collect(config.navigation)

const orphans = [...pages].filter(
  (p) => p !== "/" && !inNav.has(p) && !p.startsWith("/api/endpoints"),
)
for (const o of orphans) {
  console.log(`⚠ ${o}.mdx exists but is not in docs.json navigation`)
}

// A nav entry pointing at a missing file breaks the build.
for (const navPage of inNav) {
  if (!pages.has(navPage)) {
    console.log(`✗ docs.json navigation lists ${navPage} but there is no such page`)
    broken++
  }
}

console.log(
  `\nchecked ${checked} internal links across ${files.length} pages, ${orphans.length} orphaned`,
)
if (broken > 0) {
  console.log(`${broken} broken`)
  process.exit(1)
}
console.log("no broken links")
