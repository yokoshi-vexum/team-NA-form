const { formatEveningReport } = require('../formatters/eveningFormatter');

module.exports = (app) => {
  app.view('evening_report_submit', async ({ ack, body, client, logger }) => {
    await ack();

    const values = body.view.state.values;
    const userId = body.user.id;
    const channelId = values.channel_block.channel_select.selected_option.value;

    try {
      const { blocks, text } = formatEveningReport(values, userId);
      await client.chat.postMessage({ channel: channelId, blocks, text });
    } catch (err) {
      logger.error('[eveningSubmit] Failed to post message:', err);
    }
  });
};
