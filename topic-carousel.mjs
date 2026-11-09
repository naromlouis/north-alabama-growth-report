import { selectTopics } from './topic-ranking.mjs';

export function mountCarousel(root, topics, env = window) {
  const selected = selectTopics(topics);
  if (!selected.length) return null;
  const doc = root.ownerDocument;
  const slides = root.querySelector('[data-topic-slides]');
  const dots = root.querySelector('[data-topic-dots]');
  const counter = root.querySelector('[data-topic-counter]');
  const status = root.querySelector('[data-topic-status]');
  const toggle = root.querySelector('[data-topic-toggle]');
  const previous = root.querySelector('[data-topic-prev]');
  const next = root.querySelector('[data-topic-next]');
  const motion = env.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer = null, hovering = false, focused = false, paused = motion.matches;
  const cards = [], indicators = [];
  const make = (tag, className, text) => {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  selected.forEach((topic, position) => {
    const card = make('div', 'topic-card');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${position + 1} of ${selected.length}: ${topic.title}`);
    const graphic = make('img', 'topic-graphic');
    const fallbackGraphic = '/assets/carousel/default.svg';
    graphic.src = typeof topic.image === 'string' && /^\/assets\//.test(topic.image)
      ? topic.image : fallbackGraphic;
    graphic.alt = typeof topic.imageAlt === 'string' ? topic.imageAlt : '';
    graphic.width = 1200; graphic.height = 675;
    graphic.loading = position === 0 ? 'eager' : 'lazy';
    graphic.decoding = 'async';
    let usedFallback = graphic.src === fallbackGraphic;
    graphic.addEventListener('error', () => {
      if (!usedFallback) { usedFallback = true; graphic.src = fallbackGraphic; }
    });
    card.append(graphic);
    card.append(make('p', 'topic-category', topic.category || 'In focus'),
      make('h3', 'topic-title', topic.title), make('p', 'topic-description', topic.description));
    const link = make('a', 'topic-link', (topic.linkLabel || 'Explore the topic') + ' ↗');
    link.href = topic.href;
    if (topic.href.startsWith('https://')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    link.addEventListener('click', () => root.dispatchEvent(new env.CustomEvent('nagr:topic-engagement', {
      bubbles: true, detail: {topicId: topic.id, action: 'click', placement: 'hero-carousel'}
    })));
    card.append(link); slides.append(card); cards.push(card);
    const dot = make('button', 'topic-dot'); dot.type = 'button';
    dot.setAttribute('aria-label', `Show topic ${position + 1}: ${topic.title}`);
    dot.addEventListener('click', () => { paused = true; show(position, true); });
    dots.append(dot); indicators.push(dot);
  });
  function stop() { if (timer !== null) env.clearTimeout(timer); timer = null; }
  function schedule() {
    stop();
    if (!paused && !hovering && !focused && !doc.hidden && selected.length > 1)
      timer = env.setTimeout(() => show(index + 1), 7000);
  }
  function show(position, announce = false) {
    index = (position + selected.length) % selected.length;
    cards.forEach((card, i) => { card.hidden = i !== index; });
    indicators.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(selected.length).padStart(2, '0')}`;
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', paused ? 'Start automatic topic rotation' : 'Pause automatic topic rotation');
    if (announce) status.textContent = `Topic ${index + 1} of ${selected.length}: ${selected[index].title}`;
    schedule();
  }
  previous.addEventListener('click', () => { paused = true; show(index - 1, true); });
  next.addEventListener('click', () => { paused = true; show(index + 1, true); });
  toggle.addEventListener('click', () => { paused = !paused; focused = false; show(index); });
  root.addEventListener('mouseenter', () => { hovering = true; stop(); });
  root.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  root.addEventListener('focusin', () => { focused = true; stop(); });
  root.addEventListener('focusout', event => {
    if (!root.contains(event.relatedTarget)) { focused = false; paused = true; show(index); }
  });
  root.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault(); paused = true; show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  doc.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', event => { if (event.matches) { paused = true; show(index); } });
  previous.disabled = next.disabled = toggle.disabled = selected.length < 2;
  root.querySelector('[data-topic-fallback]').hidden = true;
  root.querySelector('[data-topic-controls]').hidden = false;
  show(0);
  return { get activeTopicId() { return selected[index].id; }, get paused() { return paused; }, stop };
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-topic-carousel]');
  if (root) fetch('/topics.json').then(response => {
    if (!response.ok) throw new Error('Topics unavailable');
    return response.json();
  }).then(topics => mountCarousel(root, topics)).catch(() => {
    // Keep the source-linked coverage fallback visible if loading fails.
  });
}
