const { getClientChannels } = require('./config');

function buildChannelSelectorBlock() {
  const channels = getClientChannels();
  return {
    type: 'input',
    block_id: 'channel_block',
    label: { type: 'plain_text', text: 'クライアント名' },
    element: {
      type: 'static_select',
      action_id: 'channel_select',
      placeholder: { type: 'plain_text', text: 'クライアントを選択...' },
      options: channels.map((ch) => ({
        text: { type: 'plain_text', text: ch.name },
        value: ch.id,
      })),
    },
  };
}

module.exports = { buildChannelSelectorBlock };
