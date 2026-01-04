import React from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Text, Button, Spacer } from '@nextui-org/react';

const Unauthorized: React.FC = () => {
  const router = useRouter();

  return (
    <Container
      display="flex"
      alignItems="center"
      justifyContent="center"
      css={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        css={{
          padding: '$20',
          textAlign: 'center',
          maxWidth: '500px',
        }}
      >
        <Text h1 color="error" css={{ fontSize: '60px', margin: '0' }}>
          🚫
        </Text>

        <Text h2 css={{ margin: '20px 0 10px 0' }}>
          Acceso Denegado
        </Text>

        <Text size="lg" color="warning" css={{ margin: '0 0 20px 0' }}>
          No tienes permisos para acceder a esta sección.
        </Text>

        <Text size="sm" color="default" css={{ margin: '0 0 30px 0', lineHeight: '1.6' }}>
          Por favor contacta al administrador si crees que esto es un error.
        </Text>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button
            color="primary"
            onClick={() => router.push('/')}
          >
            ← Volver al Dashboard
          </Button>

          <Button
            color="warning"
            onClick={() => router.push('/login')}
          >
            🔓 Cerrar Sesión
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default Unauthorized;
