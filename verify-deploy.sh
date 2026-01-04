#!/bin/bash

# Script de verificación previa a deploy
echo "🔍 Verificando proyecto..."

# 1. Verificar que no existen archivos sensibles
echo "✓ Verificando archivos sensibles..."
if [ -f ".env.local" ]; then
  echo "⚠️  Advertencia: .env.local no debe estar versionado"
fi

# 2. Verificar que node_modules no está versionado
echo "✓ Verificando node_modules..."
if git ls-files | grep -q "node_modules/"; then
  echo "❌ Error: node_modules está versionado en git"
  exit 1
fi

# 3. Verificar que .next no está versionado
echo "✓ Verificando .next..."
if git ls-files | grep -q "\.next/"; then
  echo "❌ Error: .next está versionado en git"
  exit 1
fi

# 4. Verificar build
echo "✓ Compilando proyecto..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Error: Build falló"
  exit 1
fi

# 5. Verificar linting
echo "✓ Verificando linting..."
npm run lint
if [ $? -ne 0 ]; then
  echo "⚠️  Advertencia: Hay errores de linting"
fi

# 6. Verificar package.json
echo "✓ Verificando package.json..."
if ! grep -q "next" package.json; then
  echo "❌ Error: next no está en package.json"
  exit 1
fi

echo ""
echo "✅ Verificación completada correctamente!"
echo "Listo para deploy a Vercel"
