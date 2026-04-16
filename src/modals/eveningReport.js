const { buildChannelSelectorBlock } = require('../utils/channelSelector');

function buildEveningModal() {
  return {
    type: 'modal',
    callback_id: 'evening_report_submit',
    title: { type: 'plain_text', text: '夕方の終了報告' },
    submit: { type: 'plain_text', text: '送信' },
    close: { type: 'plain_text', text: 'キャンセル' },
    blocks: [
      buildChannelSelectorBlock(),
      {
        type: 'input',
        block_id: 'nippou_url_block',
        label: { type: 'plain_text', text: '日報の場所（URL）' },
        optional: true,
        element: {
          type: 'plain_text_input',
          action_id: 'nippou_url_input',
          placeholder: { type: 'plain_text', text: 'https://notion.so/...' },
        },
      },
      {
        type: 'input',
        block_id: 'progress_block',
        label: { type: 'plain_text', text: '進み具合はどう？' },
        element: {
          type: 'static_select',
          action_id: 'progress_select',
          placeholder: { type: 'plain_text', text: '選択してください' },
          options: [
            { text: { type: 'plain_text', text: '予定通り ✅' }, value: 'on_track' },
            { text: { type: 'plain_text', text: 'やや遅れ ⚠️' }, value: 'slightly_behind' },
            { text: { type: 'plain_text', text: '大幅遅れ 🔴' }, value: 'behind' },
            { text: { type: 'plain_text', text: '予定より進んでいる 🚀' }, value: 'ahead' },
          ],
        },
      },
      {
        type: 'input',
        block_id: 'client_interaction_block',
        label: { type: 'plain_text', text: 'お客さんと何か話した？' },
        optional: true,
        element: {
          type: 'plain_text_input',
          action_id: 'client_interaction_input',
          multiline: true,
          placeholder: {
            type: 'plain_text',
            text: '特になし、または「○○さんと△△の話をした」など',
          },
        },
      },
      {
        type: 'input',
        block_id: 'next_action_block',
        label: { type: 'plain_text', text: '次は誰が何をやる？' },
        element: {
          type: 'plain_text_input',
          action_id: 'next_action_input',
          placeholder: { type: 'plain_text', text: '例: 田中が仕様書を完成させて実装まで着手する' },
        },
      },
      {
        type: 'input',
        block_id: 'hitokoto_block',
        label: { type: 'plain_text', text: '今日のひとこと（雑談・ランチ・天気なんでも！）' },
        optional: true,
        element: {
          type: 'plain_text_input',
          action_id: 'hitokoto_input',
          placeholder: { type: 'plain_text', text: '一言コメント' },
        },
      },
      {
        type: 'input',
        block_id: 'trouble_block',
        label: { type: 'plain_text', text: '緊急トラブル確認' },
        hint: {
          type: 'plain_text',
          text: 'クレームや契約外の相談があればチェック（なければ空のままでOK）',
        },
        optional: true,
        element: {
          type: 'checkboxes',
          action_id: 'trouble_checkbox',
          options: [
            {
              text: { type: 'plain_text', text: '緊急トラブルあり（すぐに電話済み）' },
              value: 'has_trouble',
            },
          ],
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'input',
        block_id: 'weekly_mtg_block',
        label: { type: 'plain_text', text: '週次MTGしたい？' },
        element: {
          type: 'radio_buttons',
          action_id: 'weekly_mtg_radio',
          options: [
            { text: { type: 'plain_text', text: 'したい' }, value: 'yes' },
            { text: { type: 'plain_text', text: 'しなくてOK' }, value: 'no' },
          ],
        },
      },
      {
        type: 'input',
        block_id: 'weekly_mtg_agenda_block',
        label: { type: 'plain_text', text: '週次MTGで話したい内容' },
        hint: { type: 'plain_text', text: '「したい」を選んだ場合に記入してください' },
        optional: true,
        element: {
          type: 'plain_text_input',
          action_id: 'weekly_mtg_agenda_input',
          multiline: true,
          placeholder: { type: 'plain_text', text: '例: スプリント振り返り・来週の優先度確認' },
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'input',
        block_id: 'jochi_needs_block',
        label: { type: 'plain_text', text: '次の常駐で必要なこと' },
        hint: {
          type: 'plain_text',
          text: '該当するものをチェックしてください（複数選択可）',
        },
        optional: true,
        element: {
          type: 'checkboxes',
          action_id: 'jochi_needs_checkbox',
          options: [
            {
              text: { type: 'plain_text', text: 'ヒアリングが必要' },
              value: 'hearing',
            },
            {
              text: { type: 'plain_text', text: '打合せが必要' },
              value: 'meeting',
            },
          ],
        },
      },
      {
        type: 'input',
        block_id: 'jochi_content_block',
        label: { type: 'plain_text', text: 'ヒアリング・打合せの内容（何を聞きたい？）' },
        hint: {
          type: 'plain_text',
          text: '上でヒアリングor打合せをチェックした場合に記入してください',
        },
        optional: true,
        element: {
          type: 'plain_text_input',
          action_id: 'jochi_content_input',
          multiline: true,
          placeholder: {
            type: 'plain_text',
            text: '例: 新機能の要件をヒアリング・仕様合意の打合せ',
          },
        },
      },
    ],
  };
}

module.exports = { buildEveningModal };
