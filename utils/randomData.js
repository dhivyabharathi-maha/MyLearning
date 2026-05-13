export function getRandomProjectName(prefix = 'AutoProject') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const suffix = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${suffix}`;
}
