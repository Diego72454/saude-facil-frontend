import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { IconStethoscope } from '../components/Icons'
import '../styles/Cadastro.css'

function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    telefone: '',
    numeroProntuario: '',
    dataNascimento: ''
  })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      await api.post('/api/auth/register', form)
      setSucesso('Cadastro realizado com sucesso!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar!')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <div className="cadastro-header">
          <h1><IconStethoscope size={22} /> Lumen care</h1>
          <p>Crie sua conta para acessar o sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="campo">
            <label>Nome completo</label>
            <input
              type="text"
              name="nome"
              placeholder="João Silva"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              placeholder="00000000000"
              value={form.cpf}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="••••••••"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="87999999999"
              value={form.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Número do prontuário (opcional)</label>
            <input
              type="text"
              name="numeroProntuario"
              placeholder="Se já tiver um, informe aqui"
              value={form.numeroProntuario}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Data de nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={form.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>

          {erro && <div className="erro-msg">{erro}</div>}
          {sucesso && <div className="sucesso-msg">{sucesso}</div>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="cadastro-footer">
          <p>Já tem conta? <Link to="/login">Fazer login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Cadastro