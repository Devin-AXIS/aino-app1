/**
 * 应用背景组件，提供渐变背景和网格效果
 * @example
 * ```tsx
 * <AppBackground />
 * ```
 */
export const AppBackground = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[rgb(var(--app-bg))] z-0" />

      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgb(var(--glow-blue)/0.6)_0%,rgb(var(--glow-purple)/0.3)_40%,rgb(var(--app-bg)/0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(30,58,88,0.45)_0%,rgba(51,51,71,0.25)_40%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="absolute top-[10%] right-[-20%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle_at_center,rgb(var(--glow-blue)/0.5)_0%,rgb(var(--glow-accent)/0.2)_50%,rgb(var(--app-bg)/0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(30,58,88,0.4)_0%,rgba(41,98,128,0.18)_50%,transparent_70%)] blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-5%] left-[-10%] w-[100%] h-[70%] rounded-full bg-[radial-gradient(circle_at_center,rgb(var(--glow-purple)/0.6)_0%,rgb(var(--glow-accent)/0.3)_40%,rgb(var(--app-bg)/0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(51,51,71,0.5)_0%,rgba(41,98,128,0.28)_40%,transparent_70%)] blur-[130px] pointer-events-none" />

      <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgb(var(--glow-accent)/0.4)_0%,rgb(var(--app-bg)/0)_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(41,98,128,0.35)_0%,transparent_60%)] blur-[90px] pointer-events-none" />

      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </>
  )
}
