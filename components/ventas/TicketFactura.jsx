import React, { forwardRef } from 'react';

const TicketFactura = forwardRef(({ venta }, ref) => {
  // Función para convertir número a letras
  const numeroALetras = (numero) => {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    if (numero === 0) return 'CERO';
    if (numero === 100) return 'CIEN';

    let resultado = '';
    
    // Millares
    const mil = Math.floor(numero / 1000);
    if (mil > 0) {
      if (mil === 1) {
        resultado += 'MIL ';
      } else {
        resultado += convertirCentenas(mil) + ' MIL ';
      }
    }
    
    // Centenas, decenas y unidades
    const resto = numero % 1000;
    if (resto > 0) {
      resultado += convertirCentenas(resto);
    }

    function convertirCentenas(n) {
      let res = '';
      const c = Math.floor(n / 100);
      const d = Math.floor((n % 100) / 10);
      const u = n % 10;

      if (c > 0) {
        res += centenas[c] + ' ';
      }

      if (d === 1 && u > 0) {
        res += especiales[u] + ' ';
      } else {
        if (d >= 2) {
          res += decenas[d];
          if (u > 0) {
            res += ' Y ';
          } else {
            res += ' ';
          }
        }
        if (u > 0 && d !== 1) {
          res += unidades[u] + ' ';
        }
      }

      return res.trim();
    }

    return resultado.trim();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Calcular totales
  const opGravadas = (venta.total / 1.18).toFixed(2);
  const igv = (venta.total - opGravadas).toFixed(2);
  const parteEntera = Math.floor(venta.total);
  const parteDecimal = Math.round((venta.total - parteEntera) * 100);
  const montoEnLetras = `${numeroALetras(parteEntera)} CON ${parteDecimal.toString().padStart(2, '0')}/100 PEN`;

  // Generar número de documento basado en el tipo
  const numeroDocumento = venta.tipoDocumento === 'factura' 
    ? `F${venta.numeroVenta.replace(/[^0-9]/g, '').padStart(11, '0').replace(/(\d{3})(\d{8})/, '$1-$2')}`
    : `B${venta.numeroVenta.replace(/[^0-9]/g, '').padStart(11, '0').replace(/(\d{3})(\d{8})/, '$1-$2')}`;

  const clienteNombre = venta.cliente.tipo === 'mayorista' 
    ? venta.cliente.razonSocial 
    : `${venta.cliente.nombres} ${venta.cliente.apellidos}`;
  
  const clienteDocumento = venta.cliente.tipo === 'mayorista' 
    ? venta.cliente.ruc 
    : venta.cliente.dni;

  return (
    <div ref={ref} style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      
      {/* Encabezado */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img 
            src="/img/bdp.png" 
            alt="Logo Bebidas del Perú" 
            style={styles.logo}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ ...styles.logoFallback, display: 'none' }}>
            <strong style={{ fontSize: '14pt' }}>BEBIDAS DEL PERÚ</strong>
          </div>
        </div>
        <h2 style={styles.companyName}>BEBIDAS DEL PERÚ</h2>
        <p style={styles.companyRuc}>RUC: 20123456789</p>
        <div style={styles.documentNumber}>
          <strong>NOTA DE PEDIDO</strong>
          <p style={styles.documentNumberText}>{numeroDocumento}</p>
          <p style={styles.documentSubtext}>(Documento Interno - No válido como comprobante)</p>
        </div>
      </div>

      <div style={styles.divider}></div>

      {/* Datos del Cliente */}
      <div style={styles.section}>
        <p style={styles.label}>
          <strong>{venta.cliente.tipo === 'mayorista' ? 'RAZÓN SOCIAL:' : 'CLIENTE:'}</strong> {clienteNombre}
        </p>
        <p style={styles.label}>
          <strong>{venta.cliente.tipo === 'mayorista' ? 'RUC:' : 'DNI:'}</strong> {clienteDocumento}
        </p>
        {venta.cliente.direccion && (
          <p style={styles.label}>
            <strong>DIRECCIÓN:</strong> {venta.cliente.direccion}
          </p>
        )}
        <p style={styles.label}>
          <strong>FECHA EMISIÓN:</strong> {formatDate(venta.fecha)}
        </p>
      </div>

      <div style={styles.divider}></div>

      {/* Tabla de Productos */}
      <div style={styles.section}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.thProducto}>PRODUCTO</th>
              <th style={styles.thCant}>CANT.</th>
              <th style={styles.thPrecio}>P.UNIT</th>
              <th style={styles.thImporte}>IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            {venta.items.map((item, index) => {
              const esBonificacion = parseFloat(item.precioUnitario) === 0 || parseFloat(item.subtotal) === 0;
              return (
                <tr key={item.id || index} style={styles.tableRow}>
                  <td style={styles.tdProducto}>
                    {item.nombreProducto}
                    {esBonificacion && (
                      <div style={styles.bonificacion}>BONIFICACIÓN - GRATIS</div>
                    )}
                    {item.presentacion && (
                      <div style={styles.presentacion}>({item.presentacion})</div>
                    )}
                  </td>
                  <td style={styles.tdCant}>{item.cantidad}</td>
                  <td style={styles.tdPrecio}>
                    {esBonificacion ? 'GRATIS' : formatCurrency(item.precioUnitario)}
                  </td>
                  <td style={styles.tdImporte}>
                    {esBonificacion ? 'S/ 0.00' : formatCurrency(item.subtotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={styles.divider}></div>

      {/* Totales */}
      <div style={styles.section}>
        <div style={styles.totalesContainer}>
          <div style={styles.totalRow}>
            <span>OP. GRAVADAS:</span>
            <span>{formatCurrency(parseFloat(opGravadas))}</span>
          </div>
          <div style={styles.totalRow}>
            <span>IGV (18%):</span>
            <span>{formatCurrency(parseFloat(igv))}</span>
          </div>
          <div style={styles.dividerThin}></div>
          <div style={styles.totalRow}>
            <strong>TOTAL VENTA:</strong>
            <strong>{formatCurrency(venta.total)}</strong>
          </div>
        </div>
      </div>

      <div style={styles.divider}></div>

      {/* Monto en Letras */}
      <div style={styles.section}>
        <p style={styles.montoLetras}>
          <strong>SON:</strong> {montoEnLetras}
        </p>
      </div>

      <div style={styles.divider}></div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.vendedor}>
          <strong>VENDEDOR:</strong> {venta.vendedor.nombres} {venta.vendedor.apellidos}
        </p>
        
        <div style={styles.qrContainer}>
          <img 
            src="/img/BDP%20QRCODE.png" 
            alt="Código QR" 
            style={styles.qrImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ ...styles.qrPlaceholder, display: 'none' }}>
            [CÓDIGO QR]
          </div>
        </div>

        <p style={styles.representacion}>
          DOCUMENTO INTERNO - NO VÁLIDO COMO COMPROBANTE DE PAGO
        </p>
        <p style={styles.representacion}>
          El comprobante electrónico será enviado posteriormente
        </p>
        
        <div style={styles.gracias}>
          ¡GRACIAS POR SU COMPRA!
        </div>
      </div>
    </div>
  );
});

TicketFactura.displayName = 'TicketFactura';

// Estilos del componente
const styles = {
  container: {
    width: '78mm',
    margin: '0 auto',
    padding: '2mm',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '9pt',
    lineHeight: '1.3',
    color: '#000',
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '8px',
  },
  logoContainer: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '25mm',
  },
  logo: {
    maxWidth: '35mm',
    maxHeight: '25mm',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    filter: 'grayscale(100%) contrast(150%)',
  },
  logoFallback: {
    padding: '8px',
    border: '2px solid #000',
    textAlign: 'center',
  },
  companyName: {
    fontSize: '12pt',
    fontWeight: 'bold',
    margin: '4px 0',
  },
  companyRuc: {
    fontSize: '9pt',
    margin: '2px 0',
  },
  documentNumber: {
    border: '1px solid #000',
    padding: '4px',
    margin: '8px 0',
  },
  documentNumberText: {
    fontSize: '11pt',
    fontWeight: 'bold',
    margin: '2px 0',
  },
  documentSubtext: {
    fontSize: '7pt',
    margin: '4px 0 0 0',
    fontStyle: 'italic',
  },
  divider: {
    borderTop: '1px dashed #000',
    margin: '6px 0',
  },
  dividerThin: {
    borderTop: '1px solid #000',
    margin: '2px 0',
  },
  section: {
    marginBottom: '6px',
  },
  label: {
    fontSize: '8pt',
    margin: '2px 0',
    lineHeight: '1.2',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '8pt',
  },
  tableHeader: {
    borderBottom: '1px solid #000',
  },
  thProducto: {
    textAlign: 'left',
    padding: '2px',
    width: '45%',
  },
  thCant: {
    textAlign: 'center',
    padding: '2px',
    width: '15%',
  },
  thPrecio: {
    textAlign: 'right',
    padding: '2px',
    width: '20%',
  },
  thImporte: {
    textAlign: 'right',
    padding: '2px',
    width: '20%',
  },
  tableRow: {
    borderBottom: '1px dotted #ccc',
  },
  tdProducto: {
    padding: '3px 2px',
    textAlign: 'left',
  },
  presentacion: {
    fontSize: '7pt',
    color: '#333',
    marginTop: '1px',
  },
  bonificacion: {
    fontSize: '7pt',
    fontWeight: 'bold',
    color: '#000',
    marginTop: '2px',
    padding: '1px 0',
  },
  tdCant: {
    padding: '3px 2px',
    textAlign: 'center',
  },
  tdPrecio: {
    padding: '3px 2px',
    textAlign: 'right',
  },
  tdImporte: {
    padding: '3px 2px',
    textAlign: 'right',
  },
  totalesContainer: {
    marginTop: '4px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 0',
    fontSize: '9pt',
  },
  montoLetras: {
    fontSize: '8pt',
    textAlign: 'center',
    margin: '4px 0',
    lineHeight: '1.3',
  },
  footer: {
    textAlign: 'center',
    fontSize: '8pt',
  },
  vendedor: {
    margin: '4px 0',
    textAlign: 'left',
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '8px 0',
    minHeight: '25mm',
  },
  qrImage: {
    width: '25mm',
    height: '25mm',
    objectFit: 'contain',
    filter: 'grayscale(100%) contrast(150%)',
  },
  qrPlaceholder: {
    width: '25mm',
    height: '25mm',
    border: '1px solid #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '7pt',
  },
  representacion: {
    fontSize: '7pt',
    margin: '2px 0',
  },
  gracias: {
    fontSize: '10pt',
    fontWeight: 'bold',
    marginTop: '8px',
    paddingTop: '6px',
    borderTop: '1px dashed #000',
  },
};

// Estilos para impresión
const printStyles = `
  @media print {
    @page {
      size: 80mm auto;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
    }
    
    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    
    img {
      filter: grayscale(100%) contrast(150%) !important;
    }
    
    /* Ocultar elementos no necesarios en impresión */
    .no-print {
      display: none !important;
    }
    
    /* Asegurar que todo sea en blanco y negro */
    * {
      color: #000 !important;
      background: #fff !important;
    }
    
    /* Evitar saltos de página */
    .ticket-container {
      page-break-inside: avoid;
    }
  }
`;

export default TicketFactura;
