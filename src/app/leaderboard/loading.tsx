export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-rule bg-paper sticky top-0 z-10">
        <span className="font-display font-black text-2xl tracking-tight">Leaderboard</span>
        <div className="border border-rule px-4 py-2 text-sm text-ink-light font-mono opacity-40">← Back</div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto flex flex-col gap-10 animate-pulse">

        {/* Career stats skeleton */}
        <section>
          <div className="h-3 w-24 bg-rule rounded mb-4" />
          <div className="flex flex-col gap-px">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4 py-2.5 border-b border-rule">
                <div className="h-4 bg-rule rounded" style={{ width: `${80 + i * 15}px` }} />
                <div className="flex-1 flex justify-end gap-6">
                  {[1, 2, 3, 4, 5].map(j => (
                    <div key={j} className="h-4 w-8 bg-rule rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent matches skeleton */}
        <section>
          <div className="h-3 w-32 bg-rule rounded mb-4" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 5].map(i => (
              <div key={i} className="bg-paper border border-rule px-4 py-3 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="h-5 w-20 bg-rule rounded" />
                  <div className="h-4 w-10 bg-rule rounded" />
                  <div className="h-5 w-20 bg-rule rounded" />
                </div>
                <div className="h-4 w-32 bg-rule rounded" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
