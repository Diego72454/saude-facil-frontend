import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { IconStethoscope, IconClock, IconCheck, IconX, IconClipboard, IconPhone, IconSettings } from '../components/Icons'
import '../styles/Atendente.css'

function Atendente() {
  const [unidades, setUnidades] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [fichas, setFichas] = useState([])
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('')
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const { usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (usuario?.perfil === 'PACIENTE') {
      navigate('/unidades')
    }
    carregarUnidades()
  }, [])

  async function carregarUnidades() {
    try {
      const resp = await api.get('/api/unidades')
      setUnidades(resp.data)
    } catch (err) {
      console.error('Erro ao carregar unidades', err)
    }
  }

  async function carregarProfissionais(unidadeId) {
    setUnidadeSelecionada(unidadeId)
    setProfissionais([])
    setFichas([])
    setProfissionalSelecionado('')
    try {
      const resp = await api.get(`/api/profissionais/unidade/${unidadeId}`)
      setProfissionais(resp.data)
    } catch (err) {
      console.error('Erro ao carregar profissionais', err)
    }
  }

  async function carregarFichas(profissionalId) {
    setProfissionalSelecionado(profissionalId)
    setCarregando(true)
    try {
      const resp = await api.get(`/api/fichas/hoje/${profissionalId}`)
      setFichas(resp.data)
    } catch (err) {
      console.error('Erro ao carregar fichas', err)
    } finally {
      setCarregando(false)
    }
  }

  async function atualizarStatus(fichaId, status, motivo = null) {
    setErro('')
    setSucesso('')
    try {
      await api.put(`/api/fichas/${fichaId}/status`, { status, motivo })
      setSucesso(`Status atualizado para ${status}!`)
      carregarFichas(profissionalSelecionado)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao atualizar status!')
    }
  }

  function corStatus(status) {
    switch (status) {
      case 'AGUARDANDO': return 'var(--warning)'
      case 'EM_ATENDIMENTO': return 'var(--em-atendimento)'
      case 'CONCLUIDO': return 'var(--primary)'
      case 'CANCELADO': return 'var(--danger)'
      default: return 'var(--gray-500)'
    }
  }

  function iconeStatus(status) {
    switch (status) {
      case 'AGUARDANDO': return <IconClock size={13} />
      case 'EM_ATENDIMENTO': return <IconStethoscope size={13} />
      case 'CONCLUIDO': return <IconCheck size={13} />
      case 'CANCELADO': return <IconX size={13} />
      default: return null
    }
  }

  function textoStatus(status) {
    switch (status) {
      case 'AGUARDANDO': return 'Aguardando'
      case 'EM_ATENDIMENTO': return 'Em atendimento'
      case 'CONCLUIDO': return 'Concluído'
      case 'CANCELADO': return 'Cancelado'
      default: return status
    }
  }

  const aguardando = fichas.filter(f => f.status === 'AGUARDANDO').length
  const emAtendimento = fichas.filter(f => f.status === 'EM_ATENDIMENTO').length
  const concluidos = fichas.filter(f => f.status === 'CONCLUIDO').length
  const cancelados = fichas.filter(f => f.status === 'CANCELADO').length

  return (
    <div className="atendente-container">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-content">
          <h2><IconStethoscope size={22} /> Painel do Atendente</h2>
          <p>Gerencie a fila de atendimento do dia</p>
        </div>
      </div>

      <main className="main-content">
        {sucesso && <div className="sucesso-msg"><IconCheck size={14} /> {sucesso}</div>}
        {erro && <div className="erro-msg"><IconX size={14} /> {erro}</div>}

        <div className="filtros-card">
          <div className="filtro-grupo">
            <label>Unidade</label>
            <select onChange={(e) => carregarProfissionais(e.target.value)}>
              <option value="">Selecione uma unidade</option>
              {unidades.map(u => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>

          <div className="filtro-grupo">
            <label>Profissional</label>
            <select
              onChange={(e) => carregarFichas(e.target.value)}
              disabled={!unidadeSelecionada}
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.especialidade}
                </option>
              ))}
            </select>
          </div>

          {profissionalSelecionado && (
            <button
              className="btn-atualizar"
              onClick={() => carregarFichas(profissionalSelecionado)}
            >
              <IconSettings size={14} /> Atualizar fila
            </button>
          )}
        </div>

        {profissionalSelecionado && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon amarelo"><IconClock size={18} /></div>
              <div className="stat-info">
                <span>Aguardando</span>
                <strong>{aguardando}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon azul"><IconStethoscope size={18} /></div>
              <div className="stat-info">
                <span>Em atendimento</span>
                <strong>{emAtendimento}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon verde"><IconCheck size={18} /></div>
              <div className="stat-info">
                <span>Concluídos</span>
                <strong>{concluidos}</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon vermelho"><IconX size={18} /></div>
              <div className="stat-info">
                <span>Cancelados</span>
                <strong>{cancelados}</strong>
              </div>
            </div>
          </div>
        )}

        {carregando ? (
          <div className="carregando">Carregando fila...</div>
        ) : fichas.length === 0 && profissionalSelecionado ? (
          <div className="vazio">Nenhuma ficha encontrada para hoje.</div>
        ) : (
          <div className="fichas-lista">
            {fichas.map((ficha) => (
              <div key={ficha.id} className={`ficha-card status-${ficha.status.toLowerCase()}`}>
                <div className="ficha-numero-box">
                  <div className="ficha-numero">{ficha.numeroFicha}</div>
                  <div className="ficha-hora">
                    {new Date(ficha.criadoEm).toLocaleTimeString('pt-BR', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="ficha-paciente">
                  <h3>{ficha.usuario.nome}</h3>
                  <p><IconClipboard size={13} /> CPF: {ficha.usuario.cpf}</p>
                  {ficha.usuario.telefone && (
                    <p><IconPhone size={13} /> {ficha.usuario.telefone}</p>
                  )}
                </div>

                <div className="ficha-acoes">
                  <span
                    className="ficha-status"
                    style={{ background: corStatus(ficha.status) }}
                  >
                    {iconeStatus(ficha.status)} {textoStatus(ficha.status)}
                  </span>

                  <div className="botoes-acao">
                    {ficha.status === 'AGUARDANDO' && (
                      <button
                        className="btn-acao chamar"
                        onClick={() => atualizarStatus(ficha.id, 'EM_ATENDIMENTO')}
                      >
                        <IconStethoscope size={14} /> Chamar
                      </button>
                    )}
                    {ficha.status === 'EM_ATENDIMENTO' && (
                      <button
                        className="btn-acao concluir"
                        onClick={() => atualizarStatus(ficha.id, 'CONCLUIDO')}
                      >
                        <IconCheck size={14} /> Concluir
                      </button>
                    )}
                    {(ficha.status === 'AGUARDANDO' || ficha.status === 'EM_ATENDIMENTO') && (
                      <button
                        className="btn-acao cancelar"
                        onClick={() => atualizarStatus(ficha.id, 'CANCELADO', 'Cancelado pelo atendente')}
                      >
                        <IconX size={14} /> Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Atendente