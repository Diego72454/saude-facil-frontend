import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { IconStethoscope, IconClipboard, IconClock, IconCheck, IconCalendar, IconHospital, IconBolt } from '../components/Icons'
import '../styles/Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const resposta = await api.post('/api/auth/login', { email, senha })
      login(resposta.data)

      if (resposta.data.perfil === 'ADMIN') {
        navigate('/admin')
      } else if (resposta.data.perfil === 'ATENDENTE') {
        navigate('/atendente')
      } else {
        navigate('/unidades')
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'E-mail ou senha inválidos!')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-container">

      {/* Balões flutuantes */}
      <div className="balao balao-1"><IconClipboard size={14} /> Ficha emitida!</div>
      <div className="balao balao-2"><IconClock size={14} /> 3 pessoas na fila</div>
      <div className="balao balao-3"><IconCheck size={14} /> Atendimento concluído</div>
      <div className="balao balao-4"><IconCalendar size={14} /> Consulta agendada</div>
      <div className="balao balao-5"><IconHospital size={14} /> UBS Centro • aberta</div>

      <div className="login-left">
        <div className="login-logo">
          <span className="logo-icone"><IconStethoscope size={22} /></span>
          <span className="logo-nome">Lumen care</span>
        </div>
        <h1>Saúde na palma<br/>da sua mão.</h1>
        <p>Pegue fichas, agende consultas e acompanhe seu atendimento — tudo pelo celular, sem fila.</p>

        <div className="login-features">
          <div className="login-feature">
            <span className="feature-icone"><IconClipboard size={18} /></span>
            <div>
              <strong>Ficha online</strong>
              <span>Sem precisar sair de casa</span>
            </div>
          </div>
          <div className="login-feature">
            <span className="feature-icone"><IconCalendar size={18} /></span>
            <div>
              <strong>Agendamento fácil</strong>
              <span>Escolha data e horário</span>
            </div>
          </div>
          <div className="login-feature">
            <span className="feature-icone"><IconBolt size={18} /></span>
            <div>
              <strong>Tempo real</strong>
              <span>Acompanhe sua posição na fila</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <div className="login-tag">Portal do Paciente</div>
            <h2>Bem-vindo de volta!</h2>
            <p>Entre com sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="campo">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && <div className="erro-msg">{erro}</div>}

            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>

          <div className="login-footer">
            <p>Não tem conta? <Link to="/cadastro">Cadastre-se gratuitamente</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login