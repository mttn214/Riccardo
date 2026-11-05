import type { PointerEvent } from 'react';

const footerGlowBands = [8, 15, 22, 29];

export function clearTextGlow() {
  CSS.highlights?.delete('riccardo-glow');
  CSS.highlights?.delete('riccardo-glow-edge');
  footerGlowBands.forEach((_, index) => CSS.highlights?.delete(`riccardo-footer-glow-${index}`));
}

export function updateTextGlow(event: PointerEvent<HTMLDivElement>) {
  if (!CSS.highlights || event.pointerType !== 'mouse') return;
  clearTextGlow();

  const target = event.target;
  if (!(target instanceof Element) || target.closest('.glass-brand-text, input, textarea, select, [contenteditable], svg')) return;
  if (target.closest('button.bg-white, [role="button"].bg-white, .glass-action.bg-white')) return;

  const { clientX: x, clientY: y } = event;
  const caret = document.caretPositionFromPoint?.(x, y);
  const fallback = caret ? null : document.caretRangeFromPoint?.(x, y);
  const node = caret?.offsetNode ?? fallback?.startContainer;
  const offset = caret?.offset ?? fallback?.startOffset ?? 0;
  if (!(node instanceof Text) || !target.contains(node)) return;

  const center = new Highlight();
  const edge = new Highlight();
  const isFooterCategory = target.closest('[data-local-text-glow]') !== null;
  const footerHighlights = isFooterCategory ? footerGlowBands.map(() => new Highlight()) : [];
  for (let index = Math.max(0, offset - 16); index < Math.min(node.length, offset + 16); index++) {
    const range = new Range();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const bounds = range.getBoundingClientRect();
    if (!bounds.width || y < bounds.top || y > bounds.bottom) continue;

    const distance = Math.max(bounds.left - x, x - bounds.right, 0);
    if (isFooterCategory) {
      const band = footerGlowBands.findIndex((limit) => distance <= limit);
      footerHighlights[band]?.add(range);
    } else if (distance <= 14) center.add(range);
    else if (distance <= 34) edge.add(range);
  }

  // Use a color highlight for footer categories so the effect stays within the selected letters.
  if (isFooterCategory) {
    footerHighlights.forEach((highlight, index) => CSS.highlights.set(`riccardo-footer-glow-${index}`, highlight));
    return;
  }
  CSS.highlights.set('riccardo-glow', center);
  CSS.highlights.set('riccardo-glow-edge', edge);
}
