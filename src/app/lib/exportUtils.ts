import { notifications } from './notifications';

export const exportUtils = {
  // Export to CSV
  toCSV: (data: any[], filename: string, headers?: string[]) => {
    try {
      if (!data || data.length === 0) {
        notifications.warning('No data to export');
        return;
      }

      // Get headers from first object if not provided
      const csvHeaders = headers || Object.keys(data[0]);
      
      // Convert data to CSV format
      const csvContent = [
        csvHeaders.join(','),
        ...data.map(row =>
          csvHeaders.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      notifications.skiltrak.exportComplete(`${filename}.csv`);
    } catch (error) {
      console.error('CSV export failed:', error);
      notifications.error('Export failed', 'Unable to export data to CSV');
    }
  },

  // Export to JSON
  toJSON: (data: any, filename: string) => {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      notifications.skiltrak.exportComplete(`${filename}.json`);
    } catch (error) {
      console.error('JSON export failed:', error);
      notifications.error('Export failed', 'Unable to export data to JSON');
    }
  },

  // Export to PDF (mock - would need a PDF library in production)
  toPDF: (filename: string) => {
    notifications.info('PDF Export', 'PDF export would be implemented with a library like jsPDF');
    // In production, use libraries like:
    // - jsPDF
    // - pdfmake
    // - react-pdf
  },

  // Export table to Excel format
  toExcel: (data: any[], filename: string) => {
    // This creates an Excel-compatible CSV with UTF-8 BOM
    try {
      if (!data || data.length === 0) {
        notifications.warning('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join('\t'),
        ...data.map(row =>
          headers.map(header => row[header]).join('\t')
        )
      ].join('\n');

      // Add UTF-8 BOM for Excel compatibility
      const blob = new Blob(['\ufeff' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xls`;
      link.click();
      window.URL.revokeObjectURL(url);

      notifications.skiltrak.exportComplete(`${filename}.xls`);
    } catch (error) {
      console.error('Excel export failed:', error);
      notifications.error('Export failed', 'Unable to export data to Excel');
    }
  },

  // Generate printable version
  print: (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      notifications.error('Print failed', 'Element not found');
      return;
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      notifications.error('Print failed', 'Unable to open print window');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  },
};

// Utility to format data for export
export const formatForExport = {
  currency: (value: number) => `$${value.toFixed(2)}`,
  date: (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString();
  },
  percentage: (value: number) => `${value.toFixed(1)}%`,
  boolean: (value: boolean) => value ? 'Yes' : 'No',
};
