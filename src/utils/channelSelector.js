const { getClientChannels } = require('./config');

function buildChannelSelectorBlock() {
  const channels = getClientChannels();
  return {
    type: 'input',
    block_id: 'channel_block',
    label: { type: 'plain_text', text: '投稿先チャンネル' },
    element: {
      type: 'static_select',
      action_id: 'channel_select',
      placeholder: { type: 'plain_text', text: 'チャンネルを選択...' },
      options: channels.map((ch) => ({
        text: { type: 'plain_text', text: `${ch.name}  (${ch.channelName})` },
        value: ch.id,
      })),
    },
  };
}

module.exports = { buildChannelSelectorBlock };
