import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Bloqueia o acesso a uma rota antes de renderizar o conteúdo.
 *
 * Uso:
 *  <Route path="/admin" element={
 *    <RotaProtegida perfis={['ADMIN']}>
 *      <Admin />
 *    </RotaProtegida>
 *  } />
 *
 * - Sem "perfis": qualquer usuário logado pode acessar (só bloqueia deslogado).
 * - Com "perfis": só quem tem um dos perfis listados pode acessar.
 */
function RotaProtegida({ children, perfis }) {
  const { usuario } = useAuth()

  // Não está logado -> manda pro login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // Está logado mas não tem o perfil exigido -> manda pra área dele
  if (perfis && !perfis.includes(usuario.perfil)) {
    return <Navigate to="/unidades" replace />
  }

  return children
}

export default RotaProtegida