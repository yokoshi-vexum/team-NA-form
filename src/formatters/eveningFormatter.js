const PROGRESS_LABELS = {
  on_track: '予定通り ✅',
  slightly_behind: 'やや遅れ ⚠️',
  behind: '大幅遅れ 🔴',
  ahead: '予定より進んでいる 🚀',
};

function formatEveningReport(values, userId) {
  const nippouUrl = values.nippou_url_block?.nippou_url_input?.value || null;
  const progressValue = values.progress_block.progress_select.selected_option.value;
  const progress = PROGRESS_LABELS[progressValue] || progressValue;
  const clientInteraction =
    values.client_interaction_block?.client_interaction_input?.value || '特になし';
  const nextAction = values.next_action_block.next_action_input.value;
  const hitokoto = values.hitokoto_block?.hitokoto_input?.value || null;

  // 緊急トラブル
  const troubleSelected =
    values.trouble_block?.trouble_checkbox?.selected_options || [];
  const hasTrouble = troubleSelected.some((o) => o.value === 'has_trouble');

  // 週次MTG
  const weeklyMtgValue =
    values.weekly_mtg_block?.weekly_mtg_radio?.selected_option?.value || 'no';
  const wantsMtg = weeklyMtgValue === 'yes';
  const mtgAgenda = values.weekly_mtg_agenda_block?.weekly_mtg_agenda_input?.value || null;

  // 次の常駐
  const jochiSelected =
    values.jochi_needs_block?.jochi_needs_checkbox?.selected_options || [];
  const needsHearing = jochiSelected.some((o) => o.value === 'hearing');
  const needsMeeting = jochiSelected.some((o) => o.value === 'meeting');
  const jochiContent = values.jochi_content_block?.jochi_content_input?.value || null;

  const today = new Date().toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '【業務終了】' },
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `担当: <@${userId}>　日付: ${today}` },
      ],
    },
  ];

  if (nippouUrl) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*■日報の場所*\n<${nippouUrl}|日報リンク>` },
    });
  }

  blocks.push({ type: 'divider' });

  blocks.push({
    type: 'section',
    text: { type: 'mrkdwn', text: `*1. 進み具合はどう？*\n　${progress}` },
  });

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*2. お客さんと何か話した？*\n　${clientInteraction}`,
    },
  });

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*3. 次は誰が何をやる？*\n　${nextAction}`,
    },
  });

  if (hitokoto) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*4. 今日のひとこと*\n　${hitokoto}`,
      },
    });
  }

  blocks.push({ type: 'divider' });

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: hasTrouble
        ? '⚠️ *【緊急トラブルあり】* 詳細は別途ご確認ください'
        : '✅ *【緊急トラブル】* なし',
    },
  });

  // 週次MTGセクション
  if (wantsMtg) {
    const agendaText = mtgAgenda ? `\n　議題: ${mtgAgenda}` : '';
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `📅 *【週次MTG】* 希望あり${agendaText}`,
      },
    });
  } else {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '📅 *【週次MTG】* 今週はしなくてOK' },
    });
  }

  // 次の常駐セクション
  if (needsHearing || needsMeeting) {
    const tags = [];
    if (needsHearing) tags.push('ヒアリング必要 ✅');
    if (needsMeeting) tags.push('打合せ必要 ✅');
    const contentText = jochiContent ? `\n　内容: ${jochiContent}` : '';
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🏢 *【次の常駐】* ${tags.join(' ／ ')}${contentText}`,
      },
    });
  }

  return {
    blocks,
    text: `【業務終了】<@${userId}> 進み具合: ${progress}`,
  };
}

module.exports = { formatEveningReport };
