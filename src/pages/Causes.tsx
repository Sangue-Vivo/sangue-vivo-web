import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Inbox } from 'lucide-react';
import Input from '../components/ui/Input';
import CauseCard from '../components/cause/CauseCard';
import PageContainer from '../components/layout/PageContainer';
import { useCauses } from '../hooks/useCauses';

type FilterTab = 'compatible' | 'critical' | 'all';

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'compatible', label: 'Compatíveis comigo' },
  { key: 'critical', label: 'Estoque Crítico' },
  { key: 'all', label: 'Todos os alertas' },
];

export default function Causes() {
  const navigate = useNavigate();
  const { causes, compatibleCauses } = useCauses();
  const [activeTab, setActiveTab] = useState<FilterTab>('compatible');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCauses = useMemo(() => {
    let filtered = causes;

    switch (activeTab) {
      case 'compatible':
        filtered = compatibleCauses;
        break;
      case 'critical':
        filtered = causes.filter((c) => c.urgencyLevel >= 4);
        break;
      default:
        filtered = causes;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.hospital.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [causes, compatibleCauses, activeTab, searchQuery]);

  return (
    <PageContainer title="Alertas de Estoque">
      <div className="flex flex-col gap-6">
        <p className="text-gray-500 text-sm -mt-2">
          Veja a situação dos estoques de sangue nos hemocentros de Alagoas
        </p>

        {/* Search */}
        <Input
          placeholder="Buscar alertas..."
          leftIcon={<Search className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer
                ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {filteredCauses.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Inbox className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">Nenhum alerta encontrado</h3>
            <p className="text-sm text-gray-400 mt-1">
              Tente alterar os filtros ou a busca para encontrar alertas.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCauses.map((cause, index) => (
              <motion.div
                key={cause.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CauseCard
                  cause={cause}
                  onHelp={(id) => navigate(`/causes/${id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
