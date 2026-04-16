module.exports = (app) => {
  app.command('/na', async ({ command, ack, client, logger }) => {
    await ack();

    try {
      await client.chat.postEphemeral({
        channel: command.channel_id,
        user: command.user_id,
        text: '報告フォームを選択してください',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*チームNA 報告フォーム*\n送信する報告の種類を選んでください：',
            },
          },
          {
            type: 'actions',
            block_id: 'form_selector',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: '🌅 朝の開始報告' },
                action_id: 'open_morning_modal',
                style: 'primary',
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: '🌆 夕方の終了報告' },
                action_id: 'open_evening_modal',
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: '📋 着手前設計シート' },
                action_id: 'open_design_modal',
              },
            ],
          },
        ],
      });
    } catch (err) {
      logger.error('[/na] Failed to post ephemeral:', err);
    }
  });
};
