import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  Bell,
  AlertTriangle,
  Megaphone,
  Clock,
  Users,
} from 'lucide-react'
import { BloodType } from '../../types'
import { useAdminStats } from '../../hooks/useAdminStats'
import DataTable from '../../components/admin/DataTable'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { BLOOD_TYPE_LABELS } from '../../utils/bloodTypes'
import { formatDate } from '../../utils/formatters'

type TargetAudience = 'ALL' | 'BLOOD_TYPE' | 'UNIVERSITY'

const audienceOptions = [
  { value: 'ALL', label: 'Todos os Usuarios' },
  { value: 'BLOOD_TYPE', label: 'Por Tipo Sanguineo' },
  { value: 'UNIVERSITY', label: 'Por Universidade' },
]

const UNIVERSITIES = [
  'UFAL',
  'CESMAC',
  'UNIT',
  'FITS',
  'UNINASSAU',
  'UNEAL',
  'IFAL',
  'Estacio',
  'UNIFAL',
]

interface NotificationTemplate {
  label: string
  icon: React.ReactNode
  title: string
  message: string
}

const TEMPLATES: NotificationTemplate[] = [
  {
    label: 'Estoque Critico',
    icon: <AlertTriangle className="h-4 w-4" />,
    title: 'Estoque Critico de Sangue',
    message:
      'O estoque de sangue esta em niveis criticos. Precisamos urgentemente de doadores. Agende sua doacao e salve vidas!',
  },
  {
    label: 'Campanha de Doacao',
    icon: <Megaphone className="h-4 w-4" />,
    title: 'Campanha de Doacao de Sangue',
    message:
      'Estamos promovendo uma campanha especial de doacao de sangue. Participe e ganhe XP bonus! Cada doacao faz a diferenca.',
  },
  {
    label: 'Lembrete Geral',
    icon: <Clock className="h-4 w-4" />,
    title: 'Lembrete: Voce pode doar novamente!',
    message:
      'Ja se passou o periodo minimo desde sua ultima doacao. Voce esta elegivel para doar sangue novamente. Agende sua proxima doacao!',
  },
]

export default function AdminNotifications() {
  const { broadcastHistory } = useAdminStats()

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<TargetAudience>('ALL')
  const [selectedBloodTypes, setSelectedBloodTypes] = useState<BloodType[]>([])
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [sentHistory, setSentHistory] = useState(broadcastHistory)

  const toggleBloodType = (bt: BloodType) => {
    setSelectedBloodTypes((prev) =>
      prev.includes(bt) ? prev.filter((t) => t !== bt) : [...prev, bt]
    )
  }

  const toggleUniversity = (uni: string) => {
    setSelectedUniversities((prev) =>
      prev.includes(uni) ? prev.filter((u) => u !== uni) : [...prev, uni]
    )
  }

  const applyTemplate = (template: NotificationTemplate) => {
    setTitle(template.title)
    setMessage(template.message)
  }

  const getTargetLabel = (): string => {
    if (audience === 'ALL') return 'Todos'
    if (audience === 'BLOOD_TYPE') {
      return selectedBloodTypes.map((bt) => BLOOD_TYPE_LABELS[bt]).join(', ') || 'Nenhum selecionado'
    }
    return selectedUniversities.join(', ') || 'Nenhuma selecionada'
  }

  const getRecipientCount = (): number => {
    if (audience === 'ALL') return 393
    if (audience === 'BLOOD_TYPE') return selectedBloodTypes.length * 45
    return selectedUniversities.length * 40
  }

  const handleSend = () => {
    const newBroadcast = {
      id: `b${Date.now()}`,
      title,
      target: getTargetLabel(),
      sentAt: new Date().toISOString().split('T')[0],
      recipients: getRecipientCount(),
    }
    setSentHistory([newBroadcast, ...sentHistory])
    setTitle('')
    setMessage('')
    setAudience('ALL')
    setSelectedBloodTypes([])
    setSelectedUniversities([])
    setShowConfirm(false)
  }

  const canSend = title.trim() && message.trim()

  type BroadcastRow = (typeof sentHistory)[0]

  const historyColumns = [
    {
      key: 'title',
      header: 'Titulo',
      render: (row: BroadcastRow) => (
        <span className="font-medium text-gray-900">{row.title}</span>
      ),
    },
    {
      key: 'target',
      header: 'Publico',
      render: (row: BroadcastRow) => (
        <Badge variant="default" size="sm">
          {row.target}
        </Badge>
      ),
    },
    {
      key: 'sentAt',
      header: 'Data',
      render: (row: BroadcastRow) => (
        <span className="text-gray-600">{formatDate(row.sentAt)}</span>
      ),
    },
    {
      key: 'recipients',
      header: 'Destinatarios',
      render: (row: BroadcastRow) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-semibold text-gray-700">{row.recipients}</span>
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
          Notificacoes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Envie notificacoes para doadores e gerencie o historico de envios
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Send Form */}
        <motion.div
          className="rounded-2xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            <h2 className="font-jakarta text-lg font-bold text-gray-900">
              Enviar Notificacao
            </h2>
          </div>

          <div className="space-y-4">
            {/* Templates */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Templates Rapidos
              </label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => applyTemplate(t)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Titulo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titulo da notificacao"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                placeholder="Escreva a mensagem..."
              />
            </div>

            <Select
              label="Publico-alvo"
              options={audienceOptions}
              value={audience}
              onChange={(e) => setAudience(e.target.value as TargetAudience)}
            />

            {/* Blood Type Selection */}
            {audience === 'BLOOD_TYPE' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tipos Sanguineos
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
            )}

            {/* University Selection */}
            {audience === 'UNIVERSITY' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Universidades
                </label>
                <div className="flex flex-wrap gap-2">
                  {UNIVERSITIES.map((uni) => (
                    <button
                      key={uni}
                      onClick={() => toggleUniversity(uni)}
                      className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                        selectedUniversities.includes(uni)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {uni}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preview & Send */}
            {canSend && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-400">Pre-visualizacao</p>
                <p className="mt-1 font-semibold text-gray-900">{title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  Publico: {getTargetLabel()} ({getRecipientCount()} destinatarios)
                </p>
              </div>
            )}

            <Button
              fullWidth
              leftIcon={<Send className="h-5 w-5" />}
              onClick={() => setShowConfirm(true)}
              disabled={!canSend}
            >
              Enviar Notificacao
            </Button>
          </div>
        </motion.div>

        {/* Right: History */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <h2 className="font-jakarta text-lg font-bold text-gray-900">
                Historico de Envios
              </h2>
            </div>
            <DataTable
              columns={historyColumns}
              data={sentHistory as unknown as Record<string, unknown>[]}
              emptyMessage="Nenhuma notificacao enviada."
            />
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar Envio"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Deseja enviar esta notificacao para{' '}
            <span className="font-semibold text-gray-900">{getRecipientCount()}</span>{' '}
            destinatarios?
          </p>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
            <p className="mt-2 text-xs text-gray-400">Publico: {getTargetLabel()}</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSend}>
              Confirmar Envio
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
