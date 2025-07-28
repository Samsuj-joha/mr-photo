export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* MR Logo */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #1f2937, #374151)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ 
            color: 'white', 
            fontSize: '1.5rem', 
            fontWeight: '300',
            letterSpacing: '2px'
          }}>
            MR
          </span>
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '300',
          color: '#1f2937',
          marginBottom: '1rem',
          letterSpacing: '3px'
        }}>
          MR PHOTOGRAPHY
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '2rem',
          fontWeight: '300'
        }}>
          Professional Photography Portfolio
        </p>
        
        <a 
          href="/admin/login"
          style={{
            display: 'inline-block',
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '400',
            fontSize: '1rem',
            letterSpacing: '1px',
            transition: 'all 0.2s'
          }}
        >
          Admin Access
        </a>
        
        <p style={{
          marginTop: '2rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Homepage is working! ✅
        </p>
      </div>
    </div>
  )
}