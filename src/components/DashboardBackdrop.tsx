/** Matches Figma export: subtle grid + soft indigo orb (non-interactive). */
export function DashboardBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,var(--backdrop-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--backdrop-line)_1px,transparent_1px)] bg-[length:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -top-[10%] -right-[5%] z-0 h-[min(400px,50vw)] w-[min(400px,50vw)] rounded-full bg-[var(--orb-fill)] blur-3xl"
        aria-hidden
      />
    </>
  )
}
