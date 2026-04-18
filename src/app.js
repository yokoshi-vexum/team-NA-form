require('dotenv').config();
const { App } = require('@slack/bolt');
const { createServer } = require('./server');
const { startReminderScheduler } = require('./scheduler/reminder');

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Slackコマンド・モーダル（/na で使える）
require('./commands/na')(slackApp);
require('./handlers/menuAction')(slackApp);
require('./handlers/eveningSubmit')(slackApp);
require('./handlers/designSubmit')(slackApp);

// Expressサーバーを先に起動（Slackと独立して動く）
const server = createServer(slackApp);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Web フォーム起動: port ${PORT}`);
});

// Slack接続（失敗してもWebフォームは動き続ける）
slackApp.start()
  .then(() => {
    startReminderScheduler(slackApp);
    console.log('Slack Bot 接続完了 (Socket Mode)');
  })
  .catch((err) => {
    console.error('Slack Bot 接続失敗（Webフォームは引き続き利用可能）:', err.message);
  });
