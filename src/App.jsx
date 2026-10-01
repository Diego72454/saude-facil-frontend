import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Unidades from './pages/Unidades'
import Profissionais from './pages/Profissionais'
import MinhasFichas from './pages/MinhasFichas'
import MeusAgendamentos from './pages/MeusAgendamentos'
import Admin from './pages/Admin'
import Atendente from './pages/Atendente'
import PaginaNaoEncontrada from './pages/PaginaNaoEncontrada'
import RotaProtegida from './routes/RotaProtegida'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rotas do paciente: só precisa estar logado */}
      <Route path="/unidades" element={
        <RotaProtegida><Unidades /></RotaProtegida>
      } />
      <Route path="/unidades/:unidadeId/profissionais" element={
        <RotaProtegida><Profissionais /></RotaProtegida>
      } />
      <Route path="/minhas-fichas" element={
        <RotaProtegida><MinhasFichas /></RotaProtegida>
      } />
      <Route path="/meus-agendamentos" element={
        <RotaProtegida><MeusAgendamentos /></RotaProtegida>
      } />

      {/* Rotas restritas por perfil */}
      <Route path="/admin" element={
        <RotaProtegida perfis={['ADMIN']}><Admin /></RotaProtegida>
      } />
      <Route path="/atendente" element={
        <RotaProtegida perfis={['ATENDENTE']}><Atendente /></RotaProtegida>
      } />

      {/* Qualquer rota inexistente cai aqui */}
      <Route path="*" element={<PaginaNaoEncontrada />} />
    </Routes>
  )
}

export default App