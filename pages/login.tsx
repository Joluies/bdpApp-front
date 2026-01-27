import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Card,
  Input,
  Button,
  Text,
  Loading,
  Spacer,
  Image,
} from '@nextui-org/react';
import { useAuth } from '../context/auth.context';

const Login: React.FC = () => {
  const router = useRouter();
  const { login, autenticado, cargando, error, limpiarError } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string>('');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (autenticado && !cargando) {
      router.push('/');
    }
  }, [autenticado, cargando, router]);

  // Mostrar error del contexto
  useEffect(() => {
    if (error) {
      setErrorLocal(error);
    }
  }, [error]);

  const validarFormulario = (): boolean => {
    if (!username || username.trim().length < 3) {
      setErrorLocal('Usuario debe tener al menos 3 caracteres');
      return false;
    }

    if (!password || password.length < 6) {
      setErrorLocal('Contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    limpiarError();

    // Validar
    if (!validarFormulario()) {
      return;
    }

    try {
      setEnviando(true);

      // Llamar a función de login del contexto
      const exitoso = await login(username, password);

      if (exitoso) {
        // El useEffect redirigirá automáticamente
        console.log('✅ Login exitoso, redirigiendo...');
      } else {
        console.log('❌ Login fallido');
      }
    } catch (err: any) {
      setErrorLocal(err.message || 'Error desconocido');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <Container
        display="flex"
        alignItems="center"
        justify="center"
        css={{ minHeight: '100vh' }}
      >
        <Loading />
      </Container>
    );
  }

  return (
    <Container
      display="flex"
      alignItems="center"
      justify="center"
      css={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <Card
          css={{
            padding: '$20',
            borderRadius: '$xl',
            boxShadow: '0 20px 60px rgba(30, 64, 175, 0.3)',
            border: 'none',
            background: 'white'
          }}
        >
          {/* Logo/Header */}
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
              borderRadius: '12px',
              marginLeft: '-32px',
              marginRight: '-32px',
              marginTop: '-32px',
              marginBottom: '20px'
            }}
          >
            <Text h1 css={{ margin: '0 0 10px 0', color: 'white' }}>
              🥤
            </Text>
            <Text h3 css={{ margin: '0', color: 'white', fontWeight: 'bold' }}>
              Bebidas del Perú
            </Text>
            <Text size="sm" css={{ margin: '5px 0 0 0', color: 'rgba(255, 255, 255, 0.8)' }}>
              Sistema de Gestión
            </Text>
          </div>

          <Spacer y={1} />

          {/* Formulario */}
          <form onSubmit={handleLogin}>
            {/* Username */}
            <Input
              fullWidth
              clearable
              label="Usuario"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorLocal('');
              }}
              disabled={enviando}
              required
              color={username ? 'success' : 'default'}
              contentLeft={<Text>👤</Text>}
              css={{
                '& input': {
                  borderColor: '#e5e7eb !important',
                  '&:focus': {
                    borderColor: '#1e40af !important',
                  }
                }
              }}
            />

            <Spacer y={1} />

            {/* Password */}
            <Input.Password
              fullWidth
              clearable
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorLocal('');
              }}
              disabled={enviando}
              required
              color={password ? 'success' : 'default'}
              contentLeft={<Text>🔒</Text>}
              css={{
                '& input': {
                  borderColor: '#e5e7eb !important',
                  '&:focus': {
                    borderColor: '#1e40af !important',
                  }
                }
              }}
            />

            <Spacer y={0.5} />

            {/* Error */}
            {errorLocal && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  border: '2px solid #fca5a5',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <Text color="error" size="sm" weight="medium">
                  ⚠️ {errorLocal}
                </Text>
              </div>
            )}

            <Spacer y={1.5} />

            {/* Botón Login */}
            <Button
              css={{ 
                width: '100%',
                background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(30, 64, 175, 0.3)'
                },
                transition: 'all 0.3s ease'
              }} 
              type="submit"
              size="lg"
              disabled={enviando || !username || !password}
            >
              {enviando ? (
                <>
                  <Loading type="points" color="currentColor" size="sm" />
                  <span style={{ marginLeft: '10px' }}>Autenticando...</span>
                </>
              ) : (
                '🔓 Iniciar Sesión'
              )}
            </Button>

            <Spacer y={1} />

            {/* Info */}
            <div
              style={{
                padding: '10px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
              }}
            >
              <Text size="xs" color="warning" css={{ margin: '0' }}>
                <strong>Usuarios de prueba:</strong>
              </Text>
              <Text size="xs" css={{ margin: '3px 0' }}>
                • Admin: admin / admin123
              </Text>
              <Text size="xs" css={{ margin: '3px 0' }}>
                • Vendedor: vendedor / vendedor123
              </Text>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            color: 'white',
          }}
        >
          <Text size="sm" css={{ margin: '0', opacity: '0.8' }}>
            © 2026 Bebidas del Perú. Todos los derechos reservados.
          </Text>
        </div>
      </div>
    </Container>
  );
};

export default Login;
