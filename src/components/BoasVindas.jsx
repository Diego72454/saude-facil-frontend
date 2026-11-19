import { Link } from 'react-router-dom'
import { IconStethoscope, IconHospital } from './Icons'
import '../styles/BoasVindas.css'

// Tela de boas-vindas que aparece só no celular, antes do formulário de login.
function BoasVindas({ onEntrar }) {
  return (
    <section className="bv">
      <div className="bv-logo">
        <span className="bv-logo-icone"><IconStethoscope size={20} /></span>
        <span className="bv-logo-nome">Mais Saúde</span>
      </div>

      <div className="bv-palco" aria-hidden="true">
        <div className="bv-ficha-fundo" />
        <div className="bv-ficha">
          <div className="bv-ficha-topo">
            <span className="bv-unidade"><IconHospital size={15} /> UBS Centro</span>
            <span className="bv-codigo">A-042</span>
          </div>
          <div className="bv-perfuracao" />
          <div className="bv-ficha-base">
            <span className="bv-ponto" />
            <div>
              <strong>3 pessoas na sua frente</strong>
              <span>Sua vez em cerca de 12 min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bv-texto">
        <h1>Pegue sua ficha pelo celular.</h1>
        <p>Agende consultas e acompanhe sua vez em tempo real, sem pegar fila.</p>
      </div>

      <div className="bv-acoes">
        <button type="button" className="bv-btn-entrar" onClick={onEntrar}>
          Entrar
        </button>
        <p className="bv-cadastro">
          Primeira vez aqui? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </section>
  )
}

export default BoasVindas