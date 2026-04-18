const fs = require('fs');
const path = require('path');

const GOALS_PATH = path.resolve(__dirname, '../../data/goals.json');

function loadGoals() {
  try {
    return JSON.parse(fs.readFileSync(GOALS_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

// goal と nextJochiDate を一緒に保存
function saveGoal(channelId, goal, nextJochiDate) {
  const goals = loadGoals();
  goals[channelId] = {
    goal: goal || goals[channelId]?.goal || null,
    nextJochiDate: nextJochiDate || goals[channelId]?.nextJochiDate || null,
  };
  fs.writeFileSync(GOALS_PATH, JSON.stringify(goals, null, 2), 'utf-8');
}

function getGoal(channelId) {
  return loadGoals()[channelId] || null;
}

// 全チャンネルの中から明日が常駐日のものを返す
function getChannelsWithTomorrowJochi(tomorrow) {
  const goals = loadGoals();
  return Object.entries(goals)
    .filter(([, v]) => v.nextJochiDate === tomorrow)
    .map(([channelId, v]) => ({ channelId, goal: v.goal }));
}

module.exports = { saveGoal, getGoal, getChannelsWithTomorrowJochi };
