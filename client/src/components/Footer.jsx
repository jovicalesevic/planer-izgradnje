export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#111827',
      color: '#9ca3af',
      textAlign: 'center',
      padding: '16px 24px',
      fontSize: '13px',
      lineHeight: '1.6',
      marginTop: 'auto',
      borderTop: '1px solid #1f2937',
    }}>
      <p style={{ margin: '0 0 4px 0' }}>
        <strong style={{ color: '#d1d5db' }}>Disclaimer:</strong> Informacije u ovoj aplikaciji su informativnog karaktera. Planer Izgradnje ne preuzima odgovornost za tačnost podataka. Uvek konsultujte nadležne organe i stručna lica.
      </p>
      <p style={{ margin: 0 }}>
        Copyright &copy; 2026 Planer Izgradnje. Sva prava zadržana.
      </p>
    </footer>
  );
}
