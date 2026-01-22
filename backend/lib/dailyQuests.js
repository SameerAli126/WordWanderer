const DAILY_QUESTS = [
  {
    id: 'daily_xp_50',
    title: 'Earn 50 XP',
    type: 'xp',
    target: 50,
    rewardGems: 20
  },
  {
    id: 'daily_lessons_3',
    title: 'Complete 3 lessons',
    type: 'lessons',
    target: 3,
    rewardGems: 30
  },
  {
    id: 'daily_minutes_10',
    title: 'Study for 10 minutes',
    type: 'time',
    target: 600,
    rewardGems: 25
  }
];

const isSameDay = (left, right) => {
  if (!left || !right) {
    return false;
  }
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

const ensureDailyStats = (user, now) => {
  const lastDate = user.dailyLessonDate ? new Date(user.dailyLessonDate) : null;
  if (!lastDate || !isSameDay(lastDate, now)) {
    user.dailyLessonDate = now;
    user.dailyLessonCount = 0;
    user.dailyXP = 0;
    user.dailyStudySeconds = 0;
    user.dailyQuestCompletions = [];
    return true;
  }

  if (!Array.isArray(user.dailyQuestCompletions)) {
    user.dailyQuestCompletions = [];
  }

  if (typeof user.dailyLessonCount !== 'number') {
    user.dailyLessonCount = 0;
  }
  if (typeof user.dailyXP !== 'number') {
    user.dailyXP = 0;
  }
  if (typeof user.dailyStudySeconds !== 'number') {
    user.dailyStudySeconds = 0;
  }

  return false;
};

const getQuestProgress = (user, quest) => {
  switch (quest.type) {
    case 'xp':
      return user.dailyXP || 0;
    case 'lessons':
      return user.dailyLessonCount || 0;
    case 'time':
      return user.dailyStudySeconds || 0;
    default:
      return 0;
  }
};

const hasCompletedQuestToday = (user, questId, now) => {
  if (!Array.isArray(user.dailyQuestCompletions)) {
    return false;
  }
  return user.dailyQuestCompletions.some((entry) => {
    if (!entry || entry.questId !== questId || !entry.completedAt) {
      return false;
    }
    return isSameDay(new Date(entry.completedAt), now);
  });
};

const markQuestCompleted = (user, questId, now) => {
  if (!Array.isArray(user.dailyQuestCompletions)) {
    user.dailyQuestCompletions = [];
  }
  user.dailyQuestCompletions.push({
    questId,
    completedAt: now
  });
};

const applyDailyQuestRewards = (user, now) => {
  const completed = [];
  let rewardGems = 0;

  DAILY_QUESTS.forEach((quest) => {
    const progress = getQuestProgress(user, quest);
    if (progress < quest.target) {
      return;
    }
    if (hasCompletedQuestToday(user, quest.id, now)) {
      return;
    }

    markQuestCompleted(user, quest.id, now);
    rewardGems += quest.rewardGems;
    completed.push({
      id: quest.id,
      title: quest.title,
      rewardGems: quest.rewardGems
    });
  });

  return { rewardGems, completed };
};

const buildDailyQuestState = (user, now) => {
  return DAILY_QUESTS.map((quest) => {
    const progress = getQuestProgress(user, quest);
    const completed = progress >= quest.target;
    return {
      ...quest,
      progress,
      completed
    };
  });
};

const getResetInSeconds = (now) => {
  const nextReset = new Date(now);
  nextReset.setHours(24, 0, 0, 0);
  return Math.max(0, Math.round((nextReset.getTime() - now.getTime()) / 1000));
};

module.exports = {
  DAILY_QUESTS,
  ensureDailyStats,
  applyDailyQuestRewards,
  buildDailyQuestState,
  getResetInSeconds,
  isSameDay
};
