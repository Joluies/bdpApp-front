import React, { useState, useEffect } from 'react';
import { Text, Spacer, Button, Card } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { 
  Camion, 
  EstadisticasDespacho, 
  EstadoCamion, 
  EstadoEntrega,
  Ruta,
  PuntoEntrega 
} from '../../types/despacho';
import { EstadisticasDespachoCards } from './estadisticas-cards';
import { CamionesTable } from './camiones-table';
import { DetalleRuta } from './detalle-ruta';

export const DespachoContent = () => {
  const [camiones, setCamiones] = useState<Camion[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasDespacho>({
    totalCamiones: 0,
    camionesEnRuta: 0,
    camionesDisponibles: 0,
    totalRutas: 0,
    rutasActivas: 0,
    totalPuntosEntrega: 0,
    puntosEntregados: 0,
    puntosRechazados: 0,
    puntosPendientes: 0,
    valorTotalMercaderia: 0,
    valorEntregado: 0,
    valorPendiente: 0
  });
  const [rutaSeleccionada, setRutaSeleccionada] = useState<Ruta | null>(null);
  const [mostrarDetalleRuta, setMostrarDetalleRuta] = useState(false);

  // Datos de ejemplo (en un proyecto real vendrían de una API)
  useEffect(() => {
    const datosEjemplo: Camion[] = [
      {
        id: '1',
        placa: 'BDP-001',
        modelo: 'Actros',
        marca: 'Mercedes-Benz',
        anio: 2022,
        capacidad: 15,
        conductor: 'Juan Pérez',
        telefono: '+51 987654321',
        estado: EstadoCamion.EN_RUTA,
        kmRecorridos: 45230,
        rutas: [
          {
            id: 'r1',
            nombre: 'Ruta Lima Norte',
            descripcion: 'Distribución zona norte de Lima',
            distanciaTotal: 85,
            tiempoEstimado: 6,
            fechaInicio: '2024-11-04T08:00:00',
            estado: EstadoEntrega.EN_TRANSITO,
            valorTotal: 25000,
            puntosEntrega: [
              {
                id: 'p1',
                direccion: 'Av. Túpac Amaru 1234, Comas',
                cliente: 'Minimarket El Buen Precio',
                telefono: '+51 956789012',
                valorMercaderia: 5000,
                estado: EstadoEntrega.ENTREGADO,
                fechaEstimada: '2024-11-04T09:00:00',
                fechaEntrega: '2024-11-04T09:15:00',
                observaciones: 'Entregado sin problemas'
              },
              {
                id: 'p2',
                direccion: 'Jr. Los Olivos 567, Los Olivos',
                cliente: 'Bodega San Martin',
                telefono: '+51 945678901',
                valorMercaderia: 8000,
                estado: EstadoEntrega.EN_TRANSITO,
                fechaEstimada: '2024-11-04T10:30:00'
              },
              {
                id: 'p3',
                direccion: 'Av. Carlos Izaguirre 890, Independencia',
                cliente: 'Supermercado Familiar',
                valorMercaderia: 12000,
                estado: EstadoEntrega.PENDIENTE,
                fechaEstimada: '2024-11-04T12:00:00'
              }
            ]
          }
        ]
      },
      {
        id: '2',
        placa: 'BDP-002',
        modelo: 'FH 460',
        marca: 'Volvo',
        anio: 2021,
        capacidad: 18,
        conductor: 'María García',
        telefono: '+51 976543210',
        estado: EstadoCamion.DISPONIBLE,
        kmRecorridos: 38500,
        rutas: [
          {
            id: 'r2',
            nombre: 'Ruta Lima Sur',
            descripcion: 'Distribución zona sur de Lima',
            distanciaTotal: 95,
            tiempoEstimado: 7,
            fechaInicio: '2024-11-03T07:30:00',
            fechaFin: '2024-11-03T16:00:00',
            estado: EstadoEntrega.ENTREGADO,
            valorTotal: 18500,
            puntosEntrega: [
              {
                id: 'p4',
                direccion: 'Av. Benavides 1122, Surco',
                cliente: 'Market Premium',
                valorMercaderia: 7500,
                estado: EstadoEntrega.ENTREGADO,
                fechaEstimada: '2024-11-03T09:00:00',
                fechaEntrega: '2024-11-03T09:10:00'
              },
              {
                id: 'p5',
                direccion: 'Av. Separadora Industrial 456, Ate',
                cliente: 'Distribuidora Central',
                valorMercaderia: 11000,
                estado: EstadoEntrega.ENTREGADO,
                fechaEstimada: '2024-11-03T11:00:00',
                fechaEntrega: '2024-11-03T11:25:00'
              }
            ]
          }
        ]
      },
      {
        id: '3',
        placa: 'BDP-003',
        modelo: 'Constellation',
        marca: 'Volkswagen',
        anio: 2023,
        capacidad: 12,
        conductor: 'Carlos López',
        telefono: '+51 987123456',
        estado: EstadoCamion.EN_RUTA,
        kmRecorridos: 12800,
        rutas: [
          {
            id: 'r3',
            nombre: 'Ruta Lima Este',
            descripcion: 'Distribución zona este de Lima',
            distanciaTotal: 75,
            tiempoEstimado: 5,
            fechaInicio: '2024-11-04T07:00:00',
            estado: EstadoEntrega.EN_TRANSITO,
            valorTotal: 22000,
            puntosEntrega: [
              {
                id: 'p6',
                direccion: 'Av. Nicolás Ayllón 789, El Agustino',
                cliente: 'Bodega Don Pedro',
                valorMercaderia: 4000,
                estado: EstadoEntrega.RECHAZADO,
                fechaEstimada: '2024-11-04T08:30:00',
                observaciones: 'Cliente no disponible, reprogramar entrega'
              },
              {
                id: 'p7',
                direccion: 'Jr. Huancavelica 234, El Agustino',
                cliente: 'Minimarket La Esperanza',
                valorMercaderia: 6500,
                estado: EstadoEntrega.ENTREGADO,
                fechaEstimada: '2024-11-04T10:00:00',
                fechaEntrega: '2024-11-04T10:05:00'
              },
              {
                id: 'p8',
                direccion: 'Av. Próceres 567, SJL',
                cliente: 'Supermercado Económico',
                valorMercaderia: 11500,
                estado: EstadoEntrega.PENDIENTE,
                fechaEstimada: '2024-11-04T13:00:00'
              }
            ]
          }
        ]
      }
    ];

    setCamiones(datosEjemplo);

    // Calcular estadísticas
    const stats = calcularEstadisticas(datosEjemplo);
    setEstadisticas(stats);
  }, []);

  const calcularEstadisticas = (camionesData: Camion[]): EstadisticasDespacho => {
    const totalCamiones = camionesData.length;
    const camionesEnRuta = camionesData.filter(c => c.estado === EstadoCamion.EN_RUTA).length;
    const camionesDisponibles = camionesData.filter(c => c.estado === EstadoCamion.DISPONIBLE).length;
    
    const todasLasRutas = camionesData.flatMap(c => c.rutas);
    const totalRutas = todasLasRutas.length;
    const rutasActivas = todasLasRutas.filter(r => r.estado === EstadoEntrega.EN_TRANSITO).length;
    
    const todosPuntos = todasLasRutas.flatMap(r => r.puntosEntrega);
    const totalPuntosEntrega = todosPuntos.length;
    const puntosEntregados = todosPuntos.filter(p => p.estado === EstadoEntrega.ENTREGADO).length;
    const puntosRechazados = todosPuntos.filter(p => p.estado === EstadoEntrega.RECHAZADO).length;
    const puntosPendientes = todosPuntos.filter(p => 
      p.estado === EstadoEntrega.PENDIENTE || p.estado === EstadoEntrega.EN_TRANSITO
    ).length;
    
    const valorTotalMercaderia = todosPuntos.reduce((sum, p) => sum + p.valorMercaderia, 0);
    const valorEntregado = todosPuntos
      .filter(p => p.estado === EstadoEntrega.ENTREGADO)
      .reduce((sum, p) => sum + p.valorMercaderia, 0);
    const valorPendiente = todosPuntos
      .filter(p => p.estado === EstadoEntrega.PENDIENTE || p.estado === EstadoEntrega.EN_TRANSITO)
      .reduce((sum, p) => sum + p.valorMercaderia, 0);

    return {
      totalCamiones,
      camionesEnRuta,
      camionesDisponibles,
      totalRutas,
      rutasActivas,
      totalPuntosEntrega,
      puntosEntregados,
      puntosRechazados,
      puntosPendientes,
      valorTotalMercaderia,
      valorEntregado,
      valorPendiente
    };
  };

  const handleVerDetallesCamion = (camion: Camion) => {
    if (camion.rutaActual) {
      setRutaSeleccionada(camion.rutaActual);
      setMostrarDetalleRuta(true);
    } else if (camion.rutas.length > 0) {
      setRutaSeleccionada(camion.rutas[0]);
      setMostrarDetalleRuta(true);
    }
  };

  return (
    <Flex direction="column" css={{ gap: '$6', padding: '$6' }}>
      {/* Header */}
      <Flex justify="between" align="center">
        <Flex direction="column">
          <Text h2 css={{ color: '#034F32', m: 0 }}>
            Centro de Despacho
          </Text>
          <Text css={{ color: '$gray600' }}>
            Gestión y seguimiento de camiones y rutas de entrega
          </Text>
        </Flex>
        <Button 
          auto
          css={{ 
            background: '#5CAC4C', 
            '&:hover': { background: '#034F32' } 
          }}
        >
          Generar Reporte
        </Button>
      </Flex>

      {/* Estadísticas */}
      <EstadisticasDespachoCards estadisticas={estadisticas} />

      <Spacer y={1} />

      {/* Tabla de camiones */}
      <Card css={{ p: '$6' }}>
        <Flex direction="column" css={{ gap: '$4' }}>
          <Flex justify="between" align="center">
            <Text h3 css={{ color: '#034F32', m: 0 }}>
              Estado de Camiones
            </Text>
            <Flex css={{ gap: '$2' }}>
              <Button auto flat size="sm">
                Filtros
              </Button>
              <Button auto flat size="sm">
                Exportar
              </Button>
            </Flex>
          </Flex>
          
          <CamionesTable 
            camiones={camiones}
            onVerDetalles={handleVerDetallesCamion}
          />
        </Flex>
      </Card>

      {/* Modal de detalle de ruta */}
      {rutaSeleccionada && (
        <DetalleRuta
          ruta={rutaSeleccionada}
          visible={mostrarDetalleRuta}
          onClose={() => {
            setMostrarDetalleRuta(false);
            setRutaSeleccionada(null);
          }}
        />
      )}
    </Flex>
  );
};