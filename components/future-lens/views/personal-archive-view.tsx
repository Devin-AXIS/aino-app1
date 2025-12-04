"use client"

import { BusinessSubpageShell } from "../layout/business-subpage-shell"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"

interface PersonalArchiveViewProps {
  onBack: () => void
}

export function PersonalArchiveView({ onBack }: PersonalArchiveViewProps) {
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]

  return (
    <BusinessSubpageShell title={t.profile_archive} onBack={onBack}>
      {/* Empty content area - cards will be added here in the future */}
      <div className="min-h-screen" />
    </BusinessSubpageShell>
  )
}
