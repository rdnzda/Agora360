import { cn } from "@/lib/utils"

/**
 * Logo Agora360 — icône Graduate (Phosphor Icons)
 * Toque universitaire + personnes = gouvernance participative sur campus
 */
export function Agora360Icon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-hidden="true"
      className={className}
    >
      <path d="M226.53,56.41l-96-32a8,8,0,0,0-5.06,0l-96,32A8,8,0,0,0,24,64v80a8,8,0,0,0,16,0V75.1L73.59,86.29a64,64,0,0,0,20.65,88.05c-18,7.06-33.56,19.83-44.94,37.29a8,8,0,1,0,13.4,8.74C77.77,197.25,101.57,184,128,184s50.23,13.25,65.3,36.37a8,8,0,0,0,13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64,64,0,0,0,20.65-88l44.12-14.7a8,8,0,0,0,0-15.18ZM176,120A48,48,0,1,1,89.35,91.55l36.12,12a8,8,0,0,0,5.06,0l36.12-12A47.89,47.89,0,0,1,176,120ZM128,87.57,57.3,64,128,40.43,198.7,64Z" />
    </svg>
  )
}

/** Conteneur complet : fond dégradé + icône */
export function Agora360LogoBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
        "bg-gradient-to-br from-primary to-sidebar-primary",
        className
      )}
    >
      <Agora360Icon className="text-white" size={20} />
    </div>
  )
}
