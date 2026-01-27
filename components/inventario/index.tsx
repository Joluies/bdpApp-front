import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  Button,
  Spacer,
  Text,
  Grid,
  Loading,
  Tooltip,
  Container,
} from '@nextui-org/react';
import {
  Download,
  RefreshCw,
  Plus,
  AlertTriangle,
  Package,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import {
  useStockPolling,
  useStockBajo,
  useInventarioStats,
} from '../../hooks/use-stock-polling';
import { inventarioApiService, StockItem } from '../../services/inventario-api.service';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { AddStockModal } from './add-stock-modal';

const STOCK_BAJO_THRESHOLD = 10;

export const InventarioContent = () => {
  useProtectedRoute();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState<'nombre' | 'stock' | 'precio'>('nombre');

  const {
    data: stockItems,
    isLoading: isLoadingStock,
    error: stockError,
    mutate: refrescaStock,
  } = useStockPolling({
    pollingInterval: 10000,
    enabled: true,
  });

  const { data: productosStockBajo } = useStockBajo(STOCK_BAJO_THRESHOLD);
  const { stats } = useInventarioStats();

  const filteredAndSortedItems = useMemo(() => {
    let filtered = stockItems.filter(
      (item) =>
        !searchValue ||
        item.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stock':
          return a.stock - b.stock;
        case 'precio':
          return a.precioUnitario - b.precioUnitario;
        case 'nombre':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });
  }, [stockItems, searchValue, sortBy]);

  const handleDownloadReport = useCallback(async () => {
    try {
      setIsDownloading(true);
      const blob = await inventarioApiService.downloadDailyReport();
      
      // Verificar que el blob tenga contenido
      if (!blob || blob.size === 0) {
        throw new Error('El reporte está vacío');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fecha = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `reporte-inventario-${fecha}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Reporte descargado exitosamente');
    } catch (error) {
      console.error('❌ Error descargando reporte:', error);
      alert('Error al descargar el reporte. Verifica que haya productos en el inventario.');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const handleModalClose = useCallback((isOpenModal: boolean) => {
    if (!isOpenModal) {
      setIsOpen(false);
      setTimeout(() => {
        refrescaStock();
      }, 500);
    }
  }, [refrescaStock]);

  return (
    <Container
      fluid
      css={{
        padding: '$10',
        maxWidth: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>
            📦 Gestión de Inventario
          </h1>
          <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>
            Control de stock en tiempo real con polling automático
          </p>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Tooltip
            content="Actualizar datos ahora"
            color="invert"
            placement="bottomEnd"
          >
            <Button
              auto
              onClick={refrescaStock}
              icon={<RefreshCw size={18} />}
              css={{ minWidth: '120px' }}
            >
              Refrescar
            </Button>
          </Tooltip>

          <Button
            auto
            onClick={() => setIsOpen(true)}
            icon={<Plus size={18} />}
            color="primary"
            css={{ minWidth: '120px' }}
          >
            Ingresar
          </Button>

          <Button
            auto
            onClick={handleDownloadReport}
            disabled={isDownloading}
            icon={isDownloading ? <RefreshCw size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
            color="success"
            css={{ minWidth: '160px' }}
          >
            {isDownloading ? 'Descargando...' : 'Descargar Excel'}
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <Grid.Container gap={2} css={{ marginBottom: '$8' }}>
        <Grid xs={12} sm={6} md={3}>
          <Card
            css={{
              background: '$blue50',
              border: '1px solid $blue200',
              width: '100%',
            }}
          >
            <Card.Body css={{ py: '$10' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={20} color="#0072F5" />
                  <Text b size={14}>
                    Total de Productos
                  </Text>
                </div>
                <Text b size={24}>
                  {stats?.totalProductos || 0}
                </Text>
              </div>
            </Card.Body>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            css={{
              background: '$yellow50',
              border: '1px solid $yellow200',
              width: '100%',
            }}
          >
            <Card.Body css={{ py: '$10' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} color="#F5A524" />
                  <Text b size={14}>
                    Stock Bajo
                  </Text>
                </div>
                <Text b size={24} color="warning">
                  {productosStockBajo?.length || 0}
                </Text>
              </div>
            </Card.Body>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            css={{
              background: '$red50',
              border: '1px solid $red200',
              width: '100%',
            }}
          >
            <Card.Body css={{ py: '$10' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingDown size={20} color="#F31260" />
                  <Text b size={14}>
                    Agotados
                  </Text>
                </div>
                <Text b size={24} color="error">
                  {stats?.productosAgotados || 0}
                </Text>
              </div>
            </Card.Body>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            css={{
              background: '$green50',
              border: '1px solid $green200',
              width: '100%',
            }}
          >
            <Card.Body css={{ py: '$10' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={20} color="#17C964" />
                  <Text b size={14}>
                    Valor Total
                  </Text>
                </div>
                <Text b size={24} color="success">
                  S/. {(stats?.valorTotalInventario || 0).toFixed(2)}
                </Text>
              </div>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>

      {/* Widget de alertas */}
      {productosStockBajo && productosStockBajo.length > 0 && (
        <>
          <Card css={{ padding: '$4', marginBottom: '$2', background: '$yellow50' }}>
            <Card.Header>
              <Text h4>⚠️ Stock Bajo Detectado</Text>
            </Card.Header>
            <Card.Body>
              <Text size={14}>Hay {productosStockBajo.length} productos con stock bajo</Text>
            </Card.Body>
          </Card>
          <Spacer y={2} />
        </>
      )}

      {/* Tabla de stock */}
      <Card css={{ padding: '$4', marginBottom: '$2' }}>
        <Card.Header
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '$4',
            flexWrap: 'wrap',
            gap: '$2',
          }}
        >
          <Text h3>📊 Stock Actual</Text>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                fontSize: '14px',
                minWidth: '200px',
              }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="nombre">Ordenar: Nombre</option>
              <option value="stock">Ordenar: Stock</option>
              <option value="precio">Ordenar: Precio</option>
            </select>
          </div>
        </Card.Header>

        <Card.Body css={{ py: '$0' }}>
          {isLoadingStock ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
              }}
            >
              <Loading />
            </div>
          ) : stockError ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                gap: '16px',
              }}
            >
              <Text color="error" size={16} weight="bold">
                ❌ Error al cargar stock
              </Text>
              <Text size={14}>{stockError.message}</Text>
              <Button auto color="primary" onClick={refrescaStock}>
                Reintentar
              </Button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Producto</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Precio</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedItems.map((item) => (
                  <tr key={item.idProducto} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>{item.nombre}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                      {item.stock}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      S/. {item.precioUnitario.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card.Body>
      </Card>

      {/* Modal para agregar stock */}
      <AddStockModal
        isOpen={isOpen}
        onOpenChange={handleModalClose}
        productos={stockItems}
        onSuccess={refrescaStock}
        isLoading={isLoadingStock}
      />

      <Spacer y={2} />
    </Container>
  );
};
