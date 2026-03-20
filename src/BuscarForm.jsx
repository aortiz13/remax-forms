import { useState, useEffect, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://remax-crm-remax-app.jzuuqr.easypanel.host'
const FORM_SECRET = import.meta.env.VITE_FORM_SECRET || 'remax-web-forms-2026'
const REMAX_LOGO = 'https://res.cloudinary.com/dhzmkxbek/image/upload/v1770205777/Globo_REMAX_sin_fondo_PNG_xiqr1a.png'

const COUNTRY_CODES = [
  { code: '56', flag: '🇨🇱', name: 'Chile' },
  { code: '54', flag: '🇦🇷', name: 'Argentina' },
  { code: '591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '55', flag: '🇧🇷', name: 'Brasil' },
  { code: '57', flag: '🇨🇴', name: 'Colombia' },
  { code: '506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '53', flag: '🇨🇺', name: 'Cuba' },
  { code: '593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '504', flag: '🇭🇳', name: 'Honduras' },
  { code: '52', flag: '🇲🇽', name: 'México' },
  { code: '505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '507', flag: '🇵🇦', name: 'Panamá' },
  { code: '595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '51', flag: '🇵🇪', name: 'Perú' },
  { code: '1', flag: '🇵🇷', name: 'Puerto Rico' },
  { code: '1', flag: '🇩🇴', name: 'Rep. Dominicana' },
  { code: '598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '1', flag: '🇺🇸', name: 'Estados Unidos' },
  { code: '1', flag: '🇨🇦', name: 'Canadá' },
  { code: '34', flag: '🇪🇸', name: 'España' },
  { code: '33', flag: '🇫🇷', name: 'Francia' },
  { code: '49', flag: '🇩🇪', name: 'Alemania' },
  { code: '39', flag: '🇮🇹', name: 'Italia' },
  { code: '44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: '351', flag: '🇵🇹', name: 'Portugal' },
  { code: '86', flag: '🇨🇳', name: 'China' },
  { code: '81', flag: '🇯🇵', name: 'Japón' },
  { code: '61', flag: '🇦🇺', name: 'Australia' },
]

const TOTAL_STEPS = 6

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
  { key: 'parking', label: 'Estacionam.', icon: 'parking' },
  { key: 'garden', label: 'Jardín', icon: 'garden' },
  { key: 'pool', label: 'Piscina', icon: 'pool' },
  { key: 'elevator', label: 'Ascensor', icon: 'elevator' },
  { key: 'terrace', label: 'Terraza', icon: 'terrace' },
  { key: 'gym', label: 'Gimnasio', icon: 'gym' },
  { key: 'storage', label: 'Bodega', icon: 'storage' },
  { key: 'security', label: 'Conserje', icon: 'security' },
]

const NUMBER_OPTIONS = ['1', '2', '3', '4', '>4']

// ───── SVG Icons (reused from App) ─────
const ICONS = {
  house: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" /></svg>,
  apartment: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 6h1m4 0h1M9 10h1m4 0h1M9 14h1m4 0h1M9 18h6" /></svg>,
  office: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="16" rx="1" /><path d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2M10 12h4m-2-2v4" /></svg>,
  land: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22L12 2l10 20H2z" /><path d="M7 22l5-10 5 10" /></svg>,
  store: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1.5-5h15L21 9" /><path d="M3 9v12h18V9" /><rect x="9" y="14" width="6" height="7" /><path d="M3 9h18" /></svg>,
  factory: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22V8l7 4V8l7 4V2h6v20H2z" /></svg>,
  farm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 014-4z" /><path d="M12 12v10" /><path d="M8 16c-3 0-6 1-6 3v3h20v-3c0-2-3-3-6-3" /></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  warehouse: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V7l9-5 9 5v14" /><path d="M3 21h18" /><rect x="7" y="12" width="4" height="9" /><rect x="13" y="12" width="4" height="9" /></svg>,
  tree: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8" /><path d="M5 12a7 7 0 0114 0" /><path d="M7 16a5 5 0 0110 0" /></svg>,
  parking: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7h4a3 3 0 010 6H9" /></svg>,
  construction: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20" /><path d="M6 22V6l6-4 6 4v16" /><path d="M10 10h4m-4 4h4" /></svg>,
  other: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>,
  garden: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12" /><path d="M12 12c-4 0-7-3-7-7a7 7 0 017-3" /><path d="M12 12c4 0 7-3 7-7a7 7 0 00-7-3" /><path d="M5 22h14" /></svg>,
  pool: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0" /><path d="M2 22c2-1 4-1 6 0s4 1 6 0 4-1 6 0" /><path d="M8 14V6a2 2 0 114 0v8" /><circle cx="16" cy="8" r="2" /><path d="M16 10v4" /></svg>,
  elevator: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 3v18M8 8l4-4 4 4M8 16l4 4 4-4" /></svg>,
  terrace: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20" /><path d="M5 22V10l7-8 7 8v12" /><path d="M9 22v-6h6v6" /></svg>,
  gym: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20" /><path d="M6 8v8" /><path d="M18 8v8" /><rect x="4" y="9" width="4" height="6" rx="1" /><rect x="16" y="9" width="4" height="6" rx="1" /></svg>,
  storage: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20M2 16h20" /><circle cx="6" cy="7" r="0.5" fill="currentColor" /><circle cx="6" cy="13" r="0.5" fill="currentColor" /><circle cx="6" cy="19" r="0.5" fill="currentColor" /></svg>,
  security: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
  bed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20v8H2z" /><path d="M2 20V4" /><path d="M22 20v-8" /><path d="M2 12V8a2 2 0 012-2h4a2 2 0 012 2v4" /></svg>,
  bath: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z" /><path d="M6 12V5a2 2 0 012-2h1" /><path d="M7 20v2m10-2v2" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></svg>,
}

function Icon({ name, size = 24, className = '' }) {
  return <span className={`icon ${className}`} style={{ width: size, height: size, display: 'inline-flex' }}>{ICONS[name]}</span>
}

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const validatePhone = (p) => /^\d{7,15}$/.test(p.replace(/\D/g, ''))

// ─── Iframe resize hook ─────
function useIframeResize() {
  const ref = useRef(null)
  useEffect(() => {
    const sendHeight = () => {
      if (ref.current) {
        window.parent.postMessage({ type: 'remax-form-height', height: ref.current.scrollHeight + 40 }, '*')
      }
    }
    sendHeight()
    const observer = new MutationObserver(sendHeight)
    if (ref.current) observer.observe(ref.current, { childList: true, subtree: true, attributes: true })
    window.addEventListener('resize', sendHeight)
    return () => { observer.disconnect(); window.removeEventListener('resize', sendHeight) }
  }, [])
  return ref
}

export default function BuscarForm() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const wrapperRef = useIframeResize()

  const [form, setForm] = useState({
    operation_type: '',
    property_type: '',
    max_budget: '',
    zone: '',
    bedrooms: '', bathrooms: '',
    amenities: [],
    first_name: '', last_name: '', email: '', phone: '', observations: '',
  })
  const [phoneCountry, setPhoneCountry] = useState(COUNTRY_CODES[0])

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
    // step 2 (budget) and step 3 (zone) are optional
    if (s === 5) {
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
          form_type: 'comprar',
          ...form,
          phone: `${phoneCountry.code}${form.phone.replace(/\D/g, '')}`,
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
        <div className="form-card success-card">
          <div className="success-icon-wrap"><Icon name="check" size={40} /></div>
          <h2>¡Solicitud enviada con éxito!</h2>
          <p>Te contactaremos a la brevedad con opciones que se ajusten a lo que buscas.</p>
        </div>
      </div>
    )
  }

  const isLastStep = step === TOTAL_STEPS - 1

  return (
    <div className="form-wrapper" ref={wrapperRef}>
      <div className="form-card">
        {/* Progress */}
        <div className="progress-section">
          <p className="progress-label">Paso {step + 1} de {TOTAL_STEPS}</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }}>
              <span className="progress-text">{progressPct}%</span>
            </div>
          </div>
        </div>

        {/* Step 0: Transaction Type */}
        {step === 0 && (
          <div className="step-content">
            <h2 className="step-title">Seleccione el tipo de transacción:</h2>
            <div className="operation-grid">
              {[
                { value: 'Compra', label: 'COMPRA' },
                { value: 'Arriendo', label: 'ARRIENDO' },
              ].map(op => (
                <button key={op.value}
                  className={`operation-btn ${form.operation_type === op.value ? 'selected' : ''}`}
                  onClick={() => set('operation_type')(op.value)}
                >
                  {op.label}
                </button>
              ))}
            </div>
            {errors.operation_type && <div className="field-error center">{errors.operation_type}</div>}
          </div>
        )}

        {/* Step 1: Property Type */}
        {step === 1 && (
          <div className="step-content">
            <h2 className="step-title">Seleccione el tipo de inmueble:</h2>
            <div className="property-grid">
              {PROPERTY_TYPES.map(pt => (
                <button key={pt.value}
                  className={`property-btn ${form.property_type === pt.value ? 'selected' : ''}`}
                  onClick={() => set('property_type')(pt.value)}
                >
                  <Icon name={pt.icon} size={32} />
                  <span>{pt.value.toUpperCase()}</span>
                </button>
              ))}
            </div>
            {errors.property_type && <div className="field-error center">{errors.property_type}</div>}
          </div>
        )}

        {/* Step 2: Max Budget */}
        {step === 2 && (
          <div className="step-content">
            <h2 className="step-title">Seleccione valor máximo de inversión:</h2>
            <div className="field-group">
              <input
                className="field-input"
                type="text"
                placeholder="Ej: 100.000.000 CLP / 5.000 UF"
                value={form.max_budget}
                onChange={set('max_budget')}
              />
            </div>
          </div>
        )}

        {/* Step 3: Zone/Commune */}
        {step === 3 && (
          <div className="step-content">
            <h2 className="step-title">Indique la comuna o zona en la que está interesado:</h2>
            <div className="field-group">
              <input
                className="field-input"
                type="text"
                placeholder="Ej: Providencia, Las Condes..."
                value={form.zone}
                onChange={set('zone')}
              />
              <div className="field-hint">Barrios de su preferencia o cercanía a colegios, fuentes de trabajo, áreas comerciales o cualquier otro punto de referencia.</div>
            </div>
          </div>
        )}

        {/* Step 4: Characteristics */}
        {step === 4 && (
          <div className="step-content">
            <h2 className="step-title">Indique las características adicionales:</h2>

            {/* Bedrooms */}
            <div className="number-row">
              <span className="number-label"><Icon name="bed" size={20} /> Habitaciones:</span>
              <div className="number-options">
                {NUMBER_OPTIONS.map(n => (
                  <button key={`bed-${n}`}
                    className={`number-btn ${form.bedrooms === n ? 'selected' : ''}`}
                    onClick={() => set('bedrooms')(n)}
                  >{n}</button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="number-row">
              <span className="number-label"><Icon name="bath" size={20} /> Baños:</span>
              <div className="number-options">
                {NUMBER_OPTIONS.map(n => (
                  <button key={`bath-${n}`}
                    className={`number-btn ${form.bathrooms === n ? 'selected' : ''}`}
                    onClick={() => set('bathrooms')(n)}
                  >{n}</button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="amenities-section">
              <label className="amenities-label">Características:</label>
              <div className="amenities-grid">
                {AMENITIES.map(a => (
                  <button key={a.key}
                    className={`amenity-btn ${form.amenities.includes(a.key) ? 'selected' : ''}`}
                    onClick={() => toggleAmenity(a.key)}
                  >
                    <Icon name={a.icon} size={40} />
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Contact Info */}
        {step === 5 && (
          <div className="step-content">
            <h2 className="step-title">Datos de contacto</h2>
            <div className="contact-cols">
              <div className="field-group">
                <label>Nombre <span className="required">*</span></label>
                <input className={`field-input ${errors.first_name ? 'error' : ''}`} type="text"
                  placeholder="Nombre" value={form.first_name} onChange={set('first_name')} />
                {errors.first_name && <div className="field-error">{errors.first_name}</div>}
              </div>
              <div className="field-group">
                <label>Apellido</label>
                <input className="field-input" type="text"
                  placeholder="Apellido" value={form.last_name} onChange={set('last_name')} />
              </div>
            </div>
            <div className="contact-cols">
              <div className="field-group">
                <label>Correo electrónico <span className="required">*</span></label>
                <input className={`field-input ${errors.email ? 'error' : ''}`} type="email"
                  placeholder="Correo electrónico" value={form.email} onChange={set('email')} />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
              <div className="field-group">
                <label>Número de teléfono <span className="required">*</span></label>
                <div className="phone-field">
                  <div className="phone-country-select">
                    <select
                      className="country-dropdown"
                      value={`${phoneCountry.flag}|${phoneCountry.code}|${phoneCountry.name}`}
                      onChange={e => {
                        const [flag, code, name] = e.target.value.split('|')
                        setPhoneCountry({ flag, code, name })
                      }}
                    >
                      {COUNTRY_CODES.map((c, i) => (
                        <option key={`${c.code}-${c.flag}-${i}`} value={`${c.flag}|${c.code}|${c.name}`}>
                          {c.flag} +{c.code}
                        </option>
                      ))}
                    </select>
                    <span className="country-display">{phoneCountry.flag} +{phoneCountry.code}</span>
                  </div>
                  <input className={`field-input phone-number ${errors.phone ? 'error' : ''}`}
                    type="tel" placeholder="Número de teléfono" maxLength={15}
                    value={form.phone} onChange={set('phone')} />
                </div>
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
            </div>

            <div className="field-group">
              <label>¿Tienes alguna consulta o comentario adicional?</label>
              <textarea className="field-input textarea" rows={3}
                placeholder="Describe lo que buscas, requisitos especiales, etc."
                value={form.observations} onChange={set('observations')} />
            </div>
          </div>
        )}

        {/* Error */}
        {errors.submit && <div className="submit-error">{errors.submit}</div>}

        {/* Navigation */}
        <div className="nav-buttons">
          {step > 0 && (
            <button className="nav-btn back" onClick={goBack}>ANTERIOR</button>
          )}
          {!isLastStep ? (
            <button className="nav-btn next" onClick={goNext}>SIGUIENTE</button>
          ) : (
            <button className="nav-btn submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <><span className="btn-spinner" /> Enviando...</>
              ) : (
                <><Icon name="send" size={18} /> ENVIAR</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
