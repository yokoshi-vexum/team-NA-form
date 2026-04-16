const { buildMorningModal } = require('../modals/morningReport');
const { buildEveningModal } = require('../modals/eveningReport');
const { buildDesignSheetModal } = require('../modals/designSheet');

module.exports = (app) => {
  app.action('open_morning_modal', async ({ ack, body, client, logger }) => {
    await ack();
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: buildMorningModal(),
      });
    } catch (err) {
      logger.error('[menuAction] Failed to open morning modal:', err);
    }
  });

  app.action('open_evening_modal', async ({ ack, body, client, logger }) => {
    await ack();
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: buildEveningModal(),
      });
    } catch (err) {
      logger.error('[menuAction] Failed to open evening modal:', err);
    }
  });

  app.action('open_design_modal', async ({ ack, body, client, logger }) => {
    await ack();
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: buildDesignSheetModal(),
      });
    } catch (err) {
      logger.error('[menuAction] Failed to open design modal:', err);
    }
  });
};
