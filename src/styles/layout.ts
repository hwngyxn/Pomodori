export const layout = {
  // Containers
  timerContainer: "relative w-[116px] h-[116px] shrink-0",
  buttonContainer: "flex items-center gap-1.5 self-stretch",
  headerContainer: "flex items-center gap-[3px] px-2 py-0",
  contentContainer: "flex items-center h-full",
  
  // Buttons
  controlButton: "flex items-center justify-center gap-[3px] px-2.5 flex-1 grow bg-[#7676801f] rounded-full border-0 h-7 disabled:opacity-50",
  stopButton: "w-7 h-7 bg-[#7676801f] rounded-full border-0 p-0 flex items-center justify-center",
  actionButton: "flex w-[166px] items-center justify-center gap-1 px-2.5 py-1 rounded-full border-0 h-auto",

  // Components
  phaseIcon: "flex w-[26px] h-[26px] items-center justify-center bg-fillssecondary rounded-full",
  headerDivider: "relative self-stretch w-0.5 bg-labelsprimary rounded-full opacity-90",
  phaseDot: "relative w-1.5 h-1.5 rounded-full",

  // Positioning
  centered: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  phaseIconPosition: "absolute top-[16px] left-1/2 -translate-x-1/2",
  phaseDotsPosition: "absolute bottom-[22px] left-1/2 -translate-x-1/2"
} as const;
