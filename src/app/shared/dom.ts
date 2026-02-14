export function scrollToSelector(
  selector: string,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' },
) {
  if (typeof document === 'undefined') return;

  requestAnimationFrame(() => {
    document.querySelector(selector)?.scrollIntoView(options);
  });
}
