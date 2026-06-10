#!/usr/bin/env node
/** Verify icon assets exist and meet WeChat TabBar minimum requirements. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'assets', 'icons');
const tabBar = ['home', 'home-active', 'cart', 'cart-active', 'order', 'order-active', 'profile', 'profile-active'];
const uiRequired = [
  'search', 'location', 'bell', 'star', 'back', 'plus', 'minus', 'trash',
  'wechat', 'wechat-white', 'phone', 'phone-white', 'clock', 'gift', 'empty', 'order', 'cart', 'profile',
];

let failed = 0;

function check(filePath, minBytes = 100) {
  if (!fs.existsSync(filePath)) {
    console.error('✗ missing:', path.relative(root, filePath));
    failed += 1;
    return;
  }
  const stat = fs.statSync(filePath);
  if (stat.size < minBytes) {
    console.error('✗ too small:', path.relative(root, filePath), stat.size, 'bytes');
    failed += 1;
    return;
  }
  console.log('✓', path.relative(root, filePath));
}

console.log('TabBar icons:');
tabBar.forEach((name) => check(path.join(root, `${name}.png`)));

console.log('\nUI icons:');
uiRequired.forEach((name) => check(path.join(root, 'ui', `${name}.png`)));

if (failed > 0) {
  console.error(`\n${failed} icon check(s) failed`);
  process.exit(1);
}

console.log('\nAll icon checks passed.');
