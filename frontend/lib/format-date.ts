function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isYesterday(post: Date, now: Date): boolean {
  const y = new Date(now)
  y.setDate(y.getDate() - 1)
  return sameCalendarDay(post, y)
}

/** Dias de calendário entre o dia do post e hoje (0 = hoje, 1 = ontem já tratado à parte). */
function wholeCalendarDaysBehind(post: Date, now: Date): number {
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startPost = new Date(
    post.getFullYear(),
    post.getMonth(),
    post.getDate()
  ).getTime()
  return Math.round((startToday - startPost) / (24 * 60 * 60 * 1000))
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute

  if (diffMs < 0) return "agora"
  if (diffMs < minute) return "agora"

  if (sameCalendarDay(target, now)) {
    if (diffMs < hour) return `${Math.floor(diffMs / minute)}m`
    return `${Math.floor(diffMs / hour)}h`
  }

  if (isYesterday(target, now)) return "ontem"

  const days = wholeCalendarDaysBehind(target, now)
  return `${days}d`
}
