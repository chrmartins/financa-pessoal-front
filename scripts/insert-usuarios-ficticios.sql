-- Script para inserir usuários fictícios na tabela usuarios
-- Execute este script no seu banco de dados para criar os usuários necessários

-- Inserir 3 usuários fictícios com os UUIDs que estão sendo usados no código frontend
INSERT INTO usuarios (id, nome, email, papel, ativo, data_criacao, data_atualizacao) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao.silva@email.com', 'USER', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria.santos@email.com', 'USER', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Admin Sistema', 'admin@financeiro.com', 'ADMIN', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  papel = EXCLUDED.papel,
  ativo = EXCLUDED.ativo,
  data_atualizacao = NOW();

-- Verificar se os usuários foram inseridos corretamente
SELECT id, nome, email, papel, ativo, data_criacao FROM usuarios 
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440003'
)
ORDER BY nome;