import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://remax-crm-remax-app.jzuuqr.easypanel.host'
const REMAX_LOGO = 'https://res.cloudinary.com/dhzmkxbek/image/upload/v1770205777/Globo_REMAX_sin_fondo_PNG_xiqr1a.png'

export default function LeadPage() {
  const { shortId } = useParams()
  const [data, setData] = useState(null)
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [assigned, setAssigned] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/webhooks/web-forms/lead/${shortId}`).then(r => r.json()),
      fetch(`${API_URL}/api/webhooks/web-forms/agents`).then(r => r.json()),
    ]).then(([leadData, agentsData]) => {
      if (leadData.error) { setError(leadData.error); setLoading(false); return }
      setData(leadData)
      setAgents(agentsData.agents || [])
      if (leadData.lead?.assigned) setAssigned(true)
      setLoading(false)
    }).catch(err => { setError(err.message); setLoading(false) })
  }, [shortId])

  async function handleAssign() {
    if (!selectedAgent) return
    const agent = agents.find(a => a.id === selectedAgent)
    if (!agent) return

    setAssigning(true)
    try {
      const res = await fetch(`${API_URL}/api/webhooks/web-forms/lead/${shortId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentEmail: agent.email, agentId: agent.id }),
      })
      const result = await res.json()
      if (result.success) {
        setAssigned(true)
        setData(prev => ({
          ...prev,
          lead: { ...prev.lead, assigned: { name: agent.name, email: agent.email } },
        }))
      } else {
        setError(result.error)
      }
    } catch (err) { setError(err.message) }
    setAssigning(false)
  }

  if (loading) return (
    <div className="lead-page">
      <div className="lead-loading">
        <div className="spinner-lg" />
        <p>Cargando datos del lead...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="lead-page">
      <div className="lead-error">
        <div className="lead-error-icon">✕</div>
        <h2>Lead no encontrado</h2>
        <p>{error}</p>
      </div>
    </div>
  )

  const { lead, contact, property } = data
  const createdDate = new Date(lead.createdAt).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="lead-page">
      {/* Header */}
      <div className="lead-header">
        <img src={REMAX_LOGO} alt="RE/MAX Exclusive" className="lead-logo" />
        <div className="lead-header-info">
          <h1>Detalle del Lead</h1>
          <div className="lead-meta">
            <span className="lead-id">{lead.shortId}</span>
            <span className="lead-date">{createdDate}</span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      {assigned && lead.assigned && (
        <div className="lead-assigned-banner">
          <span className="assigned-icon">✓</span>
          Lead derivado a <strong>{lead.assigned.name}</strong>
          <span className="assigned-email">({lead.assigned.email})</span>
        </div>
      )}

      {/* Contact Card */}
      {contact && (
        <div className="lead-card">
          <div className="lead-card-header">
            <span className="lead-card-icon">👤</span>
            <h2>Datos de Contacto</h2>
          </div>
          <div className="lead-card-body">
            <div className="lead-field">
              <label>Nombre</label>
              <span>{contact.first_name} {contact.last_name}</span>
            </div>
            {contact.email && (
              <div className="lead-field">
                <label>Email</label>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            )}
            {contact.phone && (
              <div className="lead-field">
                <label>Teléfono</label>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>
            )}
            {contact.need && (
              <div className="lead-field">
                <label>Necesidad</label>
                <span className="lead-badge">{contact.need}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property Card */}
      {property && (
        <div className="lead-card">
          <div className="lead-card-header">
            <span className="lead-card-icon">🏠</span>
            <h2>Datos de la Propiedad</h2>
          </div>
          <div className="lead-card-body">
            {property.operation_type && (
              <div className="lead-field">
                <label>Operación</label>
                <span className="lead-badge accent">{property.operation_type}</span>
              </div>
            )}
            {property.property_type && (
              <div className="lead-field">
                <label>Tipo</label>
                <span>{property.property_type}</span>
              </div>
            )}
            {property.address && (
              <div className="lead-field">
                <label>Dirección</label>
                <span>{property.address}</span>
              </div>
            )}
            {property.commune && (
              <div className="lead-field">
                <label>Comuna</label>
                <span>{property.commune}</span>
              </div>
            )}
            <div className="lead-field-row">
              {property.bedrooms && (
                <div className="lead-field compact">
                  <label>Hab.</label>
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="lead-field compact">
                  <label>Baños</label>
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.m2_total && (
                <div className="lead-field compact">
                  <label>m² Total</label>
                  <span>{property.m2_total}</span>
                </div>
              )}
              {property.parking_spaces && (
                <div className="lead-field compact">
                  <label>Estac.</label>
                  <span>{property.parking_spaces}</span>
                </div>
              )}
            </div>
            {property.notes && (
              <div className="lead-field">
                <label>Observaciones</label>
                <span className="lead-notes">{property.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment Section */}
      {!assigned && (
        <div className="lead-card assign-card">
          <div className="lead-card-header">
            <span className="lead-card-icon">📤</span>
            <h2>Derivar Lead</h2>
          </div>
          <div className="lead-card-body">
            <p className="assign-desc">Selecciona un agente para derivar este lead:</p>
            <select
              className="assign-select"
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
            >
              <option value="">— Seleccionar agente —</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <button
              className="assign-btn"
              disabled={!selectedAgent || assigning}
              onClick={handleAssign}
            >
              {assigning ? (
                <><div className="spinner" /> Derivando...</>
              ) : (
                '📤 Derivar Lead'
              )}
            </button>
          </div>
        </div>
      )}
      {/* CRM Access Button — shown when assigned */}
      {assigned && contact && (
        <a
          href={`https://solicitudes.remax-exclusive.cl/crm?contact=${contact.id}`}
          className="crm-access-btn"
          target="_blank"
          rel="noopener"
        >
          🔗 Ver Lead en el CRM
        </a>
      )}

    </div>
  )
}
