import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { IconHospital, IconClipboard, IconBolt, IconMapPin, IconPhone, IconClock, IconCheck, IconArrowRight } from '../components/Icons'
import '../styles/Unidades.css'

function Unidades() {
  const [unidades, setUnidades] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    carregarUnidades()
  }, [])

  async function carregarUnidades() {
    try {
      const resposta = await api.get('/api/unidades')
      setUnidades(resposta.data)
    } catch (err) {
      console.error('Erro ao carregar unidades', err)
    } finally {
      setCarregando(false)
    }
  }

  const unicaUnidade = unidades.length === 1 ? unidades[0] : null

  return (
    <div className="unidades-container">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-content">
          <h2><IconHospital size={22} /> {unicaUnidade ? unicaUnidade.nome : 'Unidades de Saúde'}</h2>
          <p>{unicaUnidade ? 'Sua unidade de atendimento' : 'Selecione o posto onde deseja ser atendido'}</p>
        </div>
      </div>

      <main className="main-content">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon verde"><IconHospital size={22} /></div>
            <div className="stat-info">
              <span>Status</span>
              <strong>{unicaUnidade ? (unicaUnidade.ativa === false ? 'Fechada' : 'Aberta') : `${unidades.length} ativas`}</strong>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon azul"><IconClipboard size={22} /></div>
            <div className="stat-info">
              <span>Sistema</span>
              <strong>Online agora</strong>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon roxo"><IconBolt size={22} /></div>
            <div className="stat-info">
              <span>Ficha digital</span>
              <strong>Sem fila física</strong>
            </div>
          </div>
        </div>

        {carregando ? (
          <div className="carregando">Carregando unidade...</div>
        ) : unidades.length === 0 ? (
          <div className="vazio">Nenhuma unidade disponível no momento.</div>
        ) : unicaUnidade ? (
          <div className="unidade-hero">
            <div className="unidade-hero-icon"><IconHospital size={32} /></div>
            <h3>{unicaUnidade.nome}</h3>
            <div className="unidade-hero-meta">
              <span><IconMapPin size={14} /> {unicaUnidade.endereco}</span>
              {unicaUnidade.telefone && <span><IconPhone size={14} /> {unicaUnidade.telefone}</span>}
              <span><IconClock size={14} /> {unicaUnidade.horarioAbertura?.slice(0, 5)} às {unicaUnidade.horarioFechamento?.slice(0, 5)}</span>
            </div>
            <span className="unidade-hero-badge"><IconCheck size={13} /> Aberta</span>
            <button
              className="btn-ver-profissionais"
              onClick={() => navigate(`/unidades/${unicaUnidade.id}/profissionais`)}
            >
              Ver profissionais disponíveis <IconArrowRight size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="section-title">Escolha uma unidade</div>
            <div className="unidades-grid">
              {unidades.map((unidade) => (
                <div
                  key={unidade.id}
                  className="unidade-card"
                  onClick={() => navigate(`/unidades/${unidade.id}/profissionais`)}
                >
                  <div className="unidade-icon"><IconHospital size={24} /></div>
                  <div className="unidade-info">
                    <h3>{unidade.nome}</h3>
                    <div className="unidade-meta">
                      <span><IconMapPin size={13} /> {unidade.endereco}</span>
                      {unidade.telefone && <span><IconPhone size={13} /> {unidade.telefone}</span>}
                      <span><IconClock size={13} /> {unidade.horarioAbertura?.slice(0, 5)} às {unidade.horarioFechamento?.slice(0, 5)}</span>
                    </div>
                  </div>
                  <span className="unidade-badge"><IconCheck size={13} /> Aberta</span>
                  <div className="unidade-arrow"><IconArrowRight size={18} /></div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Unidades