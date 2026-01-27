import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Modal,
  Badge,
  Text,
  Input,
  Loading,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { BonificacionForm } from './bonificacion-form';
import bonificacionesApi from '../../services/bonificaciones-api.service';
import { SearchIcon, EyeIcon, EditIcon, DeleteIcon, PlusIcon } from 'lucide-react';

export const BonificacionesContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [bonificaciones, setBonificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBonificacion, setSelectedBonificacion] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    cargarBonificaciones();
  }, []);

  const cargarBonificaciones = async () => {
    try {
      setLoading(true);
      const response = await bonificacionesApi.listarBonificaciones();
      setBonificaciones(response.data.data || []);
    } catch (error) {
      console.error('Error cargando bonificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaBonificacion = () => {
    console.log('🔵 Abriendo modal - Nueva bonificación');
    setSelectedBonificacion(null);
    setIsEditMode(false);
    setIsOpen(true);
    console.log('🔵 isOpen después de setIsOpen(true):', true);
  };

  const handleEditarBonificacion = (bonificacion: any) => {
    setSelectedBonificacion(bonificacion);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleVerBonificacion = (bonificacion: any) => {
    setSelectedBonificacion(bonificacion);
    setIsViewOpen(true);
  };

  const handleEliminarBonificacion = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta bonificación?')) return;
    try {
      await bonificacionesApi.eliminarBonificacion(id);
      cargarBonificaciones();
    } catch (error) {
      console.error('Error eliminando bonificación:', error);
      alert('Error al eliminar la bonificación');
    }
  };

  const handleGuardarBonificacion = async () => {
    await cargarBonificaciones();
    setIsOpen(false);
  };

  const getTipoBonificacionLabel = (tipo: string) => {
    const labels: any = {
      cantidad: 'Por Cantidad',
      producto: 'Por Producto',
      precio: 'Por Precio',
      periodo: 'Por Período',
    };
    return labels[tipo] || tipo;
  };

  // Calcular estadísticas adicionales
  const calcularEstadisticas = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hace7Dias.getDate() + 7);

    let vencidas = 0;
    let proximasAVencer = 0;
    let montoTotal = 0;
    let productosUnicos = new Set();

    bonificaciones.forEach((b) => {
      const fechaFin = new Date(b.fecha_fin);
      fechaFin.setHours(0, 0, 0, 0);

      // Bonificaciones vencidas
      if (fechaFin < hoy) {
        vencidas++;
      }
      // Bonificaciones próximas a vencer (próximos 7 días)
      else if (fechaFin >= hoy && fechaFin <= hace7Dias) {
        proximasAVencer++;
      }

      // Monto total
      montoTotal += b.cantidad_bonificacion || 0;

      // Productos con bonificaciones (contar únicos)
      if (b.productos && Array.isArray(b.productos)) {
        b.productos.forEach((p: any) => productosUnicos.add(p.idProducto || p.id));
      }
    });

    return {
      vencidas,
      proximasAVencer,
      montoTotal,
      productosUnicos: productosUnicos.size,
    };
  };

  const estadisticasAdicionales = calcularEstadisticas();

  const bonificacionesFiltradas = bonificaciones.filter((b) =>
    b.nombre.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalBonificaciones = bonificaciones.length;
  const activasBonificaciones = bonificaciones.filter((b) => b.activo).length;
  const inactivasBonificaciones = bonificaciones.filter((b) => !b.activo).length;

  return (
    <Box css={{ p: '$6', gap: '$5', display: 'flex', flexDirection: 'column' }}>
      <Flex align="center" justify="between" css={{
        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        padding: '$6',
        borderRadius: '$xl',
        marginBottom: '$4',
      }}>
        <Box>
          <Text h2 size="$2xl" weight="bold" color="white" css={{ mb: '$2' }}>
            🎁 Gestión de Bonificaciones
          </Text>
          <Text size="$md" color="rgba(255, 255, 255, 0.8)">
            Gestiona y crea bonificaciones especiales para tus productos
          </Text>
        </Box>
        <Button
          auto
          flat
          color="success"
          icon={<PlusIcon size={20} />}
          onClick={handleNuevaBonificacion}
          css={{ 
            fontSize: '$lg', 
            fontWeight: '$semibold',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
            }
          }}
        >
          Nueva Bonificación
        </Button>
      </Flex>

      <Flex css={{ gap: '$3', flexWrap: 'nowrap', '@sm': { flexWrap: 'wrap' } }}>
        <Card
          css={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            flex: 1,
            minWidth: '150px',
            p: '$6',
            borderRadius: '$xl',
            border: 'none',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.25)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 15px 40px rgba(245, 158, 11, 0.35)',
            }
          }}
        >
          <Text weight="medium" size="$xs" color="rgba(255, 255, 255, 0.8)" css={{ mb: '$2' }}>
            VENCIDAS
          </Text>
          <Text h3 weight="bold" color="white" size="$2xl">
            {estadisticasAdicionales.vencidas}
          </Text>
        </Card>

        <Card
          css={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            flex: 1,
            minWidth: '150px',
            p: '$6',
            borderRadius: '$xl',
            border: 'none',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 15px 40px rgba(16, 185, 129, 0.35)',
            }
          }}
        >
          <Text weight="medium" size="$xs" color="rgba(255, 255, 255, 0.8)" css={{ mb: '$2' }}>
            PRÓXIMAS A VENCER (7 DÍAS)
          </Text>
          <Text h3 weight="bold" color="white" size="$2xl">
            {estadisticasAdicionales.proximasAVencer}
          </Text>
        </Card>

        <Card
          css={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            flex: 1,
            minWidth: '150px',
            p: '$6',
            borderRadius: '$xl',
            border: 'none',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.25)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 15px 40px rgba(59, 130, 246, 0.35)',
            }
          }}
        >
          <Text weight="medium" size="$xs" color="rgba(255, 255, 255, 0.8)" css={{ mb: '$2' }}>
            MONTO TOTAL EN BONIFICACIONES
          </Text>
          <Text h3 weight="bold" color="white" size="$2xl">
            {estadisticasAdicionales.montoTotal}
          </Text>
        </Card>

        <Card
          css={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            flex: 1,
            minWidth: '150px',
            p: '$6',
            borderRadius: '$xl',
            border: 'none',
            boxShadow: '0 10px 30px rgba(6, 182, 212, 0.25)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 15px 40px rgba(6, 182, 212, 0.35)',
            }
          }}
        >
          <Text weight="medium" size="$xs" color="rgba(255, 255, 255, 0.8)" css={{ mb: '$2' }}>
            PRODUCTOS CON BONIFICACIONES
          </Text>
          <Text h3 weight="bold" color="white" size="$2xl">
            {estadisticasAdicionales.productosUnicos}
          </Text>
        </Card>
      </Flex>

      <Input
        clearable
        type="text"
        placeholder="Buscar bonificación por nombre..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        css={{ w: '100%' }}
      />

      <Card css={{ p: 0, overflow: 'hidden' }}>
        {loading ? (
          <Flex justify="center" align="center" css={{ minHeight: '300px' }}>
            <Loading type="points" color="success" size="lg" />
          </Flex>
        ) : bonificacionesFiltradas.length === 0 ? (
          <Flex justify="center" align="center" css={{ minHeight: '300px', flexDirection: 'column', gap: '$4' }}>
            <Text size="$lg" color="#999">
              🗑️ No hay bonificaciones registradas
            </Text>
          </Flex>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1F2937', color: 'white' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', fontSize: '13px' }}>NOMBRE</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', fontSize: '13px' }}>TIPO</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', fontSize: '13px' }}>ESTADO</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', fontSize: '13px' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {bonificacionesFiltradas.map((bonificacion, index) => (
                  <tr
                    key={bonificacion.idBonificacion}
                    style={{
                      background: index % 2 === 0 ? '#F3F4F6' : 'white',
                      borderBottom: '1px solid #E5E7EB',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#EFF6FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? '#F3F4F6' : 'white';
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>
                          {bonificacion.nombre}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          {bonificacion.descripcion?.substring(0, 50)}...
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge
                        color="primary"
                        variant="flat"
                        css={{
                          bgColor: '$blue100',
                          color: '$blue600',
                          fontWeight: '$semibold',
                        }}
                      >
                        {getTipoBonificacionLabel(bonificacion.tipo_bonificacion)}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge
                        color={bonificacion.activo ? 'success' : 'warning'}
                        variant="flat"
                        css={{
                          bgColor: bonificacion.activo ? '$green100' : '$yellow100',
                          color: bonificacion.activo ? '$green600' : '$yellow700',
                        }}
                      >
                        {bonificacion.activo ? '✓ Activa' : '⏸️ Inactiva'}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Flex css={{ gap: '$2', justifyContent: 'center' }}>
                        <Button
                          icon={<EyeIcon size={18} />}
                          auto
                          flat
                          size="sm"
                          color="primary"
                          onClick={() => handleVerBonificacion(bonificacion)}
                        />
                        <Button
                          icon={<EditIcon size={18} />}
                          auto
                          flat
                          size="sm"
                          color="success"
                          onClick={() => handleEditarBonificacion(bonificacion)}
                        />
                        <Button
                          icon={<DeleteIcon size={18} />}
                          auto
                          flat
                          size="sm"
                          color="error"
                          onClick={() => handleEliminarBonificacion(bonificacion.idBonificacion)}
                        />
                      </Flex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Crear/Editar */}
      {console.log('🎨 Renderizando Modal - isOpen:', isOpen)}
      <Modal width="700px" open={isOpen} onClose={() => setIsOpen(false)} closeButton scroll>
        <Modal.Header css={{ color: '#034F32', fontWeight: '$bold' }}>
          {isEditMode ? '✏️ Editar Bonificación' : '➕ Nueva Bonificación'}
        </Modal.Header>
        <Modal.Body>
          <BonificacionForm
            bonificacion={selectedBonificacion}
            isEditMode={isEditMode}
            onSuccess={handleGuardarBonificacion}
            onCancel={() => setIsOpen(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal width="600px" open={isViewOpen} onClose={() => setIsViewOpen(false)} closeButton>
        <Modal.Header css={{ color: '#034F32', fontWeight: '$bold' }}>
          📋 Detalles de Bonificación
        </Modal.Header>
        <Modal.Body css={{ gap: '$4' }}>
          {selectedBonificacion && (
            <>
              <Card css={{ bgColor: '$blue50', borderColor: '$blue200', border: '2px solid', p: '$4' }}>
                <Text weight="bold" size="$sm" color="#666">
                  Nombre
                </Text>
                <Text size="$lg" weight="semibold" color="#034F32">
                  {selectedBonificacion.nombre}
                </Text>
              </Card>

              <Card css={{ bgColor: '$gray50', borderColor: '$gray200', border: '2px solid', p: '$4' }}>
                <Text weight="bold" size="$sm" color="#666">
                  Descripción
                </Text>
                <Text size="$md" color="#333">
                  {selectedBonificacion.descripcion}
                </Text>
              </Card>

              <Card css={{ bgColor: '$green50', borderColor: '$green200', border: '2px solid', p: '$4' }}>
                <Text weight="bold" size="$sm" color="#666">
                  Tipo de Bonificación
                </Text>
                <Text size="$lg" weight="semibold" color="#17C964">
                  {getTipoBonificacionLabel(selectedBonificacion.tipo_bonificacion)}
                </Text>
              </Card>

              <Flex css={{ gap: '$4' }}>
                <Card css={{ bgColor: '$purple50', borderColor: '$purple200', border: '2px solid', p: '$4', flex: 1 }}>
                  <Text weight="bold" size="$sm" color="#666">
                    Cantidad a Bonificar
                  </Text>
                  <Text size="$xl" weight="bold" color="#8B5CF6">
                    {selectedBonificacion.cantidad_bonificacion} {selectedBonificacion.unidad}
                  </Text>
                </Card>

                <Card css={{ bgColor: '$orange50', borderColor: '$orange200', border: '2px solid', p: '$4', flex: 1 }}>
                  <Text weight="bold" size="$sm" color="#666">
                    Vigencia
                  </Text>
                  <Text size="$sm" weight="semibold" color="#FF9F1C">
                    {new Date(selectedBonificacion.fecha_inicio).toLocaleDateString('es-PE')} al{' '}
                    {new Date(selectedBonificacion.fecha_fin).toLocaleDateString('es-PE')}
                  </Text>
                </Card>
              </Flex>

              <Card css={{ bgColor: selectedBonificacion.activo ? '$green50' : '$yellow50', borderColor: selectedBonificacion.activo ? '$green200' : '$yellow200', border: '2px solid', p: '$4' }}>
                <Badge
                  color={selectedBonificacion.activo ? 'success' : 'warning'}
                  variant="flat"
                  css={{
                    bgColor: selectedBonificacion.activo ? '$green100' : '$yellow100',
                    color: selectedBonificacion.activo ? '$green600' : '$yellow700',
                  }}
                >
                  {selectedBonificacion.activo ? '✓ Bonificación Activa' : '⏸️ Bonificación Inactiva'}
                </Badge>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" auto flat onClick={() => setIsViewOpen(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};
