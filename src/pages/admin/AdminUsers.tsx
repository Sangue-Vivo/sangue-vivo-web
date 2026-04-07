import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdminUsers } from '../../hooks/useAdminUsers'
import { BloodType } from '../../types'
import type { User } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { formatDate, formatNumber } from '../../utils/formatters'
import { BLOOD_TYPE_LABELS } from '../../utils/bloodTypes'

const ITEMS_PER_PAGE = 10

const bloodTypeOptions = [
  { value: '', label: 'Todos os tipos' },
  ...Object.values(BloodType).map((bt) => ({
    value: bt,
    label: BLOOD_TYPE_LABELS[bt],
  })),
]

const universityOptions = [
  { value: '', label: 'Todas as universidades' },
  { value: 'UFAL', label: 'UFAL' },
  { value: 'CESMAC', label: 'CESMAC' },
  { value: 'UNIT', label: 'UNIT' },
  { value: 'FITS', label: 'FITS' },
  { value: 'UNINASSAU', label: 'UNINASSAU' },
  { value: 'UNEAL', label: 'UNEAL' },
  { value: 'IFAL', label: 'IFAL' },
  { value: 'Estacio', label: 'Estacio' },
]

export default function AdminUsers() {
  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    totalUsers,
  } = useAdminUsers()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const columns = [
    {
      key: 'name',
      header: 'Doador',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar name={user.name} bloodType={user.bloodType} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">{user.course}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user: User) => (
        <span className="text-gray-600">{user.email}</span>
      ),
    },
    {
      key: 'bloodType',
      header: 'Tipo Sanguineo',
      render: (user: User) => <BloodTypeBadge bloodType={user.bloodType} />,
    },
    {
      key: 'university',
      header: 'Universidade',
      render: (user: User) => (
        <span className="text-gray-600">{user.university.split(' \u2014 ')[0]}</span>
      ),
    },
    {
      key: 'potentialLivesSaved',
      header: 'Vidas (est.)',
      render: (user: User) => (
        <span className="font-semibold text-gray-700">{user.potentialLivesSaved}</span>
      ),
    },
    {
      key: 'isEligible',
      header: 'Elegivel',
      render: (user: User) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              user.isEligible ? 'bg-green-500' : 'bg-red-400'
            }`}
          />
          <span className="text-xs text-gray-500">
            {user.isEligible ? 'Sim' : 'Nao'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Acoes',
      render: (user: User) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedUser(user)
          }}
        >
          Ver
        </Button>
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
        <div className="flex items-center gap-3">
          <h1 className="font-jakarta text-2xl font-bold text-gray-900">
            Gestao de Usuarios
          </h1>
          <Badge variant="default" size="md">
            {formatNumber(totalUsers)} usuarios
          </Badge>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          leftIcon={<Search className="h-5 w-5" />}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="w-48">
          <Select
            options={bloodTypeOptions}
            value={filters.bloodType || ''}
            onChange={(e) => {
              setFilters({
                ...filters,
                bloodType: (e.target.value as BloodType) || null,
              })
              setCurrentPage(1)
            }}
            placeholder="Tipo Sanguineo"
          />
        </div>
        <div className="w-52">
          <Select
            options={universityOptions}
            value={filters.university || ''}
            onChange={(e) => {
              setFilters({
                ...filters,
                university: e.target.value || null,
              })
              setCurrentPage(1)
            }}
            placeholder="Universidade"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={paginatedUsers as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhum usuario encontrado."
        />
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} de{' '}
            {filteredUsers.length} usuarios
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  page === currentPage
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* User Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Detalhes do Usuario"
        className="max-w-2xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                name={selectedUser.name}
                bloodType={selectedUser.bloodType}
                size="lg"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <BloodTypeBadge bloodType={selectedUser.bloodType} />
                  <Badge variant={selectedUser.isEligible ? 'success' : 'danger'} size="sm">
                    {selectedUser.isEligible ? 'Elegivel' : 'Inelegivel'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-xs font-medium text-gray-400">Universidade</p>
                <p className="text-sm font-semibold text-gray-700">{selectedUser.university}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Curso / Semestre</p>
                <p className="text-sm font-semibold text-gray-700">
                  {selectedUser.course} - {selectedUser.semester}o sem
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Telefone</p>
                <p className="text-sm font-semibold text-gray-700">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Data de Nascimento</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatDate(selectedUser.birthDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Cadastro em</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Genero</p>
                <p className="text-sm font-semibold text-gray-700">
                  {selectedUser.gender === 'MALE'
                    ? 'Masculino'
                    : selectedUser.gender === 'FEMALE'
                      ? 'Feminino'
                      : 'Outro'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{selectedUser.potentialLivesSaved}</p>
                <p className="text-xs font-medium text-red-400">Vidas (estimativa)</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedUser.consecutiveStreak}</p>
                <p className="text-xs font-medium text-blue-400">Sequencia</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {selectedUser.lastDonationDate && (
                <span>
                  Ultima doacao: {formatDate(selectedUser.lastDonationDate)}
                </span>
              )}
              {selectedUser.nextEligibleDate && (
                <span>
                  Proxima elegibilidade: {formatDate(selectedUser.nextEligibleDate)}
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
