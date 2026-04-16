const { buildChannelSelectorBlock } = require('../utils/channelSelector');

function buildMorningModal() {
  return {
    type: 'modal',
    callback_id: 'morning_report_submit',
    title: { type: 'plain_text', text: '朝の開始報告' },
    submit: { type: 'plain_text', text: '送信' },
    close: { type: 'plain_text', text: 'キャンセル' },
    blocks: [
      buildChannelSelectorBlock(),
      {
        type: 'input',
        block_id: 'goal_block',
        label: { type: 'plain_text', text: '今日の目標（何が終われば最高？）' },
        element: {
          type: 'plain_text_input',
          action_id: 'goal_input',
          multiline: false,
          placeholder: { type: 'plain_text', text: '例: ○○機能の実装を完了する' },
        },
      },
      {
        type: 'input',
        block_id: 'tasks_block',
        label: { type: 'plain_text', text: '今日やることリスト' },
        hint: { type: 'plain_text', text: '1行につき1タスクを入力してください' },
        element: {
          type: 'plain_text_input',
          action_id: 'tasks_input',
          multiline: true,
          placeholder: { type: 'plain_text', text: 'タスク1\nタスク2\nタスク3' },
        },
      },
    ],
  };
}

module.exports = { buildMorningModal };
