const { buildChannelSelectorBlock } = require('../utils/channelSelector');

function buildDesignSheetModal() {
  return {
    type: 'modal',
    callback_id: 'design_sheet_submit',
    title: { type: 'plain_text', text: '着手前設計シート' },
    submit: { type: 'plain_text', text: '送信' },
    close: { type: 'plain_text', text: 'キャンセル' },
    blocks: [
      buildChannelSelectorBlock(),
      {
        type: 'input',
        block_id: 'project_name_block',
        label: { type: 'plain_text', text: '案件名' },
        element: {
          type: 'plain_text_input',
          action_id: 'project_name_input',
          placeholder: { type: 'plain_text', text: '例: 請求書PDF自動取込み' },
        },
      },
      {
        type: 'input',
        block_id: 'goal_block',
        label: { type: 'plain_text', text: 'ゴール（何がどうなれば完成？）' },
        element: {
          type: 'plain_text_input',
          action_id: 'goal_input',
          multiline: true,
          placeholder: {
            type: 'plain_text',
            text: '例: 請求書のPDFを入れたら、勝手にスプレッドシートに金額が入る状態',
          },
        },
      },
      {
        type: 'input',
        block_id: 'start_block',
        label: { type: 'plain_text', text: 'スタート（何をしたら動き出す？）' },
        element: {
          type: 'plain_text_input',
          action_id: 'start_input',
          placeholder: { type: 'plain_text', text: '例: GoogleドライブにPDFを入れる' },
        },
      },
      {
        type: 'input',
        block_id: 'output_block',
        label: { type: 'plain_text', text: 'ゴール出力（最終的に何が出てくる？）' },
        element: {
          type: 'plain_text_input',
          action_id: 'output_input',
          placeholder: {
            type: 'plain_text',
            text: '例: スプレッドシートに行が追加されて、Slackに「終わったよ」と通知が来る',
          },
        },
      },
      {
        type: 'input',
        block_id: 'tools_block',
        label: { type: 'plain_text', text: '使う道具（ツール）' },
        hint: { type: 'plain_text', text: 'まだ決まってなくてOK！これから調べますでもOK' },
        optional: true,
        element: {
          type: 'plain_text_input',
          action_id: 'tools_input',
          multiline: true,
          placeholder: { type: 'plain_text', text: '例: GAS / Notion API / Slack Webhook' },
        },
      },
      {
        type: 'input',
        block_id: 'failure_block',
        label: { type: 'plain_text', text: 'もしもの時（失敗例と対応策）' },
        optional: true,
        element: {
          type: 'plain_text_input',
          action_id: 'failure_input',
          multiline: true,
          placeholder: {
            type: 'plain_text',
            text: '失敗例: 手書きで文字が読めなかったら？\n対応策: エラー用フォルダに入れて、人間に「確認して！」とSlack通知を送る',
          },
        },
      },
      {
        type: 'input',
        block_id: 'deadline_design_block',
        label: { type: 'plain_text', text: '設計OKをもらう日' },
        optional: true,
        element: {
          type: 'datepicker',
          action_id: 'deadline_design_input',
          placeholder: { type: 'plain_text', text: '日付を選択' },
        },
      },
      {
        type: 'input',
        block_id: 'deadline_impl_block',
        label: { type: 'plain_text', text: '作り終わる予定日' },
        optional: true,
        element: {
          type: 'datepicker',
          action_id: 'deadline_impl_input',
          placeholder: { type: 'plain_text', text: '日付を選択' },
        },
      },
    ],
  };
}

module.exports = { buildDesignSheetModal };
