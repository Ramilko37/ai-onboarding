export function shouldUseTaskSharedTransition(
  isDesktopViewport: boolean,
  prefersReducedMotion: boolean,
) {
  return isDesktopViewport && !prefersReducedMotion;
}
