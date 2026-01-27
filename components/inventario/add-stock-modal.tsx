import React, { useState, useMemo } from 'react';
import {
  Modal,
  Button,
  Input,
  Text,
  Card,
  Loading,
} from '@nextui-org/react';
import { StockItem, inventarioApiService, AddStockRequest } from '../../services/inventario-api.service';

interface AddStockModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productos: StockItem[];
  onSuccess?: () => void;
  isLoading?: boolean;
}

/**
 * Modal para agregar stock a productos
 */
export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onOpenChange,
  productos,
  onSuccess,
  isLoading: externalLoading = false,
}) => {
  const [selectedProducto, setSelectedProducto] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedProductoData = useMemo(() => {
    return productos.find((p) => p.idProducto === Number(selectedProducto));
  }, [selectedProducto, productos]);

  const handleAddStock = async () => {
    try {
      setError(null);
      setSuccess(false);

      // Validaciones
      if (!selectedProducto) {
        setError('Debes seleccionar un producto');
        return;
      }

      const cantidadNum = Number(cantidad);
      if (!cantidad || cantidadNum <= 0) {
        setError('La cantidad debe ser mayor a 0');
        return;
      }

      if (cantidadNum > 10000) {
        setError('La cantidad no puede exceder 10,000 unidades');
        return;
      }

      setIsLoading(true);

      const request: AddStockRequest = {
        idProducto: Number(selectedProducto),
        cantidad: cantidadNum,
      };

      const response = await inventarioApiService.addStock(request);

      if (response.success) {
        setSuccess(true);
        setSelectedProducto('');
        setCantidad('');
        
        // Limpiar mensaje de éxito después de 2 segundos
        setTimeout(() => {
          setSuccess(false);
          onOpenChange(false);
          onSuccess?.();
        }, 2000);
      } else {
        setError(response.message || 'Error al agregar stock');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading && !success) {
      setSelectedProducto('');
      setCantidad('');
      setError(null);
      setSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      width="500px"
    >
      <Modal.Header>
        <Text h3>📦 Ingresar Stock a Bodega</Text>
      </Modal.Header>

      <Modal.Body>
        {success ? (
          <Card className="bg-green-50">
            <Text h4 className="text-green-700">
              ✅ Stock ingresado correctamente
            </Text>
            <Text className="text-green-600">
              {selectedProductoData?.nombre} +{cantidad} unidades
            </Text>
          </Card>
        ) : (
          <>
            {error && (
              <Card className="bg-red-50">
                <Text className="text-red-700 font-semibold text-sm">
                  ⚠️ {error}
                </Text>
              </Card>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Selecciona Producto
              </label>
              <select
                value={selectedProducto}
                onChange={(e) => {
                  setSelectedProducto(e.target.value);
                  setError(null);
                }}
                disabled={isLoading || externalLoading}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                }}
              >
                <option value="">-- Selecciona un producto --</option>
                {productos.map((producto) => (
                  <option key={producto.idProducto} value={String(producto.idProducto)}>
                    {producto.nombre} (Stock: {producto.stock})
                  </option>
                ))}
              </select>
            </div>

            {selectedProductoData && (
              <Card className="bg-blue-50">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Text size={12} className="text-gray-600">
                      Stock Actual
                    </Text>
                    <Text weight="bold">{selectedProductoData.stock} unidades</Text>
                  </div>
                  <div>
                    <Text size={12} className="text-gray-600">
                      Precio Unitario
                    </Text>
                    <Text weight="bold">
                      S/. {Number(selectedProductoData.precioUnitario).toFixed(2)}
                    </Text>
                  </div>
                </div>
              </Card>
            )}

            <Input
              type="number"
              label="Cantidad a Ingresar"
              placeholder="0"
              value={cantidad}
              onChange={(e) => {
                setCantidad(e.target.value);
                setError(null);
              }}
              disabled={isLoading || externalLoading || !selectedProducto}
              min={1}
              required
            />

            {cantidad && selectedProductoData && (
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text size={12}>Cantidad a ingresar:</Text>
                  <Text weight="bold">{cantidad} unidades</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <Text size={12}>Stock después:</Text>
                  <Text weight="bold" className="text-green-700">
                    {selectedProductoData.stock + Number(cantidad)} unidades
                  </Text>
                </div>
              </Card>
            )}
          </>
        )}
      </Modal.Body>

      {!success && (
        <Modal.Footer>
          <Button
            auto
            flat
            onPress={handleClose}
            disabled={isLoading || externalLoading}
          >
            Cancelar
          </Button>
          <Button
            auto
            onPress={handleAddStock}
            disabled={!selectedProducto || !cantidad || isLoading || externalLoading}
          >
            {isLoading || externalLoading ? 'Guardando...' : 'Guardar Stock'}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};
