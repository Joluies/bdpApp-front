import * as XLSX from 'xlsx';

/**
 * Función auxiliar para descargar un archivo Excel
 */
const downloadExcel = (workbook: XLSX.WorkBook, filename: string) => {
   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
   const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   const url = window.URL.createObjectURL(data);
   const link = document.createElement('a');
   link.href = url;
   link.download = filename;
   link.click();
   window.URL.revokeObjectURL(url);
};

/**
 * Genera el nombre del archivo con fecha actual
 */
const getFilenameWithDate = (baseName: string): string => {
   const date = new Date();
   const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
   return `${baseName}_${dateStr}.xlsx`;
};

/**
 * Descarga el reporte de Ventas Diarias en formato Excel
 */
export const downloadReporteVentasDiarias = async () => {
   try {
      // Aquí deberías obtener los datos reales desde tu API
      // Por ahora creo un ejemplo con datos de muestra
      const datosVentas = [
         { Fecha: '2024-01-15', Vendedor: 'Juan Pérez', Cliente: 'Tienda ABC', Total: 1500.00, Estado: 'Completada' },
         { Fecha: '2024-01-15', Vendedor: 'María García', Cliente: 'Supermercado XYZ', Total: 2300.00, Estado: 'Completada' },
         { Fecha: '2024-01-15', Vendedor: 'Carlos López', Cliente: 'Distribuidora 123', Total: 1800.00, Estado: 'Completada' },
      ];

      // Crear libro de trabajo
      const workbook = XLSX.utils.book_new();
      
      // Crear hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(datosVentas);
      
      // Ajustar el ancho de las columnas
      const columnWidths = [
         { wch: 12 }, // Fecha
         { wch: 20 }, // Vendedor
         { wch: 25 }, // Cliente
         { wch: 12 }, // Total
         { wch: 12 }, // Estado
      ];
      worksheet['!cols'] = columnWidths;
      
      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas Diarias');
      
      // Descargar archivo
      downloadExcel(workbook, getFilenameWithDate('Reporte_Ventas_Diarias'));
      
   } catch (error) {
      console.error('Error al generar el reporte de ventas diarias:', error);
      alert('Error al generar el reporte. Por favor, intente nuevamente.');
   }
};

/**
 * Descarga el reporte de Pedidos Programados en formato Excel
 */
export const downloadReportePedidosProgramados = async () => {
   try {
      // Aquí deberías obtener los datos reales desde tu API
      const datosPedidos = [
         { 
            Fecha_Programada: '2024-01-20', 
            Cliente: 'Tienda ABC', 
            Vendedor: 'Juan Pérez', 
            Productos: 'Coca Cola 2L x10, Sprite 2L x5',
            Total: 850.00, 
            Estado: 'Pendiente' 
         },
         { 
            Fecha_Programada: '2024-01-21', 
            Cliente: 'Supermercado XYZ', 
            Vendedor: 'María García', 
            Productos: 'Fanta 2L x15, Pepsi 2L x10',
            Total: 1200.00, 
            Estado: 'Confirmado' 
         },
         { 
            Fecha_Programada: '2024-01-22', 
            Cliente: 'Distribuidora 123', 
            Vendedor: 'Carlos López', 
            Productos: 'Agua 500ml x50',
            Total: 650.00, 
            Estado: 'Pendiente' 
         },
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(datosPedidos);
      
      // Ajustar anchos de columnas
      const columnWidths = [
         { wch: 18 }, // Fecha_Programada
         { wch: 25 }, // Cliente
         { wch: 20 }, // Vendedor
         { wch: 35 }, // Productos
         { wch: 12 }, // Total
         { wch: 12 }, // Estado
      ];
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Programados');
      downloadExcel(workbook, getFilenameWithDate('Reporte_Pedidos_Programados'));
      
   } catch (error) {
      console.error('Error al generar el reporte de pedidos programados:', error);
      alert('Error al generar el reporte. Por favor, intente nuevamente.');
   }
};

/**
 * Descarga el reporte de Cierre de Caja en formato Excel
 */
export const downloadReporteCierreCaja = async () => {
   try {
      // Aquí deberías obtener los datos reales desde tu API
      const datosCierre = {
         informacionGeneral: [
            { Campo: 'Fecha de Cierre', Valor: '2024-01-15' },
            { Campo: 'Usuario', Valor: 'Admin' },
            { Campo: 'Hora de Cierre', Valor: '18:30' },
         ],
         resumenVentas: [
            { Concepto: 'Total Ventas en Efectivo', Monto: 5800.00 },
            { Concepto: 'Total Ventas con Tarjeta', Monto: 3200.00 },
            { Concepto: 'Total Ventas con Transferencia', Monto: 2500.00 },
            { Concepto: 'Total General', Monto: 11500.00 },
         ],
         detalleVentas: [
            { Hora: '09:00', Vendedor: 'Juan Pérez', Forma_Pago: 'Efectivo', Monto: 1500.00 },
            { Hora: '10:30', Vendedor: 'María García', Forma_Pago: 'Tarjeta', Monto: 2300.00 },
            { Hora: '12:15', Vendedor: 'Carlos López', Forma_Pago: 'Transferencia', Monto: 1800.00 },
            { Hora: '14:00', Vendedor: 'Juan Pérez', Forma_Pago: 'Efectivo', Monto: 950.00 },
            { Hora: '16:30', Vendedor: 'María García', Forma_Pago: 'Tarjeta', Monto: 900.00 },
         ],
      };

      const workbook = XLSX.utils.book_new();
      
      // Hoja 1: Información General
      const wsInfo = XLSX.utils.json_to_sheet(datosCierre.informacionGeneral);
      wsInfo['!cols'] = [{ wch: 20 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, wsInfo, 'Información General');
      
      // Hoja 2: Resumen de Ventas
      const wsResumen = XLSX.utils.json_to_sheet(datosCierre.resumenVentas);
      wsResumen['!cols'] = [{ wch: 30 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, wsResumen, 'Resumen');
      
      // Hoja 3: Detalle de Ventas
      const wsDetalle = XLSX.utils.json_to_sheet(datosCierre.detalleVentas);
      wsDetalle['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 18 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, wsDetalle, 'Detalle de Ventas');
      
      downloadExcel(workbook, getFilenameWithDate('Reporte_Cierre_Caja'));
      
   } catch (error) {
      console.error('Error al generar el reporte de cierre de caja:', error);
      alert('Error al generar el reporte. Por favor, intente nuevamente.');
   }
};
