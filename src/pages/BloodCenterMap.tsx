import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Droplets,
  Navigation,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageContainer from '../components/layout/PageContainer';

const bloodDropIcon = L.divIcon({
  html: `<div style="background:#DC2626;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
    </svg>
  </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const bloodCenters = [
  {
    id: 1,
    name: 'Hemoal Maceió',
    fullName: 'Hemocentro de Alagoas - Unidade Maceió',
    address: 'Av. Jorge de Lima, 58 - Trapiche da Barra, Maceió - AL, 57010-300',
    phone: '(82) 3315-2102',
    lat: -9.6658,
    lng: -35.7353,
    hours: [
      { day: 'Segunda a Sexta', time: '7h às 18h' },
      { day: 'Sábado', time: '7h às 13h' },
      { day: 'Domingo e Feriados', time: 'Fechado' },
    ],
    mapsUrl: 'https://maps.google.com/?q=Hemocentro+de+Alagoas+Maceio',
    services: ['Doação de sangue', 'Coleta de plaquetas', 'Exames laboratoriais'],
  },
  {
    id: 2,
    name: 'Hemoal Arapiraca',
    fullName: 'Hemocentro de Alagoas - Unidade Arapiraca',
    address: 'Rua Samaritana, s/n - Baixa Grande, Arapiraca - AL, 57312-000',
    phone: '(82) 3522-1974',
    lat: -9.7545,
    lng: -36.6612,
    hours: [
      { day: 'Segunda a Sexta', time: '7h às 13h' },
      { day: 'Sábado e Domingo', time: 'Fechado' },
    ],
    mapsUrl: 'https://maps.google.com/?q=Hemocentro+Arapiraca+Alagoas',
    services: ['Doação de sangue', 'Exames laboratoriais'],
  },
];

export default function BloodCenterMap() {
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);

  return (
    <PageContainer
      title="Hemocentros"
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Hemocentros' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Encontre o hemocentro mais próximo de você e agende sua doação de sangue.
        </motion.p>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative z-0"
          style={{ height: '400px' }}
        >
          <MapContainer
            center={[-9.71, -36.2]}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {bloodCenters.map((center) => (
              <Marker
                key={center.id}
                position={[center.lat, center.lng]}
                icon={bloodDropIcon}
                eventHandlers={{
                  click: () => setSelectedCenter(center.id),
                }}
              >
                <Popup>
                  <div className="font-sans">
                    <p className="font-bold text-base">{center.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{center.address}</p>
                    <p className="text-xs mt-1">{center.phone}</p>
                    <a
                      href={center.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-600 font-semibold mt-2 inline-block hover:underline"
                    >
                      Como chegar →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Center cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bloodCenters.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
            >
              <Card
                className={`transition-all ${
                  selectedCenter === center.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : ''
                }`}
                onClick={() => setSelectedCenter(center.id)}
                hoverable
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center shrink-0">
                      <Droplets className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-dark">{center.name}</h2>
                      <p className="text-sm text-gray-400">{center.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Endereço</p>
                      <p className="text-sm text-gray-500">{center.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Telefone</p>
                      <p className="text-sm text-gray-500">{center.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Horário de funcionamento</p>
                      <div className="flex flex-col gap-1">
                        {center.hours.map((h) => (
                          <div key={h.day} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 min-w-[150px]">{h.day}</span>
                            <span className="text-gray-700 font-medium">{h.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Serviços disponíveis</p>
                    <div className="flex flex-wrap gap-2">
                      {center.services.map((service) => (
                        <span
                          key={service}
                          className="bg-primary-light text-primary text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <a
                      href={center.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        fullWidth
                        leftIcon={<Navigation className="w-4 h-4" />}
                        rightIcon={<ExternalLink className="w-4 h-4" />}
                      >
                        Como chegar
                      </Button>
                    </a>
                    <a href={`tel:${center.phone.replace(/\D/g, '')}`}>
                      <Button variant="secondary" leftIcon={<Phone className="w-4 h-4" />}>
                        Ligar
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
