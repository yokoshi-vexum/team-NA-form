require('dotenv').config();
const { App } = require('@slack/bolt');
const { startReminderScheduler } = require('./scheduler/reminder');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// コマンド
require('./commands/na')(app);

// ボタンアクション → モーダルを開く
require('./handlers/menuAction')(app);

// フォーム送信ハンドラ
require('./handlers/morningSubmit')(app);
require('./handlers/eveningSubmit')(app);
require('./handlers/designSubmit')(app);

(async () => {
  await app.start();
  startReminderScheduler(app);
  console.log('チームNA Bot が起動しました (Socket Mode)');
})();
