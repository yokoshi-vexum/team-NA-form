function formatDesignSheet(values, userId) {
  const projectName = values.project_name_block.project_name_input.value;
  const goal = values.goal_block.goal_input.value;
  const start = values.start_block.start_input.value;
  const output = values.output_block.output_input.value;
  const tools = values.tools_block?.tools_input?.value || '未定';
  const failure = values.failure_block?.failure_input?.value || null;
  const deadlineDesign = values.deadline_design_block?.deadline_design_input?.selected_date || null;
  const deadlineImpl = values.deadline_impl_block?.deadline_impl_input?.selected_date || null;

  const today = new Date().toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '【これからこれ作りますシート】' },
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
      text: { type: 'mrkdwn', text: `*■案件名*\n${projectName}` },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*■ゴール（完成の定義）*\n${goal}` },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*■スタートとゴール*\n・【スタート】何をしたら動き出す？\n　${start}\n・【ゴール】最終的に何が出てくる？\n　${output}`,
      },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*■使う道具（ツール）*\n${tools}` },
    },
  ];

  if (failure) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*■もしもの時（失敗例と対応策）*\n${failure}` },
    });
  }

  if (deadlineDesign || deadlineImpl) {
    const designLine = deadlineDesign ? `・設計OKをもらう日: ${deadlineDesign}` : '';
    const implLine = deadlineImpl ? `・作り終わる予定日: ${deadlineImpl}` : '';
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*■期限*\n${[designLine, implLine].filter(Boolean).join('\n')}`,
      },
    });
  }

  return {
    blocks,
    text: `【着手前設計シート】<@${userId}> 案件: ${projectName}`,
  };
}

module.exports = { formatDesignSheet };
