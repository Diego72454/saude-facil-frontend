import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { IconCalendar, IconHospital, IconClipboard, IconCheck, IconX, IconPlus } from '../components/Icons'
import '../styles/MeusAgendamentos.css'

function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [unidades, setUnidades] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [form, setForm] = useState({
    profissionalId: '',
    data: '',
    horario: '',
    observacao: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const [agResp, unResp] = await Promise.all([
        api.get('/api/agendamentos/meus'),
        api.get('/api/unidades')
      ])
      setAgendamentos(agResp.data)
      setUnidades(unResp.data)
    } catch (err) {
      console.error('Erro ao carregar dados', err)
    } finally {
      setCarregando(false)
    }
  }

  async function carregarProfissionais(unidadeId) {
    try {
      const resposta = await api.get(`/api/profissionais/unidade/${unidadeId}`)
      setProfissionais(resposta.data)
    } catch (err) {
      console.error('Erro ao carregar profissionais', err)
    }
  }

  async function handleAgendar(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await api.post('/api/agendamentos', form)
      setSucesso('Consulta agendada com sucesso!')
      setMostrarForm(false)
      setForm({ profissionalId: '', data: '', horario: '', observacao: '' })
      carregarDados()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao agendar consulta!')
    }
  }

  async function cancelarAgendamento(id) {
    setErro('')
    try {
      await api.delete(`/api/agendamentos/${id}`)
      carregarDados()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cancelar agendamento!')
    }
  }

  function corStatus(status) {
    switch (status) {
      case 'AGENDADO': return 'var(--warning)'
      case 'CONFIRMADO': return 'var(--em-atendimento)'
      case 'CONCLUIDO': return 'var(--primary)'
      case 'CANCELADO': return 'var(--danger)'
      default: return 'var(--gray-500)'
    }
  }

  function iconeStatus(status) {
    switch (status) {
      case 'AGENDADO': return <IconCalendar size={13} />
      case 'CONFIRMADO': return <IconCheck size={13} />
      case 'CONCLUIDO': return <IconCheck size={13} />
      case 'CANCELADO': return <IconX size={13} />
      default: return null
    }
  }

  function textoStatus(status) {
    switch (status) {
      case 'AGENDADO': return 'Agendado'
      case 'CONFIRMADO': return 'Confirmado'
      case 'CONCLUIDO': return 'Concluído'
      case 'CANCELADO': return 'Cancelado'
      default: return status
    }
  }

  return (
    <div className="agendamentos-container">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-content">
          <h2><IconCalendar size={22} /> Meus Agendamentos</h2>
          <p>Gerencie suas consultas agendadas</p>
        </div>
      </div>

      <main className="main-content">
        {sucesso && <div className="sucesso-msg">{sucesso}</div>}
        {erro && <div className="erro-msg">{erro}</div>}

        <div className="agendamentos-header">
          <div className="section-title">Suas consultas</div>
          <button
            className="btn-novo-agendamento"
            onClick={() => setMostrarForm(!mostrarForm)}
          >
            {mostrarForm ? <><IconX size={14} /> Cancelar</> : <><IconPlus size={14} /> Novo agendamento</>}
          </button>
        </div>

        {mostrarForm && (
          <div className="form-agendamento">
            <h3>Agendar nova consulta</h3>
            <form onSubmit={handleAgendar}>
              <div className="form-grid">
                <div className="campo">
                  <label>Unidade</label>
                  <select
                    onChange={(e) => carregarProfissionais(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma unidade</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Profissional</label>
                  <select
                    value={form.profissionalId}
                    onChange={(e) => setForm({ ...form, profissionalId: e.target.value })}
                    required
                  >
                    <option value="">Selecione um profissional</option>
                    {profissionais.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} — {p.especialidade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Data</label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="campo">
                  <label>Horário</label>
                  <input
                    type="time"
                    value={form.horario}
                    onChange={(e) => setForm({ ...form, horario: e.target.value })}
                    required
                  />
                </div>

                <div className="campo campo-full">
                  <label>Observação (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Retorno, exame de rotina..."
                    value={form.observacao}
                    onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Confirmar agendamento
              </button>
            </form>
          </div>
        )}

        {carregando ? (
          <div className="carregando">Carregando agendamentos...</div>
        ) : agendamentos.length === 0 ? (
          <div className="vazio">
            <p>Você não possui agendamentos.</p>
            <button onClick={() => setMostrarForm(true)} className="btn-pegar">
              Agendar consulta
            </button>
          </div>
        ) : (
          <div className="agendamentos-lista">
            {agendamentos.map((ag) => (
              <div key={ag.id} className="agendamento-card">
                <div className="agendamento-data-box">
                  <span className="ag-dia">
                    {new Date(ag.dataConsulta).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="ag-horario">{ag.horario?.slice(0, 5)}</span>
                </div>

                <div className="agendamento-info">
                  <h3>{ag.profissional.nome}</h3>
                  <p className="especialidade">{ag.profissional.especialidade}</p>
                  <p className="unidade"><IconHospital size={13} /> {ag.unidade.nome}</p>
                  {ag.observacao && <p className="observacao"><IconClipboard size={13} /> {ag.observacao}</p>}
                </div>

                <div className="agendamento-status-area">
                  <span
                    className="ag-status"
                    style={{ background: corStatus(ag.status) }}
                  >
                    {iconeStatus(ag.status)} {textoStatus(ag.status)}
                  </span>
                  {ag.status === 'AGENDADO' && (
                    <button
                      className="btn-cancelar"
                      onClick={() => cancelarAgendamento(ag.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MeusAgendamentos