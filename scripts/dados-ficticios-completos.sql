-- Script completo de dados fictícios para desenvolvimento
-- Execute este script após inserir os usuários fictícios

-- 1. Inserir algumas categorias padrão (se não existirem)
INSERT INTO categorias (nome, descricao, cor, icone, data_criacao, data_atualizacao) VALUES 
('Alimentação', 'Gastos com comida e bebidas', '#FF6B6B', '🍽️', NOW(), NOW()),
('Transporte', 'Gastos com transporte público, combustível, etc', '#4ECDC4', '🚗', NOW(), NOW()),
('Salário', 'Renda do trabalho', '#45B7D1', '💼', NOW(), NOW()),
('Entretenimento', 'Gastos com lazer e diversão', '#96CEB4', '🎭', NOW(), NOW()),
('Saúde', 'Gastos com medicamentos, consultas, etc', '#FFEAA7', '🏥', NOW(), NOW()),
('Educação', 'Gastos com cursos, livros, etc', '#DDA0DD', '📚', NOW(), NOW()),
('Casa', 'Gastos com moradia, conta de luz, água, etc', '#F39C12', '🏠', NOW(), NOW()),
('Freelance', 'Renda de trabalhos freelance', '#2ECC71', '💻', NOW(), NOW())
ON CONFLICT (nome) DO NOTHING;

-- 2. Inserir algumas transações fictícias para o usuário padrão
-- (usando o ID 550e8400-e29b-41d4-a716-446655440001)

-- Pegar IDs das categorias criadas
DO $$
DECLARE 
    categoria_salario_id INTEGER;
    categoria_alimentacao_id INTEGER;
    categoria_transporte_id INTEGER;
    categoria_freelance_id INTEGER;
    categoria_entretenimento_id INTEGER;
    categoria_casa_id INTEGER;
    usuario_id UUID := '550e8400-e29b-41d4-a716-446655440001';
BEGIN
    -- Buscar IDs das categorias
    SELECT id INTO categoria_salario_id FROM categorias WHERE nome = 'Salário' LIMIT 1;
    SELECT id INTO categoria_alimentacao_id FROM categorias WHERE nome = 'Alimentação' LIMIT 1;
    SELECT id INTO categoria_transporte_id FROM categorias WHERE nome = 'Transporte' LIMIT 1;
    SELECT id INTO categoria_freelance_id FROM categorias WHERE nome = 'Freelance' LIMIT 1;
    SELECT id INTO categoria_entretenimento_id FROM categorias WHERE nome = 'Entretenimento' LIMIT 1;
    SELECT id INTO categoria_casa_id FROM categorias WHERE nome = 'Casa' LIMIT 1;
    
    -- Inserir transações do mês atual
    INSERT INTO transacoes (usuario_id, categoria_id, descricao, valor, tipo, data_transacao, data_criacao, data_atualizacao) VALUES
    -- Receitas
    (usuario_id, categoria_salario_id, 'Salário Setembro', 5000.00, 'RECEITA', CURRENT_DATE - INTERVAL '25 days', NOW(), NOW()),
    (usuario_id, categoria_freelance_id, 'Projeto Freelance - Site', 1200.00, 'RECEITA', CURRENT_DATE - INTERVAL '10 days', NOW(), NOW()),
    (usuario_id, categoria_freelance_id, 'Consultoria TI', 800.00, 'RECEITA', CURRENT_DATE - INTERVAL '5 days', NOW(), NOW()),
    
    -- Despesas
    (usuario_id, categoria_casa_id, 'Aluguel', 1500.00, 'DESPESA', CURRENT_DATE - INTERVAL '27 days', NOW(), NOW()),
    (usuario_id, categoria_casa_id, 'Conta de Luz', 150.00, 'DESPESA', CURRENT_DATE - INTERVAL '20 days', NOW(), NOW()),
    (usuario_id, categoria_casa_id, 'Conta de Água', 80.00, 'DESPESA', CURRENT_DATE - INTERVAL '18 days', NOW(), NOW()),
    (usuario_id, categoria_alimentacao_id, 'Supermercado', 350.00, 'DESPESA', CURRENT_DATE - INTERVAL '15 days', NOW(), NOW()),
    (usuario_id, categoria_alimentacao_id, 'Restaurante', 85.00, 'DESPESA', CURRENT_DATE - INTERVAL '12 days', NOW(), NOW()),
    (usuario_id, categoria_alimentacao_id, 'Padaria', 25.00, 'DESPESA', CURRENT_DATE - INTERVAL '8 days', NOW(), NOW()),
    (usuario_id, categoria_transporte_id, 'Combustível', 200.00, 'DESPESA', CURRENT_DATE - INTERVAL '14 days', NOW(), NOW()),
    (usuario_id, categoria_transporte_id, 'Uber', 45.00, 'DESPESA', CURRENT_DATE - INTERVAL '6 days', NOW(), NOW()),
    (usuario_id, categoria_entretenimento_id, 'Cinema', 30.00, 'DESPESA', CURRENT_DATE - INTERVAL '7 days', NOW(), NOW()),
    (usuario_id, categoria_entretenimento_id, 'Streaming Netflix', 29.90, 'DESPESA', CURRENT_DATE - INTERVAL '1 day', NOW(), NOW());
    
    -- Transações de meses anteriores para o gráfico de tendências
    INSERT INTO transacoes (usuario_id, categoria_id, descricao, valor, tipo, data_transacao, data_criacao, data_atualizacao) VALUES
    -- Agosto
    (usuario_id, categoria_salario_id, 'Salário Agosto', 5000.00, 'RECEITA', CURRENT_DATE - INTERVAL '35 days', NOW(), NOW()),
    (usuario_id, categoria_casa_id, 'Aluguel', 1500.00, 'DESPESA', CURRENT_DATE - INTERVAL '58 days', NOW(), NOW()),
    (usuario_id, categoria_alimentacao_id, 'Supermercado Agosto', 400.00, 'DESPESA', CURRENT_DATE - INTERVAL '45 days', NOW(), NOW()),
    (usuario_id, categoria_transporte_id, 'Combustível Agosto', 180.00, 'DESPESA', CURRENT_DATE - INTERVAL '40 days', NOW(), NOW()),
    
    -- Julho
    (usuario_id, categoria_salario_id, 'Salário Julho', 5000.00, 'RECEITA', CURRENT_DATE - INTERVAL '65 days', NOW(), NOW()),
    (usuario_id, categoria_casa_id, 'Aluguel', 1500.00, 'DESPESA', CURRENT_DATE - INTERVAL '88 days', NOW(), NOW()),
    (usuario_id, categoria_alimentacao_id, 'Supermercado Julho', 380.00, 'DESPESA', CURRENT_DATE - INTERVAL '75 days', NOW(), NOW()),
    (usuario_id, categoria_transporte_id, 'Combustível Julho', 190.00, 'DESPESA', CURRENT_DATE - INTERVAL '70 days', NOW(), NOW());
    
END $$;

-- Verificar os dados inseridos
SELECT 
    'Usuários' as tabela,
    COUNT(*) as total
FROM usuarios 
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002', 
    '550e8400-e29b-41d4-a716-446655440003'
)
UNION ALL
SELECT 
    'Categorias' as tabela,
    COUNT(*) as total
FROM categorias
UNION ALL
SELECT 
    'Transações' as tabela,
    COUNT(*) as total
FROM transacoes 
WHERE usuario_id = '550e8400-e29b-41d4-a716-446655440001';