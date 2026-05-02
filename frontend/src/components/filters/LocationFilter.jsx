// FILE: frontend/src/components/filters/LocationFilter.jsx
import { useFilterStore } from '../../store/filterStore.js'
import { useLocationFilters } from '../../hooks/useFilters.js'
import Dropdown from '../ui/Dropdown.jsx'
import { COUNTRIES } from '../../utils/constants.js'

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c, label: c }))

export default function LocationFilter() {
  const country = useFilterStore((s) => s.country)
  const state = useFilterStore((s) => s.state)
  const city = useFilterStore((s) => s.city)
  const setCountry = useFilterStore((s) => s.setCountry)
  const setState = useFilterStore((s) => s.setState)
  const setCity = useFilterStore((s) => s.setCity)

  const { states, cities } = useLocationFilters()

  const stateOptions = (states || []).map((s) => ({ value: s, label: s }))
  const cityOptions = (cities || []).map((c) => ({ value: c, label: c }))

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div>
        <label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Country</label>
        <Dropdown
          options={COUNTRY_OPTIONS}
          value={country}
          onChange={setCountry}
          placeholder="All Countries"
          className="w-36"
        />
      </div>

      {country && (
        <div>
          <label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">State</label>
          <Dropdown
            options={stateOptions}
            value={state}
            onChange={setState}
            placeholder="All States"
            className="w-40"
          />
        </div>
      )}

      {state && cityOptions.length > 0 && (
        <div>
          <label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">City</label>
          <Dropdown
            options={cityOptions}
            value={city}
            onChange={setCity}
            placeholder="All Cities"
            className="w-36"
          />
        </div>
      )}
    </div>
  )
}
