const { formatMorningReport } = require('../formatters/morningFormatter');

module.exports = (app) => {
  app.view('morning_report_submit', async ({ ack, body, client, logger }) => {
    await ack();

    const values = body.view.state.values;
    const userId = body.user.id;
    const channelId = values.channel_block.channel_select.selected_option.value;

    try {
      const { blocks, text } = formatMorningReport(values, userId);
      await client.chat.postMessage({ channel: channelId, blocks, text });
    } catch (err) {
      logger.error('[morningSubmit] Failed to post message:', err);
    }
  });
};
