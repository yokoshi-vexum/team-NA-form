const { formatDesignSheet } = require('../formatters/designFormatter');

module.exports = (app) => {
  app.view('design_sheet_submit', async ({ ack, body, client, logger }) => {
    await ack();

    const values = body.view.state.values;
    const userId = body.user.id;
    const channelId = values.channel_block.channel_select.selected_option.value;

    try {
      const { blocks, text } = formatDesignSheet(values, userId);
      await client.chat.postMessage({ channel: channelId, blocks, text });
    } catch (err) {
      logger.error('[designSubmit] Failed to post message:', err);
    }
  });
};
