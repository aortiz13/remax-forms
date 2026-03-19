import { useState, useEffect, useRef, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://remax-crm-remax-app.jzuuqr.easypanel.host'
const FORM_SECRET = import.meta.env.VITE_FORM_SECRET || 'remax-web-forms-2026'
const REMAX_LOGO = 'https://remax-exclusive.cl/wp-content/uploads/2025/04/LOGO-2025-EXCLUSIVE-GLOBO-DE-LADO.-SF-CREMA-PNG-1024x451.png'

const TOTAL_STEPS = 5

const PROPERTY_TYPES = [
  { value: 'Casa', icon: 'house' },
  { value: 'Departamento', icon: 'apartment' },
  { value: 'Oficina', icon: 'office' },
  { value: 'Sitio', icon: 'land' },
  { value: 'Comercial', icon: 'store' },
  { value: 'Industrial', icon: 'factory' },
  { value: 'Agrícola', icon: 'farm' },
  { value: 'Loteo', icon: 'grid' },
  { value: 'Bodega', icon: 'warehouse' },
  { value: 'Parcela', icon: 'tree' },
  { value: 'Estacionamiento', icon: 'parking' },
  { value: 'Terreno Construcción', icon: 'construction' },
  { value: 'Otro', icon: 'other' },
]

const AMENITIES = [
  { key: 'parking', label: 'Estacionamiento', icon: 'parking' },
  { key: 'garden', label: 'Jardín', icon: 'garden' },
  { key: 'pool', label: 'Piscina', icon: 'pool' },
  { key: 'elevator', label: 'Ascensor', icon: 'elevator' },
  { key: 'terrace', label: 'Terraza', icon: 'terrace' },
  { key: 'gym', label: 'Gimnasio', icon: 'gym' },
  { key: 'storage', label: 'Bodega', icon: 'storage' },
  { key: 'security', label: 'Conserje', icon: 'security' },
]

const NUMBER_OPTIONS = ['1', '2', '3', '4', '>4']

// ───── SVG Icons ─────
const ICONS = {
  house: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg>,
  apartment: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h1m4 0h1M9 10h1m4 0h1M9 14h1m4 0h1M9 18h6"/></svg>,
  office: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="16" rx="1"/><path d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2M10 12h4m-2-2v4"/></svg>,
  land: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22L12 2l10 20H2z"/><path d="M7 22l5-10 5 10"/></svg>,
  store: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9v12h18V9"/><rect x="9" y="14" width="6" height="7"/><path d="M3 9h18"/></svg>,
  factory: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22V8l7 4V8l7 4V2h6v20H2z"/></svg>,
  farm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 014-4z"/><path d="M12 12v10"/><path d="M8 16c-3 0-6 1-6 3v3h20v-3c0-2-3-3-6-3"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  warehouse: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V7l9-5 9 5v14"/><path d="M3 21h18"/><rect x="7" y="12" width="4" height="9"/><rect x="13" y="12" width="4" height="9"/></svg>,
  tree: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8"/><path d="M5 12a7 7 0 0114 0"/><path d="M7 16a5 5 0 0110 0"/></svg>,
  parking: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>,
  construction: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M6 22V6l6-4 6 4v16"/><path d="M10 10h4m-4 4h4"/></svg>,
  other: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  garden: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12c-4 0-7-3-7-7a7 7 0 017-3"/><path d="M12 12c4 0 7-3 7-7a7 7 0 00-7-3"/><path d="M5 22h14"/></svg>,
  pool: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M2 22c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M8 14V6a2 2 0 114 0v8"/><circle cx="16" cy="8" r="2"/><path d="M16 10v4"/></svg>,
  elevator: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M8 8l4-4 4 4M8 16l4 4 4-4"/></svg>,
  terrace: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M5 22V10l7-8 7 8v12"/><path d="M9 22v-6h6v6"/></svg>,
  gym: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M6 8v8"/><path d="M18 8v8"/><rect x="4" y="9" width="4" height="6" rx="1"/><rect x="16" y="9" width="4" height="6" rx="1"/></svg>,
  storage: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20M2 16h20"/><circle cx="6" cy="7" r="0.5" fill="currentColor"/><circle cx="6" cy="13" r="0.5" fill="currentColor"/><circle cx="6" cy="19" r="0.5" fill="currentColor"/></svg>,
  security: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  bed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20v8H2z"/><path d="M2 20V4"/><path d="M22 20v-8"/><path d="M2 12V8a2 2 0 012-2h4a2 2 0 012 2v4"/></svg>,
  bath: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h1"/><path d="M7 20v2m10-2v2"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  chevronLeft: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  chevronRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>,
  mapPin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>,
}

function Icon({ name, size = 24, className = '' }) {
  return <span className={`icon ${className}`} style={{ width: size, height: size, display: 'inline-flex' }}>{ICONS[name]}</span>
}

// ───── Nominatim (OpenStreetMap) ─────
function useNominatim() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  const search = useCallback((query) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query || query.length < 3) { setSuggestions([]); return }
    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},Chile&format=json&limit=5&addressdetails=1&countrycodes=cl`,
          { headers: { 'Accept-Language': 'es' } }
        )
        const data = await res.json()
        setSuggestions(data.map(item => ({
          display: item.display_name,
          main: formatMain(item),
          secondary: formatSecondary(item),
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          commune: extractCommune(item),
          region: extractRegion(item),
        })))
      } catch { setSuggestions([]) }
      setLoading(false)
    }, 350)
  }, [])

  const clear = useCallback(() => { setSuggestions([]); setLoading(false) }, [])
  return { suggestions, loading, search, clear }
}

function formatMain(item) {
  const a = item.address || {}
  const parts = []
  if (a.road) parts.push(a.road)
  if (a.house_number) parts.push(a.house_number)
  return parts.join(' ') || item.display_name.split(',')[0]
}
function formatSecondary(item) {
  const a = item.address || {}
  return [a.suburb || a.neighbourhood, a.city || a.town || a.village, a.state].filter(Boolean).join(', ')
}
function extractCommune(item) {
  const a = item.address || {}
  return a.suburb || a.city_district || a.city || a.town || a.village || ''
}
function extractRegion(item) {
  const a = item.address || {}
  return a.state || a.region || ''
}

// ───── Validations ─────
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function validatePhone(p) { const c = p.replace(/\D/g, ''); return c.length >= 8 && c.length <= 9 }

// ───── iframe auto-resize ─────
function useIframeResize() {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new ResizeObserver(() => {
      if (ref.current) window.parent.postMessage({ type: 'remax-form-resize', height: ref.current.scrollHeight + 40 }, '*')
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return ref
}

// ═══════════════════════════════════
// MAIN APP
// ═══════════════════════════════════
export default function App() {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const wrapperRef = useIframeResize()

  const [form, setForm] = useState({
    operation_type: '',
    property_type: '',
    address: '', commune: '', region: '', latitude: null, longitude: null,
    bedrooms: '', bathrooms: '',
    amenities: [],
    first_name: '', last_name: '', email: '', phone: '', observations: '',
  })

  const set = (field) => (e) => {
    const val = e.target ? e.target.value : e
    setForm(prev => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  function toggleAmenity(key) {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter(a => a !== key)
        : [...prev.amenities, key],
    }))
  }

  function validateStep(s) {
    const err = {}
    if (s === 0 && !form.operation_type) err.operation_type = 'Selecciona una opción'
    if (s === 1 && !form.property_type) err.property_type = 'Selecciona un tipo'
    if (s === 2 && !form.address.trim()) err.address = 'Ingresa la dirección'
    if (s === 4) {
      if (!form.first_name.trim()) err.first_name = 'Requerido'
      if (!form.email.trim()) err.email = 'Requerido'
      else if (!validateEmail(form.email)) err.email = 'Email inválido'
      if (!form.phone.trim()) err.phone = 'Requerido'
      else if (!validatePhone(form.phone)) err.phone = 'Teléfono inválido'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  function goNext() {
    if (!validateStep(step)) return
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
  }
  function goBack() { setStep(s => Math.max(s - 1, 0)) }

  async function handleSubmit() {
    if (!validateStep(step)) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/webhooks/web-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-WF-Secret': FORM_SECRET },
        body: JSON.stringify({
          form_type: 'vender',
          ...form,
          phone: `56${form.phone.replace(/\D/g, '')}`,
          bedrooms: form.bedrooms === '>4' ? 5 : (form.bedrooms ? parseInt(form.bedrooms) : null),
          bathrooms: form.bathrooms === '>4' ? 5 : (form.bathrooms ? parseInt(form.bathrooms) : null),
        }),
      })
      if (!res.ok) throw new Error('Error al enviar')
      setSubmitted(true)
      window.parent.postMessage({ type: 'remax-form-submitted' }, '*')
    } catch {
      setErrors({ submit: 'Hubo un error. Intenta nuevamente.' })
    }
    setSubmitting(false)
  }

  const progressPct = Math.round((step / (TOTAL_STEPS - 1)) * 100)

  if (submitted) {
    return (
      <div className="form-wrapper" ref={wrapperRef}>
        <div className="form-card">
          <Header />
          <div className="success-container">
            <div className="success-icon"><Icon name="check" size={40} /></div>
            <h2 className="success-title">¡Solicitud enviada!</h2>
            <p className="success-message">
              Un agente especializado de RE/MAX Exclusive se pondrá en contacto contigo
              para realizar una valorización detallada de tu propiedad.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-wrapper" ref={wrapperRef}>
      <div className="form-card">
        <Header />

        {/* Progress */}
        <div className="progress-container">
          <div className="progress-text">Paso {step + 1} de {TOTAL_STEPS}</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}>
              <span className="progress-bar-label">{progressPct}%</span>
            </div>
          </div>
        </div>

        <div className="form-body" key={step}>
          {step === 0 && <Step1Operation form={form} set={set} errors={errors} />}
          {step === 1 && <Step2PropertyType form={form} set={set} errors={errors} />}
          {step === 2 && <Step3Location form={form} set={set} setForm={setForm} errors={errors} setErrors={setErrors} />}
          {step === 3 && <Step4Features form={form} set={set} toggleAmenity={toggleAmenity} />}
          {step === 4 && <Step5Contact form={form} set={set} errors={errors} />}

          {errors.submit && (
            <div className="field-error" style={{ justifyContent: 'center', marginTop: 12 }}>
              <Icon name="x" size={14} />{errors.submit}
            </div>
          )}

          <div className="form-actions">
            {step > 0 && (
              <button className="btn btn-secondary" onClick={goBack}>
                <Icon name="chevronLeft" size={16} /> ANTERIOR
              </button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <button className="btn btn-submit" onClick={goNext}>
                SIGUIENTE <Icon name="chevronRight" size={16} />
              </button>
            ) : (
              <button className="btn btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <div className="spinner" /> : <><Icon name="send" size={16} /> ENVIAR</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════
// HEADER
// ═══════════════════════════════════
function Header() {
  return (
    <div className="form-header">
      <img src={REMAX_LOGO} alt="RE/MAX Exclusive" className="form-header-logo" />
      <h1>Te ayudamos</h1>
      <p>Rellena el formulario y te contactaremos</p>
    </div>
  )
}

// ═══════════════════════════════════
// STEP 1: OPERATION TYPE
// ═══════════════════════════════════
function Step1Operation({ form, set, errors }) {
  return (
    <div className="slide-in">
      <h2 className="step-title">¿Qué deseas hacer con tu inmueble? <span className="required">*</span></h2>

      <div className="operation-grid">
        {[{ value: 'Venta', label: 'VENDER', icon: 'house', desc: 'Quiero vender mi propiedad' },
          { value: 'Arriendo', label: 'ARRENDAR', icon: 'apartment', desc: 'Quiero arrendar mi propiedad' }
        ].map(op => (
          <button
            key={op.value}
            className={`operation-card ${form.operation_type === op.value ? 'selected' : ''}`}
            onClick={() => set('operation_type')(op.value)}
          >
            <div className="operation-icon"><Icon name={op.icon} size={36} /></div>
            <div className="operation-label">{op.label}</div>
            <div className="operation-desc">{op.desc}</div>
            {form.operation_type === op.value && <div className="operation-check"><Icon name="check" size={16} /></div>}
          </button>
        ))}
      </div>
      {errors.operation_type && <div className="field-error center">{errors.operation_type}</div>}
    </div>
  )
}

// ═══════════════════════════════════
// STEP 2: PROPERTY TYPE
// ═══════════════════════════════════
function Step2PropertyType({ form, set, errors }) {
  return (
    <div className="slide-in">
      <h2 className="step-title">Seleccione el tipo de inmueble: <span className="required">*</span></h2>

      <div className="property-type-grid">
        {PROPERTY_TYPES.map(pt => (
          <button
            key={pt.value}
            className={`property-type-card ${form.property_type === pt.value ? 'selected' : ''}`}
            onClick={() => set('property_type')(pt.value)}
          >
            <div className="pt-icon"><Icon name={pt.icon} size={28} /></div>
            <div className="pt-label">{pt.value.toUpperCase()}</div>
            {form.property_type === pt.value && <div className="pt-check"><Icon name="check" size={12} /></div>}
          </button>
        ))}
      </div>
      {errors.property_type && <div className="field-error center">{errors.property_type}</div>}
    </div>
  )
}

// ═══════════════════════════════════
// STEP 3: LOCATION + OPENSTREETMAP
// ═══════════════════════════════════
function Step3Location({ form, set, setForm, errors, setErrors }) {
  const { suggestions, loading, search, clear } = useNominatim()
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleAddressChange(e) {
    const val = e.target.value
    setForm(prev => ({ ...prev, address: val, commune: '', region: '', latitude: null, longitude: null }))
    if (errors.address) setErrors(prev => { const n = { ...prev }; delete n.address; return n })
    search(val)
    setShowDropdown(true)
  }

  function selectAddress(s) {
    setForm(prev => ({ ...prev, address: s.main || s.display, commune: s.commune, region: s.region, latitude: s.lat, longitude: s.lon }))
    setShowDropdown(false)
    clear()
  }

  const dynamicLabel = form.operation_type === 'Arriendo'
    ? 'Indique la comuna o zona de la propiedad a arrendar:'
    : 'Indique la comuna o zona de la propiedad a vender:'

  return (
    <div className="slide-in">
      <h2 className="step-title">{dynamicLabel}</h2>

      <div className="field-group">
        <label>Dirección: <span className="required">*</span></label>
        <div className="autocomplete-wrapper" ref={wrapperRef}>
          <div className="input-with-icon">
            <Icon name="mapPin" size={18} className="input-icon" />
            <input className={`field-input with-icon ${errors.address ? 'error' : ''}`}
              placeholder="Calle o Avenida, número" value={form.address}
              onChange={handleAddressChange} autoComplete="off" />
          </div>
          {showDropdown && (suggestions.length > 0 || loading) && (
            <div className="autocomplete-dropdown">
              {loading && <div className="autocomplete-loading">Buscando direcciones...</div>}
              {!loading && suggestions.length === 0 && form.address.length >= 3 && (
                <div className="autocomplete-empty">No se encontraron resultados</div>
              )}
              {suggestions.map((s, i) => (
                <div key={i} className="autocomplete-item" onClick={() => selectAddress(s)}>
                  <Icon name="mapPin" size={16} />
                  <div className="autocomplete-item-text">
                    <div className="autocomplete-item-main">{s.main}</div>
                    <div className="autocomplete-item-sub">{s.secondary}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.address && <div className="field-error">{errors.address}</div>}
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Comuna</label>
          <input className="field-input auto-filled" value={form.commune} readOnly placeholder="Comuna" tabIndex={-1} />
        </div>
        <div className="field-group">
          <label>Región</label>
          <input className="field-input auto-filled" value={form.region} readOnly placeholder="Región" tabIndex={-1} />
        </div>
      </div>

      <div className="field-hint" style={{ marginTop: -8 }}>
        Comienza a escribir la dirección y selecciona de la lista para auto-completar comuna y región.
      </div>
    </div>
  )
}

// ═══════════════════════════════════
// STEP 4: FEATURES
// ═══════════════════════════════════
function Step4Features({ form, set, toggleAmenity }) {
  return (
    <div className="slide-in">
      <h2 className="step-title">Indique las características adicionales:</h2>

      {/* Bedrooms */}
      <div className="feature-row">
        <div className="feature-label"><Icon name="bed" size={22} /> Habitaciones:</div>
        <div className="number-selector">
          {NUMBER_OPTIONS.map(n => (
            <button key={n} className={`number-btn ${form.bedrooms === n ? 'selected' : ''}`}
              onClick={() => set('bedrooms')(n)}>{n}</button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="feature-row">
        <div className="feature-label"><Icon name="bath" size={22} /> Baños:</div>
        <div className="number-selector">
          {NUMBER_OPTIONS.map(n => (
            <button key={n} className={`number-btn ${form.bathrooms === n ? 'selected' : ''}`}
              onClick={() => set('bathrooms')(n)}>{n}</button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="feature-section-label">Características:</div>
      <div className="amenities-grid">
        {AMENITIES.map(am => (
          <button key={am.key} className={`amenity-card ${form.amenities.includes(am.key) ? 'selected' : ''}`}
            onClick={() => toggleAmenity(am.key)}>
            <div className="amenity-icon"><Icon name={am.icon} size={32} /></div>
            <div className="amenity-label">{am.label}</div>
            {form.amenities.includes(am.key) && <div className="amenity-check"><Icon name="check" size={12} /></div>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════
// STEP 5: CONTACT INFO
// ═══════════════════════════════════
function Step5Contact({ form, set, errors }) {
  return (
    <div className="slide-in">
      <h2 className="step-title">Datos de contacto:</h2>

      <div className="field-group">
        <label>Nombre y Apellido <span className="required">*</span></label>
        <div className="field-row">
          <input className={`field-input ${errors.first_name ? 'error' : ''}`} placeholder="Nombre"
            value={form.first_name} onChange={set('first_name')} />
          <input className="field-input" placeholder="Apellido"
            value={form.last_name} onChange={set('last_name')} />
        </div>
        {errors.first_name && <div className="field-error">{errors.first_name}</div>}
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Correo electrónico <span className="required">*</span></label>
          <input className={`field-input ${errors.email ? 'error' : ''}`} type="email"
            placeholder="Correo electrónico" value={form.email} onChange={set('email')} />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className="field-group">
          <label>Número de teléfono <span className="required">*</span></label>
          <div className="phone-field">
            <input className="field-input phone-prefix" value="+56" readOnly tabIndex={-1} />
            <input className={`field-input phone-number ${errors.phone ? 'error' : ''}`}
              type="tel" placeholder="Número de teléfono" maxLength={11}
              value={form.phone} onChange={set('phone')} />
          </div>
          {errors.phone && <div className="field-error">{errors.phone}</div>}
        </div>
      </div>

      <div className="field-group">
        <label>¿Tienes alguna consulta o comentario adicional?</label>
        <textarea className="field-textarea" placeholder="Escriba aquí su consulta..."
          value={form.observations} onChange={set('observations')} />
      </div>
    </div>
  )
}
