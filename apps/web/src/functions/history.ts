export function history(posts: { date: Date; active: boolean }[]):  { year: number; month: number; count: number }[] {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts
  const map = new Map<string, { year: number; month: number; count: number }>();

  for (const post of posts.filter((p) => p.active)) {
    const d = new Date(post.date);
    if (Number.isNaN(d.getTime())) continue;

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${month}`;

    const current = map.get(key) ?? { year, month, count: 0 };
    current.count += 1;
    map.set(key, current);
  }

  return [...map.values()].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}
