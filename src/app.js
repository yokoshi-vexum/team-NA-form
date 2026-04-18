require('dotenv').config();
const express = require('express');
const path = require('path');
const { App, ExpressReceiver } = require('@slack/bolt');
const { startReminderScheduler } = require('./scheduler/reminder');
const { getClientChannels } = require('./utils/config');
const { saveGoal } = require('./utils/goalStore');

const PORT = process.env.PORT || 3000;

// ─── Slack HTTP Mode（ExpressReceiver）────────────────────────────
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// Slackコマンド・モーダル
require('./commands/na')(slackApp);
require('./handlers/menuAction')(slackApp);
require('./handlers/eveningSubmit')(slackApp);
require('./handlers/designSubmit')(slackApp);

// ─── Express（receiver.app を流用）────────────────────────────────
const app = receiver.app;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const PROGRESS_LABELS = {
  on_track: '予定通り ✅', slightly_behind: 'やや遅れ ⚠️',
  behind: '大幅遅れ 🔴', ahead: '予定より進んでいる 🚀',
};
function userDisplay(name) { return name ? `*${name}*` : '（名前未設定）'; }

function buildEveningBlocks(d) {
  const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: '【業務終了】' } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `担当: ${userDisplay(d.submitterName)}　日付: ${today}` }] },
  ];
  if (d.nippouUrl) blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*■日報の場所*\n<${d.nippouUrl}|日報リンク>` } });
  blocks.push({ type: 'divider' });
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*1. 進み具合はどう？*\n　${PROGRESS_LABELS[d.progress] || d.progress}` } });
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*2. お客さんと何か話した？*\n　${d.clientInteraction || '特になし'}` } });
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*3. 次は誰が何をやる？*\n　${d.nextAction}` } });
  if (d.hitokoto) blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*4. 今日のひとこと*\n　${d.hitokoto}` } });
  blocks.push({ type: 'divider' });
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: d.hasTrouble ? '⚠️ *【緊急トラブルあり】*' : '✅ *【緊急トラブル】* なし' } });
  if (d.weeklyMtg === 'yes') {
    const agenda = d.weeklyMtgAgenda ? `\n　議題: ${d.weeklyMtgAgenda}` : '';
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `📅 *【週次MTG】* 希望あり${agenda}` } });
  } else {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '📅 *【週次MTG】* 今週はしなくてOK' } });
  }
  if ((d.jochiNeeds || []).length > 0) {
    const content = d.jochiContent ? `\n　内容: ${d.jochiContent}` : '';
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `🏢 *【次の常駐】* ヒアリング・打合せ必要 ✅${content}` } });
  }
  return blocks;
}

function buildDesignBlocks(d) {
  const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: '【これからこれ作りますシート】' } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `担当: ${userDisplay(d.submitterName)}　日付: ${today}` }] },
    { type: 'divider' },
    { type: 'section', text: { type: 'mrkdwn', text: `*■案件名*\n${d.projectName}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*■ゴール*\n${d.goal}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*■スタートとゴール*\n・【スタート】${d.start}\n・【ゴール出力】${d.output}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*■使う道具*\n${d.tools || '未定'}` } },
  ];
  if (d.failure) blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*■もしもの時*\n${d.failure}` } });
  if (d.deadlineDesign || d.deadlineImpl) {
    const lines = [];
    if (d.deadlineDesign) lines.push(`・設計OKをもらう日: ${d.deadlineDesign}`);
    if (d.deadlineImpl) lines.push(`・作り終わる予定日: ${d.deadlineImpl}`);
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*■期限*\n${lines.join('\n')}` } });
  }
  return blocks;
}

// チャンネル一覧API
app.get('/api/channels', async (req, res) => {
  try {
    const results = [];
    let cursor;
    do {
      const resp = await slackApp.client.conversations.list({
        types: 'public_channel,private_channel',
        exclude_archived: true,
        limit: 200,
        cursor,
      });
      results.push(...resp.channels.filter(ch => ch.is_member));
      cursor = resp.response_metadata?.next_cursor;
    } while (cursor);
    res.json(results.map(ch => ({ id: ch.id, name: ch.name, channelName: `#${ch.name}` })));
  } catch {
    res.json(getClientChannels());
  }
});

// 夕方の終了報告
app.post('/api/submit/evening', async (req, res) => {
  const d = req.body;
  if (!d.channelId) return res.status(400).json({ ok: false, error: 'channelId is required' });
  if (d.nextGoal || d.nextJochiDate) saveGoal(d.channelId, d.nextGoal, d.nextJochiDate);
  try {
    const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const parent = await slackApp.client.chat.postMessage({
      channel: d.channelId,
      text: `🌆 【業務終了】${d.submitterName || ''} (${today})`,
    });
    await slackApp.client.chat.postMessage({
      channel: d.channelId,
      thread_ts: parent.ts,
      blocks: buildEveningBlocks(d),
      text: `【業務終了】${d.submitterName || ''}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[API] evening submit error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 着手前設計シート
app.post('/api/submit/design', async (req, res) => {
  const d = req.body;
  if (!d.channelId) return res.status(400).json({ ok: false, error: 'channelId is required' });
  try {
    const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const parent = await slackApp.client.chat.postMessage({
      channel: d.channelId,
      text: `📋 【着手前設計シート】${d.submitterName || ''} / ${d.projectName || ''} (${today})`,
    });
    await slackApp.client.chat.postMessage({
      channel: d.channelId,
      thread_ts: parent.ts,
      blocks: buildDesignBlocks(d),
      text: `【着手前設計シート】${d.submitterName || ''}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[API] design submit error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── 起動 ────────────────────────────────────────────────────────
(async () => {
  await slackApp.start(PORT);
  startReminderScheduler(slackApp);
  console.log(`チームNA Bot 起動完了 (port ${PORT})`);
})();
