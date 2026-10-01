import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { IconHospital, IconCalendar, IconClock, IconStethoscope, IconCheck, IconX } from '../components/Icons'
import '../styles/MinhasFichas.css'

function MinhasFichas() {
  const [fichas, setFichas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    carregarFichas()
  }, [])

  async function carregarFichas() {
    try {
      const resposta = await api.get('/api/fichas/minhas')
      setFichas(resposta.data)
    } catch (err) {
      console.error('Erro ao carregar fichas', err)
    } finally {
      setCarregando(false)
    }
  }

  async function cancelarFicha(fichaId) {
    setErro('')
    try {
      await api.delete(`/api/fichas/${fichaId}`)
      carregarFichas()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cancelar ficha!')
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

  return (
    <div className="minhas-fichas-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>Minhas Fichas</h2>
          <p>Acompanhe o status do seu atendimento hoje</p>
        </div>

        {erro && <div className="erro-msg">{erro}</div>}

        {carregando ? (
          <div className="carregando">Carregando fichas...</div>
        ) : fichas.length === 0 ? (
          <div className="vazio">
            <p>Você não possui fichas hoje.</p>
            <button onClick={() => navigate('/unidades')} className="btn-pegar">
              Pegar uma ficha
            </button>
          </div>
        ) : (
          <div className="fichas-lista">
            {fichas.map((ficha) => (
              <div key={ficha.id} className="ficha-card">
                <div className="ficha-numero-box">
                  <div className="ficha-numero">{ficha.numeroFicha}</div>
                  <div className="ficha-numero-label">Sua ficha</div>
                </div>

                <div className="ficha-detalhes">
                  <h3>{ficha.profissional.nome}</h3>
                  <p className="especialidade">{ficha.profissional.especialidade}</p>
                  <p className="unidade"><IconHospital size={13} /> {ficha.unidade.nome}</p>
                  <p className="data"><IconCalendar size={13} /> {ficha.dataEmissao}</p>
                </div>

                <div className="ficha-status-area">
                  <span
                    className="ficha-status"
                    style={{ background: corStatus(ficha.status) }}
                  >
                    {iconeStatus(ficha.status)} {textoStatus(ficha.status)}
                  </span>
                  {ficha.status === 'AGUARDANDO' && (
                    <button
                      className="btn-cancelar"
                      onClick={() => cancelarFicha(ficha.id)}
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

export default MinhasFichas