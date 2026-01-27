import React from 'react';
import { Card, Text, Badge, Progress } from '@nextui-org/react';
import { AlertTriangle } from 'lucide-react';
import { StockItem } from '../../services/inventario-api.service';

interface StockAlertWidgetProps {
  productosStockBajo: StockItem[];
  threshold?: number;
}

/**
 * Widget que muestra alerta de productos con stock crítico
 */
export const StockAlertWidget: React.FC<StockAlertWidgetProps> = ({
  productosStockBajo,
  threshold = 10,
}) => {
  const count = productosStockBajo.length;
  const showAlert = count > 0;

  if (!showAlert) {
    return null;
  }

  return (
    <Card
      className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-orange-200 mb-6 p-6"
      css={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <AlertTriangle className="w-6 h-6 text-orange-600" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <Text
              h4
              className="text-orange-900 font-bold m-0"
              size={18}
            >
              ⚠️ Alerta: {count} {count === 1 ? 'producto' : 'productos'} con stock crítico
            </Text>
            <Badge
              content={count}
              color="error"
              size="lg"
              className="font-bold"
            />
          </div>

          <Text className="text-orange-800 mb-4 text-sm">
            Los siguientes productos tienen stock menor a {threshold} unidades:
          </Text>

          {/* Lista de productos con stock bajo */}
          <div className="space-y-2 mb-3">
            {productosStockBajo.slice(0, 5).map((producto) => (
              <div
                key={producto.idProducto}
                className="flex items-center justify-between bg-white bg-opacity-60 rounded-lg p-2 px-3"
              >
                <div className="flex-1">
                  <Text
                    size={13}
                    className="font-medium text-gray-800"
                  >
                    {producto.nombre}
                  </Text>
                  <Progress
                    value={(producto.stock / threshold) * 100}
                    max={100}
                    size="xs"
                    color="error"
                    className="mt-1"
                  />
                </div>
                <div className="ml-3 text-right">
                  <Text
                    size={13}
                    className="font-bold text-red-600"
                  >
                    {producto.stock} unid.
                  </Text>
                </div>
              </div>
            ))}
          </div>

          {/* Mostrar si hay más productos */}
          {count > 5 && (
            <Text
              size={12}
              className="text-orange-700 italic"
            >
              +{count - 5} más...
            </Text>
          )}

          {/* Recomendación */}
          <div className="mt-4 p-3 bg-white bg-opacity-40 rounded-lg border border-orange-200">
            <Text size={12} className="text-orange-800">
              <span className="font-semibold">Acción recomendada:</span> Ingresa stock inmediatamente
              para evitar desabastecimiento.
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};
