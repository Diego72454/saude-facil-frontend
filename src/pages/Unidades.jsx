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

  return (
    <div className="unidades-container">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-content">
          <h2><IconHospital size={22} /> Unidades de Saúde</h2>
          <p>Selecione o posto onde deseja ser atendido</p>
        </div>
      </div>

      <main className="main-content">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon verde"><IconHospital size={22} /></div>
            <div className="stat-info">
              <span>Unidades</span>
              <strong>{unidades.length} ativas</strong>
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

        <div className="section-title">Escolha uma unidade</div>

        {carregando ? (
          <div className="carregando">Carregando unidades...</div>
        ) : unidades.length === 0 ? (
          <div className="vazio">Nenhuma unidade disponível no momento.</div>
        ) : (
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
        )}
      </main>
    </div>
  )
}

export default Unidades