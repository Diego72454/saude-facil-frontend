import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconStethoscope, IconHospital, IconClipboard, IconCalendar, IconSettings, IconLogout } from './Icons'
import '../styles/Navbar.css'

function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function ativo(path) {
    return location.pathname === path ? 'ativo' : ''
  }

  const iniciais = usuario?.nome
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="navbar">
      <div className="navbar-content">
        <h1 onClick={() => navigate('/unidades')} className="navbar-logo">
          <IconStethoscope size={20} /> Lumen care
        </h1>

        <nav className="navbar-menu">
          {usuario?.perfil !== 'ADMIN' && (
            <>
              <button className={`nav-btn ${ativo('/unidades')}`} onClick={() => navigate('/unidades')}>
                <IconHospital size={16} /> Unidades
              </button>
              <button className={`nav-btn ${ativo('/minhas-fichas')}`} onClick={() => navigate('/minhas-fichas')}>
                <IconClipboard size={16} /> Minhas Fichas
              </button>
              <button className={`nav-btn ${ativo('/meus-agendamentos')}`} onClick={() => navigate('/meus-agendamentos')}>
                <IconCalendar size={16} /> Agendamentos
              </button>
            </>
          )}
          {usuario?.perfil === 'ADMIN' && (
            <button className={`nav-btn ${ativo('/admin')}`} onClick={() => navigate('/admin')}>
              <IconSettings size={16} /> Painel Admin
            </button>
          )}
          {usuario?.perfil === 'ATENDENTE' && (
            <button className={`nav-btn ${ativo('/atendente')}`} onClick={() => navigate('/atendente')}>
              <IconStethoscope size={16} /> Painel Atendente
            </button>
          )}
        </nav>

        <div className="navbar-usuario">
          <div className="usuario-avatar">{iniciais}</div>
          <span>{usuario?.nome?.split(' ')[0]}</span>
          <button onClick={handleLogout} className="btn-logout"><IconLogout size={14} /> Sair</button>
        </div>
      </div>
    </header>
  )
}

export default Navbar