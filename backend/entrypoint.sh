#!/bin/sh

# Espera o banco subir (máx 30 tentativas)
echo "Aguardando o banco de dados iniciar..."
until nc -z db 5432; do
  echo "Aguardando PostgreSQL..."
  sleep 1
done

echo "Banco de dados está pronto. Executando migrações..."
npm run migration:run:prod

echo "Iniciando aplicação NestJS..."
npm run start:prod
