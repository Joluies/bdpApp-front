import React from 'react';
import {
  Table,
  Image,
  Loading,
  Tooltip,
  Card,
  Text,
} from '@nextui-org/react';
import { StockItem, getUnidadesPorPaquete } from '../../services/inventario-api.service';

const STOCK_BAJO_THRESHOLD = 10;
const STOCK_AGOTADO_THRESHOLD = 0;

interface StockTableProps {
  items: StockItem[];
  isLoading?: boolean;
  onRowClick?: (item: StockItem) => void;
}

const columns = [
  { key: 'imagen', name: 'Imagen', align: 'center' as const },
  { key: 'nombre', name: 'Producto', align: 'start' as const },
  { key: 'precio', name: 'Precio Unit.', align: 'end' as const },
  { key: 'stock', name: 'Stock (Paquetes)', align: 'center' as const },
  { key: 'estado', name: 'Estado', align: 'center' as const },
];

/**
 * Componente tabla de stock con colores de alerta para stock bajo
 */
export const StockTable: React.FC<StockTableProps> = ({
  items,
  isLoading = false,
  onRowClick,
}) => {
  const getStockStatus = (stock: number) => {
    if (stock <= STOCK_AGOTADO_THRESHOLD) {
      return {
        label: 'AGOTADO',
        color: 'error' as const,
        bgColor: 'bg-red-50',
      };
    }
    if (stock < STOCK_BAJO_THRESHOLD) {
      return {
        label: 'STOCK BAJO',
        color: 'warning' as const,
        bgColor: 'bg-yellow-50',
      };
    }
    return {
      label: 'DISPONIBLE',
      color: 'success' as const,
      bgColor: 'bg-green-50',
    };
  };

  const renderCell = (item: StockItem, columnKey: React.Key) => {
    const status = getStockStatus(item.stock);

    switch (columnKey) {
      case 'imagen':
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {item.urlImage ? (
              <Image
                src={item.urlImage}
                alt={item.nombre}
                width={50}
                height={50}
                css={{ borderRadius: '8px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  background: '#e0e0e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '12px', color: '#757575' }}>N/A</span>
              </div>
            )}
          </div>
        );

      case 'nombre':
        return <Text b>{item.nombre}</Text>;

      case 'precio':
        return <Text>S/.{Number(item.precioUnitario).toFixed(2)}</Text>;

      case 'stock':
        const unidadesPorPaquete =
          item.unidadesPorPaquete ?? getUnidadesPorPaquete(item.presentacion);
        const paquetes =
          item.stockPaquetes ?? Math.floor(item.stock / unidadesPorPaquete);
        const unidadesSueltas =
          item.stockUnidadesSueltas ?? (item.stock % unidadesPorPaquete);

        return (
          <Tooltip
            content={
              <div style={{ fontSize: '12px' }}>
                <div>Total: {item.stock} unidades</div>
                {item.presentacion && (
                  <div style={{ color: '#999', fontSize: '10px' }}>
                    {item.presentacion}
                  </div>
                )}
                <div
                  style={{
                    marginTop: '4px',
                    paddingTop: '4px',
                    borderTop: '1px solid #ccc',
                  }}
                >
                  <div>
                    {paquetes} paquetes de {unidadesPorPaquete} (
                    {paquetes * unidadesPorPaquete} unidades)
                  </div>
                  {unidadesSueltas > 0 && (
                    <div style={{ color: '#999' }}>
                      + {unidadesSueltas} unidades sueltas
                    </div>
                  )}
                </div>
              </div>
            }
            color={status.color}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Text
                b
                size={18}
                color={status.color}
              >
                {paquetes} paq.
              </Text>
              {unidadesSueltas > 0 && (
                <Text size={12} color="$gray600">
                  +{unidadesSueltas} unid.
                </Text>
              )}
            </div>
          </Tooltip>
        );

      case 'estado':
        return (
          <span 
            style={{
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: status.color === 'error' ? '#fee2e2' : 
                             status.color === 'warning' ? '#fef3c7' : 
                             '#d1fae5',
              color: status.color === 'error' ? '#991b1b' : 
                    status.color === 'warning' ? '#92400e' : 
                    '#065f46'
            }}
          >
            {status.label}
          </span>
        );

      default:
        return <Text>-</Text>;
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <Card css={{ width: '100%', padding: '$8' }}>
        <Card.Body
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loading type="spinner" size="lg" color="primary" />
          <Text css={{ marginTop: '$4' }}>Cargando inventario...</Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Table
      aria-label="Tabla de Stock"
      css={{
        height: 'auto',
        minWidth: '100%',
      }}
      lined
      headerLined
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key} align={column.align}>
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={items}>
        {(item) => (
          <Table.Row
            key={item.idProducto}
            css={{
              cursor: onRowClick ? 'pointer' : 'default',
              '&:hover': {
                backgroundColor: '$gray50',
              },
            }}
          >
            {(columnKey) => (
              <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};
