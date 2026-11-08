// Editorial priority leads; a normalized aggregate engagement score can add up to 25 points.
// Missing analytics contributes no engagement boost. Unapproved topics never enter rotation.
const bounded = value => typeof value === 'number' && Number.isFinite(value)
  ? Math.max(0, Math.min(100, value)) : 0;
export function selectTopics(topics, limit = 10) {
  if (!Array.isArray(topics)) return [];
  const seen = new Set();
  return topics.filter(topic => {
    if (!topic || topic.approved !== true || typeof topic.id !== 'string' || !topic.id.trim()
      || seen.has(topic.id) || typeof topic.title !== 'string' || !topic.title.trim()
      || typeof topic.description !== 'string' || typeof topic.href !== 'string'
      || !(/^(\/(?!\/)|https:\/\/)/.test(topic.href))) return false;
    seen.add(topic.id);
    return true;
  }).map((topic, position) => ({topic, position,
    score: bounded(topic.editorialPriority) + bounded(topic.engagementScore) * .25
  })).sort((a, b) => b.score - a.score || a.position - b.position)
    .slice(0, Math.max(0, Math.min(10, Math.floor(Number(limit) || 0))))
    .map(item => item.topic);
}
