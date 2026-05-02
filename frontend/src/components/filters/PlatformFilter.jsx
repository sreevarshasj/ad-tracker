// FILE: frontend/src/components/filters/PlatformFilter.jsx
import { useFilterStore } from '../../store/filterStore.js'
import { PLATFORMS, PLATFORM_CONFIG } from '../../utils/constants.js'

export default function PlatformFilter() {
  const platforms = useFilterStore((s) => s.platforms)
  const togglePlatform = useFilterStore((s) => s.togglePlatform)

  return (
    <div>
      <label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Platform</label>
      <div className="flex items-center gap-1.5 flex-wrap">
        {PLATFORMS.map((platform) => {
          const config = PLATFORM_CONFIG[platform]
          const isActive = platforms.includes(platform)
          return (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
                isActive
                  ? 'border-current text-white'
                  : 'border-border text-text-muted hover:border-text-muted bg-background-surface'
              }`}
              style={isActive ? { backgroundColor: config.color + '30', color: config.color, borderColor: config.color } : {}}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? config.color : '#4A4A6A' }} />
              {config.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
