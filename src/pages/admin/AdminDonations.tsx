import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  UserX,
} from 'lucide-react'
import { DonationStatus } from '../../types'
import { useAdminStore } from '../../stores/adminStore'
import { useAdminStats } from '../../hooks/useAdminStats'
import StatCard from '../../components/admin/StatCard'
import DataTable from '../../components/admin/DataTable'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { formatDate } from '../../utils/formatters'
import { BLOOD_TYPE_LABELS } from '../../utils/bloodTypes'

const STATUS_BADGE: Record<
  string,
  { variant: 'success' | 'info' | 'danger' | 'default'; label: string }
> = {
  COMPLETED: { variant: 'success', label: 'Concluida' },
  SCHEDULED: { variant: 'info', label: 'Agendada' },
  CANCELLED: { variant: 'danger', label: 'Cancelada' },
  NO_SHOW: { variant: 'default', label: 'No-show' },
}

const statusFilterOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'COMPLETED', label: 'Concluidas' },
  { value: 'SCHEDULED', label: 'Agendadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
  { value: 'NO_SHOW', label: 'No-show' },
]

const hospitalFilterOptions = [
  { value: '', label: 'Todos os hemocentros' },
  { value: 'HEMO', label: 'HEMO Maceio' },
  { value: 'Hospital Universitario', label: 'Hospital Universitario' },
  { value: 'Santa Casa', label: 'Santa Casa de Misericordia' },
]

export default function AdminDonations() {
  const allDonations = useAdminStore((s) => s.allDonations)
  const confirmDonation = useAdminStore((s) => s.confirmDonation)
  const cancelDonation = useAdminStore((s) => s.cancelDonation)
  const { recentDonations } = useAdminStats()

  const [statusFilter, setStatusFilter] = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('')
  const [confirmModal, setConfirmModal] = useState<{ id: string; action: 'confirm' | 'cancel' | 'noshow' } | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const scheduledToday = useMemo(
    () =>
      recentDonations.filter(
        (d) => d.status === 'SCHEDULED' && d.date === today
      ).length,
    [recentDonations, today]
  )

  const completedToday = useMemo(
    () =>
      recentDonations.filter(
        (d) => d.status === 'COMPLETED' && d.date === today
      ).length,
    [recentDonations, today]
  )

  const cancelledToday = useMemo(
    () =>
      recentDonations.filter(
        (d) =>
          (d.status === 'CANCELLED' || d.status === 'NO_SHOW') &&
          d.date === today
      ).length,
    [recentDonations, today]
  )

  const filteredDonations = useMemo(() => {
    let data = [...recentDonations]
    if (statusFilter) {
      data = data.filter((d) => d.status === statusFilter)
    }
    if (hospitalFilter) {
      data = data.filter((d) =>
        d.hospital.toLowerCase().includes(hospitalFilter.toLowerCase())
      )
    }
    return data
  }, [recentDonations, statusFilter, hospitalFilter])

  const handleAction = () => {
    if (!confirmModal) return

    const matchingStoreDonation = allDonations.find((d) =>
      recentDonations.some(
        (rd) => rd.id === confirmModal.id && d.user.name === rd.donorName
      )
    )

    if (confirmModal.action === 'confirm' && matchingStoreDonation) {
      confirmDonation(matchingStoreDonation.id)
    } else if (
      (confirmModal.action === 'cancel' || confirmModal.action === 'noshow') &&
      matchingStoreDonation
    ) {
      cancelDonation(matchingStoreDonation.id)
    }
    setConfirmModal(null)
  }

  type DonationRow = (typeof recentDonations)[0]

  const columns = [
    {
      key: 'donorName',
      header: 'Doador',
      render: (d: DonationRow) => (
        <span className="font-medium text-gray-900">{d.donorName}</span>
      ),
    },
    {
      key: 'bloodType',
      header: 'Tipo Sanguineo',
      render: (d: DonationRow) => (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
          {d.bloodType}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Data Agendada',
      render: (d: DonationRow) => (
        <span className="text-gray-600">{formatDate(d.date)}</span>
      ),
    },
    {
      key: 'completedDate',
      header: 'Data Realizada',
      render: (d: DonationRow) => (
        <span className="text-gray-600">
          {d.status === 'COMPLETED' ? formatDate(d.date) : '\u2014'}
        </span>
      ),
    },
    {
      key: 'hospital',
      header: 'Hemocentro',
      render: (d: DonationRow) => (
        <span className="text-gray-600">{d.hospital}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (d: DonationRow) => {
        const badge = STATUS_BADGE[d.status] || STATUS_BADGE.SCHEDULED
        return (
          <Badge variant={badge.variant} size="sm">
            {badge.label}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      header: 'Acoes',
      render: (d: DonationRow) => (
        <div className="flex items-center gap-1">
          {d.status === 'SCHEDULED' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmModal({ id: d.id, action: 'confirm' })
                }}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 cursor-pointer"
                title="Confirmar"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmModal({ id: d.id, action: 'cancel' })
                }}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                title="Cancelar"
              >
                <XCircle className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmModal({ id: d.id, action: 'noshow' })
                }}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
                title="Marcar No-show"
              >
                <UserX className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-jakarta text-2xl font-bold text-gray-900">
          Gestao de Doacoes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie agendamentos e status das doacoes
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <StatCard
            title="Agendadas Hoje"
            value={scheduledToday}
            icon={<Clock className="h-6 w-6" />}
            color="bg-blue-100 text-blue-600"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Completadas Hoje"
            value={completedToday}
            icon={<CalendarCheck className="h-6 w-6" />}
            color="bg-green-100 text-green-600"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            title="Canceladas / No-show"
            value={cancelledToday}
            icon={<XCircle className="h-6 w-6" />}
            color="bg-red-100 text-red-600"
          />
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="w-48">
          <Select
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Status"
          />
        </div>
        <div className="w-56">
          <Select
            options={hospitalFilterOptions}
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            placeholder="Hemocentro"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <DataTable
          columns={columns}
          data={filteredDonations as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhuma doacao encontrada."
        />
      </motion.div>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={
          confirmModal?.action === 'confirm'
            ? 'Confirmar Doacao'
            : confirmModal?.action === 'cancel'
              ? 'Cancelar Doacao'
              : 'Marcar como No-show'
        }
      >
        <p className="text-gray-600">
          {confirmModal?.action === 'confirm'
            ? 'Deseja confirmar esta doacao como concluida?'
            : confirmModal?.action === 'cancel'
              ? 'Deseja cancelar esta doacao? O agendamento sera removido.'
              : 'Deseja marcar esta doacao como no-show? O doador nao compareceu.'}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmModal(null)}>
            Voltar
          </Button>
          <Button
            variant={confirmModal?.action === 'confirm' ? 'primary' : 'danger'}
            onClick={handleAction}
          >
            {confirmModal?.action === 'confirm'
              ? 'Confirmar'
              : confirmModal?.action === 'cancel'
                ? 'Cancelar Doacao'
                : 'Marcar No-show'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
