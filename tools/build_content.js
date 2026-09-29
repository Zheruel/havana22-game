#!/usr/bin/env node
// Spaja tools/content_src/*.js (abecednim redom) u game/content/content.js
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'content_src');
const out = path.join(__dirname, '..', 'game', 'content', 'content.js');
const files = fs.readdirSync(src).filter(f => f.endsWith('.js')).sort();
const body = files.map(f => fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, body, 'utf8');
console.log('built', out, '(' + files.length + ' parts, ' + body.length + ' chars)');
