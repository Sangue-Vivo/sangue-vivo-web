import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, XCircle, Trash2 } from 'lucide-react'
import { useAdminCauses } from '../../hooks/useAdminCauses'
import { BloodType } from '../../types'
import type { Cause } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { formatDate } from '../../utils/formatters'
import { BLOOD_TYPE_LABELS } from '../../utils/bloodTypes'

const STOCK_CONFIG: Record<string, { variant: 'success' | 'info' | 'danger' | 'default' | 'warning'; label: string }> = {
  critical: { variant: 'danger', label: 'Critico' },
  low: { variant: 'warning', label: 'Baixo' },
  moderate: { variant: 'info', label: 'Moderado' },
  stable: { variant: 'success', label: 'Estavel' },
}

const URGENCY_COLORS: Record<number, string> = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
}

type TabKey = 'ALL' | 'active' | 'inactive'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'ALL', label: 'Todas' },
  { key: 'active', label: 'Ativas' },
  { key: 'inactive', label: 'Inativas' },
]

const defaultForm = {
  title: '',
  description: '',
  hospital: '',
  city: 'Maceio',
  urgencyLevel: 3,
  stockLevel: 'low' as 'critical' | 'low' | 'moderate' | 'stable',
  expiresAt: '',
  createdById: 'admin-1',
}

export default function AdminCauses() {
  const {
    causes,
    createCause,
    updateCauseActive,
    deleteCause,
  } = useAdminCauses()

  const [activeTab, setActiveTab] = useState<TabKey>('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingCause, setEditingCause] = useState<Cause | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })
  const [selectedBloodTypes, setSelectedBloodTypes] = useState<BloodType[]>([BloodType.O_POSITIVE])

  const displayCauses = activeTab === 'ALL'
    ? causes
    : activeTab === 'active'
      ? causes.filter((c) => c.active)
      : causes.filter((c) => !c.active)

  const openCreate = () => {
    setEditingCause(null)
    setForm({ ...defaultForm })
    setSelectedBloodTypes([BloodType.O_POSITIVE])
    setShowModal(true)
  }

  const openEdit = (cause: Cause) => {
    setEditingCause(cause)
    setForm({
      title: cause.title,
      description: cause.description,
      hospital: cause.hospital,
      city: cause.city,
      urgencyLevel: cause.urgencyLevel,
      stockLevel: cause.stockLevel,
      expiresAt: cause.expiresAt instanceof Date
        ? cause.expiresAt.toISOString().split('T')[0]
        : new Date(cause.expiresAt).toISOString().split('T')[0],
      createdById: cause.createdById,
    })
    setSelectedBloodTypes([...cause.bloodTypesNeeded])
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.title || !form.hospital) return

    if (editingCause) {
      updateCauseActive(editingCause.id, editingCause.active)
    } else {
      createCause({
        ...form,
        bloodTypesNeeded: selectedBloodTypes.length > 0 ? selectedBloodTypes : [BloodType.O_POSITIVE],
        active: true,
        expiresAt: new Date(form.expiresAt || '2026-05-01'),
      })
    }
    setShowModal(false)
  }

  const handleDeactivate = (causeId: string) => {
    updateCauseActive(causeId, false)
  }

  const handleDelete = (causeId: string) => {
    deleteCause(causeId)
    setDeleteConfirm(null)
  }

  const toggleBloodType = (bt: BloodType) => {
    setSelectedBloodTypes((prev) =>
      prev.includes(bt) ? prev.filter((t) => t !== bt) : [...prev, bt]
    )
  }

  const columns = [
    {
      key: 'title',
      header: 'Titulo',
      render: (cause: Cause) => (
        <div>
          <p className="font-medium text-gray-900">{cause.title}</p>
          <p className="text-xs text-gray-400">{cause.hospital}</p>
        </div>
      ),
    },
    {
      key: 'bloodTypes',
      header: 'Tipos Sanguineos',
      render: (cause: Cause) => (
        <div className="flex flex-wrap gap-1">
          {cause.bloodTypesNeeded.map((bt) => (
            <span key={bt} className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
              {BLOOD_TYPE_LABELS[bt]}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'stockLevel',
      header: 'Estoque',
      render: (cause: Cause) => {
        const config = STOCK_CONFIG[cause.stockLevel]
        return (
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        )
      },
    },
    {
      key: 'urgencyLevel',
      header: 'Urgencia',
      render: (cause: Cause) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            URGENCY_COLORS[cause.urgencyLevel] || URGENCY_COLORS[1]
          }`}
        >
          {cause.urgencyLevel}/5
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (cause: Cause) => (
        <Badge variant={cause.active ? 'info' : 'default'} size="sm">
          {cause.active ? 'Ativa' : 'Inativa'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acoes',
      render: (cause: Cause) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              openEdit(cause)
            }}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {cause.active && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeactivate(cause.id)
              }}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
              title="Desativar"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteConfirm(cause.id)
            }}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-jakarta text-2xl font-bold text-gray-900">
          Gestao de Alertas
        </h1>
        <Button
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={openCreate}
        >
          Novo Alerta
        </Button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <DataTable
          columns={columns}
          data={displayCauses as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhum alerta encontrado."
        />
      </motion.div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCause ? 'Editar Alerta' : 'Novo Alerta'}
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <Input
            label="Titulo"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Estoque Critico de O-"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Descricao
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20"
              placeholder="Descreva o alerta..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipos Sanguineos Necessarios
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(BloodType).map((bt) => (
                <button
                  key={bt}
                  onClick={() => toggleBloodType(bt)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    selectedBloodTypes.includes(bt)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {BLOOD_TYPE_LABELS[bt]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Nivel de Estoque"
              options={[
                { value: 'critical', label: 'Critico' },
                { value: 'low', label: 'Baixo' },
                { value: 'moderate', label: 'Moderado' },
                { value: 'stable', label: 'Estavel' },
              ]}
              value={form.stockLevel}
              onChange={(e) => setForm({ ...form, stockLevel: e.target.value as 'critical' | 'low' | 'moderate' | 'stable' })}
            />
            <Select
              label="Urgencia"
              options={[
                { value: '1', label: '1 - Baixa' },
                { value: '2', label: '2 - Moderada' },
                { value: '3', label: '3 - Media' },
                { value: '4', label: '4 - Alta' },
                { value: '5', label: '5 - Critica' },
              ]}
              value={String(form.urgencyLevel)}
              onChange={(e) => setForm({ ...form, urgencyLevel: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hemocentro"
              value={form.hospital}
              onChange={(e) => setForm({ ...form, hospital: e.target.value })}
              placeholder="Nome do hemocentro"
            />
            <Input
              label="Cidade"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Maceio"
            />
          </div>

          <Input
            label="Data de Expiracao"
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingCause ? 'Salvar Alteracoes' : 'Criar Alerta'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Exclusao"
      >
        <p className="text-gray-600">
          Tem certeza que deseja excluir este alerta? Esta acao nao pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  )
}
