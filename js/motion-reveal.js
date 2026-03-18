/**
 * Slide-up + fade reveal for card grids (Motion library).
 * Runs on any page that has matching container/card selectors.
 */
import { inView, animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const pairs = [
  [".stats-section", ".stat-item"],
  [".agentic-section", ".agentic-card"],
  [".partners-section", ".partner-item"],
  [".mission-grid", ".mission-card"],
  [".values-grid", ".value-card"],
  [".press-grid", ".press-item"],
  [".docs-grid", ".doc-card"],
  [".labs-grid", ".lab-card"],
  [".tech-grid", ".tech-card"],
  [".factors-grid", ".factor-card"],
  [".surfaces-grid", ".surface-card"],
  [".products-grid", ".product-card"],
  [".types-grid", ".type-card"],
  [".testimonials-grid", ".testimonial-card"],
];

pairs.forEach(([containerSel, cardSel]) => {
  const container = document.querySelector(containerSel);
  if (!container) return;
  const cards = container.querySelectorAll(cardSel);
  if (cards.length === 0) return;
  inView(containerSel, () => {
    animate(cards, { y: [24, 0], opacity: [0, 1] }, {
      delay: stagger(0.08),
      duration: 0.5,
      ease: "easeOut",
    });
  }, { amount: 0.2, once: true });
});
