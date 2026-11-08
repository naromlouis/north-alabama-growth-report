# Regional topic rotation

The hero rotates up to ten approved topics from `topics.json`. Its first ten entries are based on existing launch stories and coverage areas. Coverage-focus cards are topic introductions, not additional reported articles. Existing story cards and original-source links remain unchanged.

## Editorial control

Review each topic's title, description and destination before setting `approved: true`. Drafts, invalid destinations and duplicate IDs are excluded. Never infer approval from an engagement score. Add as many reviewed entries as needed; only the top ten are displayed. Remove approval when a topic should leave the pool.

`editorialPriority` is a number from 0–100. With the current null `engagementScore` values, the rotation follows this editorial order. Stable ties retain the order in the JSON file.

## When engagement data is available

There is no aggregate analytics collection or automatic analytics feed configured. A topic-link click emits the browser event `nagr:topic-engagement`, with `topicId`, `action: click` and `placement: hero-carousel`; no personal information is included, and the site does not persist or transmit that event itself.

Connect a chosen analytics service to that event and use normalized aggregate engagement from the same measurement window for every eligible topic. A future update process can write `engagementScore` (0–100) into the JSON. The selector then ranks approved topics by `editorialPriority + 0.25 × engagementScore` and chooses the top ten on page load. Null engagement adds no boost. Editorial relevance remains the main signal; thresholds and weighting can be adjusted after enough data is available. Do not describe the initial rotation as most-read or engagement-ranked.

The carousel advances every seven seconds. It pauses on hover, keyboard focus and hidden tabs, with explicit play/pause and previous/next controls. It starts paused for reduced-motion preferences. Screen-reader announcements occur for manual navigation; automatic advances are silent. If topics fail to load, the source-linked coverage fallback remains visible.
