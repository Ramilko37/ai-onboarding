export const motion = {
  instant: 100,
  fast: 140,
  local: 200,
  control: 240,
  page: 320,
  shared: 380,
  emphasis: 440,
} as const;

export function getMotionDuration(duration: keyof typeof motion, reduceMotion: boolean) {
  return reduceMotion ? 120 : motion[duration];
}
