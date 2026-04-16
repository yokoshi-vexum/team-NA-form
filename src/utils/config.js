const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.resolve(__dirname, '../../config/settings.json');

function getConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

function getClientChannels() {
  return getConfig().clientChannels;
}

function getJochiDates() {
  return getConfig().jochiDates;
}

module.exports = { getConfig, getClientChannels, getJochiDates };
