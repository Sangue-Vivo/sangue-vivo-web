import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Clock,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Save,
  Phone,
  MapPin,
  X,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'

interface BloodCenter {
  id: string
  name: string
  address: string
  phone: string
}

const initialCenters: BloodCenter[] = [
  {
    id: 'hc-1',
    name: 'Hemoal Maceio',
    address: 'Av. Jorge de Lima, 58 - Trapiche da Barra, Maceio - AL',
    phone: '(82) 3315-2102',
  },
  {
    id: 'hc-2',
    name: 'Hemoal Arapiraca',
    address: 'Rua Samaritana, 1.115 - Primavera, Arapiraca - AL',
    phone: '(82) 3522-1974',
  },
]

const initialUniversities = [
  'UFAL - Universidade Federal de Alagoas',
  'CESMAC - Centro Universitario CESMAC',
  'UNIT - Universidade Tiradentes',
  'FITS - Faculdade Integrada Tiradentes',
  'UNINASSAU - Centro Universitario Mauricio de Nassau',
  'UNEAL - Universidade Estadual de Alagoas',
  'IFAL - Instituto Federal de Alagoas',
  'Estacio de Sa - Alagoas',
  'UNIFAL - Centro Universitario de Maceio',
]

export default function AdminSettings() {
  // Blood Centers
  const [centers, setCenters] = useState<BloodCenter[]>(initialCenters)
  const [showCenterModal, setShowCenterModal] = useState(false)
  const [editingCenter, setEditingCenter] = useState<BloodCenter | null>(null)
  const [centerForm, setCenterForm] = useState({ name: '', address: '', phone: '' })
  const [deleteCenterConfirm, setDeleteCenterConfirm] = useState<string | null>(null)

  // Donation Intervals
  const [maleInterval, setMaleInterval] = useState(60)
  const [femaleInterval, setFemaleInterval] = useState(90)
  const [intervalsEditing, setIntervalsEditing] = useState(false)


  // Universities
  const [universities, setUniversities] = useState(initialUniversities)
  const [newUni, setNewUni] = useState('')
  const [showUniInput, setShowUniInput] = useState(false)

  // Blood Center handlers
  const openCreateCenter = () => {
    setEditingCenter(null)
    setCenterForm({ name: '', address: '', phone: '' })
    setShowCenterModal(true)
  }

  const openEditCenter = (center: BloodCenter) => {
    setEditingCenter(center)
    setCenterForm({ name: center.name, address: center.address, phone: center.phone })
    setShowCenterModal(true)
  }

  const handleSaveCenter = () => {
    if (!centerForm.name) return
    if (editingCenter) {
      setCenters((prev) =>
        prev.map((c) =>
          c.id === editingCenter.id
            ? { ...c, ...centerForm }
            : c
        )
      )
    } else {
      setCenters((prev) => [
        ...prev,
        { id: `hc-${Date.now()}`, ...centerForm },
      ])
    }
    setShowCenterModal(false)
  }

  const handleDeleteCenter = (id: string) => {
    setCenters((prev) => prev.filter((c) => c.id !== id))
    setDeleteCenterConfirm(null)
  }

  // University handlers
  const addUniversity = () => {
    if (newUni.trim() && !universities.includes(newUni.trim())) {
      setUniversities((prev) => [...prev, newUni.trim()])
      setNewUni('')
      setShowUniInput(false)
    }
  }

  const removeUniversity = (uni: string) => {
    setUniversities((prev) => prev.filter((u) => u !== uni))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-jakarta text-2xl font-bold text-gray-900">
          Configuracoes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie as configuracoes da plataforma Sangue Vivo
        </p>
      </motion.div>

      {/* 1. Hemocentros */}
      <motion.div
        className="rounded-2xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-red-500" />
            <h2 className="font-jakarta text-lg font-bold text-gray-900">Hemocentros</h2>
          </div>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreateCenter}>
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {centers.map((center) => (
            <div
              key={center.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{center.name}</p>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {center.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {center.phone}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditCenter(center)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteCenterConfirm(center.id)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {centers.length === 0 && (
            <p className="py-8 text-center text-gray-400">Nenhum hemocentro cadastrado.</p>
          )}
        </div>
      </motion.div>

      {/* 2. Intervalos de Doacao */}
      <motion.div
        className="rounded-2xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h2 className="font-jakarta text-lg font-bold text-gray-900">
              Intervalos de Doacao
            </h2>
          </div>
          {!intervalsEditing ? (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Pencil className="h-4 w-4" />}
              onClick={() => setIntervalsEditing(true)}
            >
              Editar
            </Button>
          ) : (
            <Button
              size="sm"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={() => setIntervalsEditing(false)}
            >
              Salvar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-500">Masculino</p>
            {intervalsEditing ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  value={maleInterval}
                  onChange={(e) => setMaleInterval(Number(e.target.value))}
                  className="w-24 rounded-lg border border-gray-200 px-3 py-1.5 text-lg font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <span className="text-sm text-gray-500">dias</span>
              </div>
            ) : (
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {maleInterval} <span className="text-sm font-normal text-gray-400">dias</span>
              </p>
            )}
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-500">Feminino</p>
            {intervalsEditing ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  value={femaleInterval}
                  onChange={(e) => setFemaleInterval(Number(e.target.value))}
                  className="w-24 rounded-lg border border-gray-200 px-3 py-1.5 text-lg font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <span className="text-sm text-gray-500">dias</span>
              </div>
            ) : (
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {femaleInterval} <span className="text-sm font-normal text-gray-400">dias</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* 3. Universidades Cadastradas */}
      <motion.div
        className="rounded-2xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-500" />
            <h2 className="font-jakarta text-lg font-bold text-gray-900">
              Universidades Cadastradas
            </h2>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
              {universities.length}
            </span>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowUniInput(true)}
          >
            Adicionar
          </Button>
        </div>

        {showUniInput && (
          <div className="mb-4 flex items-end gap-3">
            <div className="flex-1">
              <Input
                label="Nova Universidade"
                value={newUni}
                onChange={(e) => setNewUni(e.target.value)}
                placeholder="Nome da universidade"
              />
            </div>
            <Button size="sm" onClick={addUniversity}>
              Adicionar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowUniInput(false); setNewUni('') }}>
              Cancelar
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {universities.map((uni) => (
            <div
              key={uni}
              className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50"
            >
              <span>{uni}</span>
              <button
                onClick={() => removeUniversity(uni)}
                className="rounded-full p-0.5 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Center Create/Edit Modal */}
      <Modal
        isOpen={showCenterModal}
        onClose={() => setShowCenterModal(false)}
        title={editingCenter ? 'Editar Hemocentro' : 'Novo Hemocentro'}
      >
        <div className="space-y-4">
          <Input
            label="Nome"
            value={centerForm.name}
            onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
            placeholder="Nome do hemocentro"
          />
          <Input
            label="Endereco"
            value={centerForm.address}
            onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
            placeholder="Endereco completo"
          />
          <Input
            label="Telefone"
            value={centerForm.phone}
            onChange={(e) => setCenterForm({ ...centerForm, phone: e.target.value })}
            placeholder="(82) 0000-0000"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCenterModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCenter}>
              {editingCenter ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Center Confirm */}
      <Modal
        isOpen={!!deleteCenterConfirm}
        onClose={() => setDeleteCenterConfirm(null)}
        title="Remover Hemocentro"
      >
        <p className="text-gray-600">
          Tem certeza que deseja remover este hemocentro? Esta acao nao pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteCenterConfirm(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteCenterConfirm && handleDeleteCenter(deleteCenterConfirm)}
          >
            Remover
          </Button>
        </div>
      </Modal>
    </div>
  )
}
