import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { IconSettings, IconHospital, IconStethoscope, IconMapPin, IconClock, IconPhone, IconClipboard, IconCheck, IconX, IconPlus } from '../components/Icons'
import '../styles/Admin.css'

function Admin() {
  const [aba, setAba] = useState('unidades')
  const [unidades, setUnidades] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarFormUnidade, setMostrarFormUnidade] = useState(false)
  const [mostrarFormProfissional, setMostrarFormProfissional] = useState(false)
  const [formUnidade, setFormUnidade] = useState({
    nome: '', endereco: '', telefone: '',
    horarioAbertura: '', horarioFechamento: ''
  })
  const [formProfissional, setFormProfissional] = useState({
    nome: '', especialidade: '', 
    prefixoFicha: '', limiteFichasDia: '',
    horarioInicio: '', horarioFim: '',
    diasAtendimento: '', unidadeId: ''
  })

  const { usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (usuario?.perfil !== 'ADMIN') {
      navigate('/unidades')
    }
    carregarDados()
  }, [])

  async function carregarDados() {
    setCarregando(true)
    try {
      const [unResp] = await Promise.all([
        api.get('/api/unidades')
      ])
      setUnidades(unResp.data)
    } catch (err) {
      console.error('Erro ao carregar dados', err)
    } finally {
      setCarregando(false)
    }
  }

  async function carregarProfissionais(unidadeId) {
    try {
      const resp = await api.get(`/api/profissionais/unidade/${unidadeId}`)
      setProfissionais(resp.data)
    } catch (err) {
      console.error('Erro ao carregar profissionais', err)
    }
  }

  async function salvarUnidade(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await api.post('/api/unidades', formUnidade)
      setSucesso('Unidade cadastrada com sucesso!')
      setMostrarFormUnidade(false)
      setFormUnidade({ nome: '', endereco: '', telefone: '', horarioAbertura: '', horarioFechamento: '' })
      carregarDados()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar unidade!')
    }
  }

  async function salvarProfissional(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await api.post(`/api/profissionais/unidade/${formProfissional.unidadeId}`, formProfissional)
      setSucesso('Profissional cadastrado com sucesso!')
      setMostrarFormProfissional(false)
      setFormProfissional({
        nome: '', especialidade: '', 
        prefixoFicha: '', limiteFichasDia: '',
        horarioInicio: '', horarioFim: '',
        diasAtendimento: '', unidadeId: ''
      })
      if (formProfissional.unidadeId) {
        carregarProfissionais(formProfissional.unidadeId)
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar profissional!')
    }
  }

  async function ativarDesativarUnidade(id) {
    try {
      await api.patch(`/api/unidades/${id}/status`)
      carregarDados()
    } catch (err) {
      setErro('Erro ao atualizar unidade!')
    }
  }

  async function ativarDesativarProfissional(id, unidadeId) {
    try {
      await api.patch(`/api/profissionais/${id}/status`)
      carregarProfissionais(unidadeId)
    } catch (err) {
      setErro('Erro ao atualizar profissional!')
    }
  }

  return (
    <div className="admin-container">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-content">
          <h2><IconSettings size={22} /> Painel Administrativo</h2>
          <p>Gerencie unidades, profissionais e usuários do sistema</p>
        </div>
      </div>

      <main className="main-content">
        {sucesso && <div className="sucesso-msg"> {sucesso}</div>}
        {erro && <div className="erro-msg">{erro}</div>}

        <div className="admin-tabs">
          <button
            className={`admin-tab ${aba === 'unidades' ? 'ativo' : ''}`}
            onClick={() => setAba('unidades')}
          >
            <IconHospital size={16} /> Unidades
          </button>
          <button
            className={`admin-tab ${aba === 'profissionais' ? 'ativo' : ''}`}
            onClick={() => setAba('profissionais')}
          >
            <IconStethoscope size={16} /> Profissionais
          </button>
        </div>

        {/* ABA UNIDADES */}
        {aba === 'unidades' && (
          <div className="aba-content">
            <div className="aba-header">
              <div className="section-title">Unidades cadastradas</div>
              <button
                className="btn-novo"
                onClick={() => setMostrarFormUnidade(!mostrarFormUnidade)}
              >
                {mostrarFormUnidade ? <><IconX size={14} /> Cancelar</> : <><IconPlus size={14} /> Nova unidade</>}
              </button>
            </div>

            {mostrarFormUnidade && (
              <div className="form-card">
                <h3>Cadastrar nova unidade</h3>
                <form onSubmit={salvarUnidade}>
                  <div className="form-grid">
                    <div className="campo campo-full">
                      <label>Nome da unidade</label>
                      <input
                        type="text"
                        placeholder="Ex: UBS Centro"
                        value={formUnidade.nome}
                        onChange={(e) => setFormUnidade({ ...formUnidade, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div className="campo campo-full">
                      <label>Endereço</label>
                      <input
                        type="text"
                        placeholder="Ex: Rua Principal, 123 - Centro"
                        value={formUnidade.endereco}
                        onChange={(e) => setFormUnidade({ ...formUnidade, endereco: e.target.value })}
                        required
                      />
                    </div>
                    <div className="campo">
                      <label>Telefone</label>
                      <input
                        type="text"
                        placeholder="87999999999"
                        value={formUnidade.telefone}
                        onChange={(e) => setFormUnidade({ ...formUnidade, telefone: e.target.value })}
                      />
                    </div>
                    <div className="campo">
                      <label>Horário de abertura</label>
                      <input
                        type="time"
                        value={formUnidade.horarioAbertura}
                        onChange={(e) => setFormUnidade({ ...formUnidade, horarioAbertura: e.target.value })}
                        required
                      />
                    </div>
                    <div className="campo">
                      <label>Horário de fechamento</label>
                      <input
                        type="time"
                        value={formUnidade.horarioFechamento}
                        onChange={(e) => setFormUnidade({ ...formUnidade, horarioFechamento: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">
                    Salvar unidade
                  </button>
                </form>
              </div>
            )}

            {carregando ? (
              <div className="carregando">Carregando...</div>
            ) : (
              <div className="lista">
                {unidades.map((u) => (
                  <div key={u.id} className="item-card">
                    <div className="item-icon"><IconHospital size={22} /></div>
                    <div className="item-info">
                      <h3>{u.nome}</h3>
                      <p><IconMapPin size={13} /> {u.endereco}</p>
                      <p><IconClock size={13} /> {u.horarioAbertura?.slice(0,5)} às {u.horarioFechamento?.slice(0,5)}</p>
                      {u.telefone && <p><IconPhone size={13} /> {u.telefone}</p>}
                    </div>
                    <div className="item-actions">
                      <span className={`status-badge ${u.ativa ? 'ativo' : 'inativo'}`}>
                        {u.ativa ? <><IconCheck size={12} /> Ativa</> : <><IconX size={12} /> Inativa</>}
                      </span>
                      <button
                        className={`btn-toggle ${u.ativa ? 'desativar' : 'ativar'}`}
                        onClick={() => ativarDesativarUnidade(u.id)}
                      >
                        {u.ativa ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA PROFISSIONAIS */}
        {aba === 'profissionais' && (
          <div className="aba-content">
            <div className="aba-header">
              <div className="section-title">Profissionais cadastrados</div>
              <button
                className="btn-novo"
                onClick={() => setMostrarFormProfissional(!mostrarFormProfissional)}
              >
                {mostrarFormProfissional ? <><IconX size={14} /> Cancelar</> : <><IconPlus size={14} /> Novo profissional</>}
              </button>
            </div>

            {mostrarFormProfissional && (
              <div className="form-card">
                <h3>Cadastrar novo profissional</h3>
                <form onSubmit={salvarProfissional}>
                  <div className="form-grid">
                    <div className="campo">
                      <label>Unidade</label>
                      <select
                        value={formProfissional.unidadeId}
                        onChange={(e) => setFormProfissional({ ...formProfissional, unidadeId: e.target.value })}
                        required
                      >
                        <option value="">Selecione uma unidade</option>
                        {unidades.map(u => (
                          <option key={u.id} value={u.id}>{u.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="campo">
                      <label>Nome completo</label>
                      <input
                        type="text"
                        placeholder="Dr. João Silva"
                        value={formProfissional.nome}
                        onChange={(e) => setFormProfissional({ ...formProfissional, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div className="campo">
                      <label>Especialidade</label>
                      <select
                        value={formProfissional.especialidade}
                        onChange={(e) => setFormProfissional({ ...formProfissional, especialidade: e.target.value })}
                        required
                      >
                        <option value="">Selecione</option>
                        <option>Clínico Geral</option>
                        <option>Pediatra</option>
                        <option>Dentista</option>
                        <option>Ginecologista</option>
                        <option>Enfermeiro</option>
                        <option>Nutricionista</option>
                        <option>Fisioterapeuta</option>
                        <option>Agente de saúde</option>

                      </select>
                    </div>
                   
                    <div className="campo">
                      <label>Prefixo da ficha</label>
                      <input
                        type="text"
                        placeholder="Ex: CG, DT, PD"
                        maxLength={3}
                        value={formProfissional.prefixoFicha}
                        onChange={(e) => setFormProfissional({ ...formProfissional, prefixoFicha: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                    <div className="campo">
                      <label>Limite de fichas por dia</label>
                      <input
                        type="number"
                        placeholder="Ex: 20"
                        value={formProfissional.limiteFichasDia}
                        onChange={(e) => setFormProfissional({ ...formProfissional, limiteFichasDia: e.target.value })}
                        required
                      />
                    </div>
                    <div className="campo">
                      <label>Horário de início</label>
                      <input
                        type="time"
                        value={formProfissional.horarioInicio}
                        onChange={(e) => setFormProfissional({ ...formProfissional, horarioInicio: e.target.value })}
                        required
                      />
                    </div>
                    <div className="campo">
                      <label>Horário de fim</label>
                      <input
                        type="time"
                        value={formProfissional.horarioFim}
                        onChange={(e) => setFormProfissional({ ...formProfissional, horarioFim: e.target.value })}
                        required
                      />
                    </div>
                    <div className="campo campo-full">
                      <label>Dias de atendimento</label>
                      <input
                        type="text"
                        placeholder="Ex: SEG,TER,QUA,QUI,SEX"
                        value={formProfissional.diasAtendimento}
                        onChange={(e) => setFormProfissional({ ...formProfissional, diasAtendimento: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">
                    Salvar profissional
                  </button>
                </form>
              </div>
            )}

            <div className="filtro-unidade">
              <label>Filtrar por unidade:</label>
              <select onChange={(e) => carregarProfissionais(e.target.value)}>
                <option value="">Selecione uma unidade</option>
                {unidades.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>

            <div className="lista">
              {profissionais.length === 0 ? (
                <div className="vazio">Selecione uma unidade para ver os profissionais.</div>
              ) : profissionais.map((p) => (
                <div key={p.id} className="item-card">
                  <div className="item-icon"><IconStethoscope size={22} /></div>
                  <div className="item-info">
                    <h3>{p.nome}</h3>
                    <p><IconStethoscope size={13} /> {p.especialidade}</p>
                    <p><IconClipboard size={13} /> Prefixo: {p.prefixoFicha} · Limite: {p.limiteFichasDia} fichas/dia</p>
                    <p><IconClock size={13} /> {p.horarioInicio?.slice(0,5)} às {p.horarioFim?.slice(0,5)} · {p.diasAtendimento}</p>
                  </div>
                  <div className="item-actions">
                    <span className={`status-badge ${p.ativo ? 'ativo' : 'inativo'}`}>
                      {p.ativo ? <><IconCheck size={12} /> Ativo</> : <><IconX size={12} /> Inativo</>}
                    </span>
                    <button
                      className={`btn-toggle ${p.ativo ? 'desativar' : 'ativar'}`}
                      onClick={() => ativarDesativarProfissional(p.id, p.unidade.id)}
                    >
                      {p.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Admin