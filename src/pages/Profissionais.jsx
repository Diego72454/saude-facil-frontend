import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { IconStethoscope, IconClock, IconX } from '../components/Icons'
import '../styles/Profissionais.css'

function Profissionais() {
  const [profissionais, setProfissionais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [fichaEmitida, setFichaEmitida] = useState(null)
  const [erro, setErro] = useState('')
  const { unidadeId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    carregarProfissionais()
  }, [])

  async function carregarProfissionais() {
    try {
      const resposta = await api.get(`/api/profissionais/unidade/${unidadeId}`)
      setProfissionais(resposta.data)
    } catch (err) {
      console.error('Erro ao carregar profissionais', err)
    } finally {
      setCarregando(false)
    }
  }

  async function pegarFicha(profissionalId) {
    setErro('')
    try {
      const resposta = await api.post(`/api/fichas/profissional/${profissionalId}`)
      setFichaEmitida(resposta.data)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao pegar ficha!')
    }
  }

  function fichasRestantes(profissional) {
    return profissional.limiteFichasDia - profissional.fichasEmitidasHoje
  }

  function porcentagem(profissional) {
    return (profissional.fichasEmitidasHoje / profissional.limiteFichasDia) * 100
  }

  return (
    <div className="profissionais-container">
      <Navbar />

      <main className="main-content">
        <button className="btn-voltar" onClick={() => navigate('/unidades')}>
          ← Voltar
        </button>

        <h2>Profissionais disponíveis</h2>
        <p className="subtitulo">Escolha o profissional e pegue sua ficha</p>

        {erro && <div className="erro-msg">{erro}</div>}

        {fichaEmitida && (
          <div className="ticket">
            <div className="ticket-label">
              {fichaEmitida.profissional.nome} · {fichaEmitida.profissional.especialidade}
            </div>
            <div className="ticket-numero">{fichaEmitida.numeroFicha}</div>
            <div className="ticket-divisor"></div>
            <div className="ticket-info">
              Sua ficha foi emitida &nbsp;·&nbsp; Status: <strong>{fichaEmitida.status}</strong>
            </div>
            <button onClick={() => navigate('/minhas-fichas')} className="btn-ver-fichas">
              Ver minhas fichas
            </button>
          </div>
        )}

        {carregando ? (
          <div className="carregando">Carregando profissionais...</div>
        ) : profissionais.length === 0 ? (
          <div className="vazio">Nenhum profissional disponível nesta unidade.</div>
        ) : (
          <div className="profissionais-grid">
            {profissionais.map((prof) => {
              const restantes = fichasRestantes(prof)
              const encerrado = restantes <= 0

              return (
                <div key={prof.id} className={`prof-card ${encerrado ? 'encerrado' : ''}`}>
                  <div className="prof-header">
                    <div className="prof-icon"><IconStethoscope size={22} /></div>
                    <div className="prof-info">
                      <h3>{prof.nome}</h3>
                      <p className="especialidade">{prof.especialidade}</p>
                      <p className="horario">
                        <IconClock size={13} /> {prof.horarioInicio?.slice(0, 5)} às {prof.horarioFim?.slice(0, 5)}
                      </p>
                    </div>
                    {encerrado ? (
                      <span className="badge-encerrado">Encerrado</span>
                    ) : (
                      <span className="badge-disponivel">Disponível</span>
                    )}
                  </div>

                  <div className="fichas-info">
                    <div className="fichas-texto">
                      <span>Fichas disponíveis</span>
                      <span>{restantes}/{prof.limiteFichasDia}</span>
                    </div>
                    <div className="barra-fundo">
                      <div
                        className="barra-preenchida"
                        style={{
                          width: `${porcentagem(prof)}%`,
                          background: encerrado ? 'var(--danger)' : porcentagem(prof) > 70 ? 'var(--warning)' : 'var(--primary)'
                        }}
                      />
                    </div>
                  </div>

                  {encerrado ? (
                    <div className="msg-encerrado">
                      <IconX size={14} /> As fichas para este profissional já foram encerradas hoje.
                    </div>
                  ) : (
                    <button
                      className="btn-pegar-ficha"
                      onClick={() => pegarFicha(prof.id)}
                    >
                      Pegar ficha
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Profissionais