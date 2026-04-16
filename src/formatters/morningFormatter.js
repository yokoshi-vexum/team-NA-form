function formatMorningReport(values, userId) {
  const goal = values.goal_block.goal_input.value;
  const tasksRaw = values.tasks_block.tasks_input.value;

  const tasks = tasksRaw
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const taskBullets = tasks.map((t) => `・${t}`).join('\n');

  const today = new Date().toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '【業務開始】' },
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `担当: <@${userId}>　日付: ${today}` },
      ],
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*■今日の目標（何が終われば最高？）*\n・${goal}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*■今日やることリスト*\n${taskBullets}`,
      },
    },
  ];

  return {
    blocks,
    text: `【業務開始】<@${userId}> 今日の目標: ${goal}`,
  };
}

module.exports = { formatMorningReport };
