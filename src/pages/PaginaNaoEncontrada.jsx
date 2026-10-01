import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconCompass } from '../components/Icons'
import '../styles/PaginaNaoEncontrada.css'

function PaginaNaoEncontrada() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  function voltarParaInicio() {
    if (!usuario) {
      navigate('/login')
    } else if (usuario.perfil === 'ADMIN') {
      navigate('/admin')
    } else if (usuario.perfil === 'ATENDENTE') {
      navigate('/atendente')
    } else {
      navigate('/unidades')
    }
  }

  return (
    <div className="nf-container">
      <div className="nf-emoji"><IconCompass size={40} /></div>
      <h1 className="nf-codigo">404</h1>
      <h2>Página não encontrada</h2>
      <p>O endereço que você tentou acessar não existe ou foi movido.</p>
      <button className="btn-primary" onClick={voltarParaInicio}>
        Voltar para o início
      </button>
    </div>
  )
}

export default PaginaNaoEncontrada