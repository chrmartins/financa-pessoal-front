-- Script para popular 10 transações para cada usuário
-- Execute este script após inserir usuários e categorias

-- Limpar transações existentes primeiro (opcional)
-- DELETE FROM transacoes;

-- Script para popular transações para todos os usuários
DO $$
DECLARE 
    -- IDs das categorias
    cat_salario_id TEXT;
    cat_alimentacao_id TEXT;
    cat_transporte_id TEXT;
    cat_freelance_id TEXT;
    cat_entretenimento_id TEXT;
    cat_casa_id TEXT;
    cat_saude_id TEXT;
    cat_educacao_id TEXT;
    
    -- Array de usuários
    usuarios UUID[] := ARRAY[
        '550e8400-e29b-41d4-a716-446655440001'::UUID,  -- João Silva
        '550e8400-e29b-41d4-a716-446655440002'::UUID,  -- Maria Santos
        '550e8400-e29b-41d4-a716-446655440003'::UUID   -- Admin Sistema
    ];
    
    usuario_atual UUID;
    contador INTEGER;
BEGIN
    -- Buscar IDs das categorias (assumindo que já existem)
    SELECT id::TEXT INTO cat_salario_id FROM categorias WHERE nome = 'Salário' LIMIT 1;
    SELECT id::TEXT INTO cat_alimentacao_id FROM categorias WHERE nome = 'Alimentação' LIMIT 1;
    SELECT id::TEXT INTO cat_transporte_id FROM categorias WHERE nome = 'Transporte' LIMIT 1;
    SELECT id::TEXT INTO cat_freelance_id FROM categorias WHERE nome = 'Freelance' LIMIT 1;
    SELECT id::TEXT INTO cat_entretenimento_id FROM categorias WHERE nome = 'Entretenimento' LIMIT 1;
    SELECT id::TEXT INTO cat_casa_id FROM categorias WHERE nome = 'Casa' LIMIT 1;
    SELECT id::TEXT INTO cat_saude_id FROM categorias WHERE nome = 'Saúde' LIMIT 1;
    SELECT id::TEXT INTO cat_educacao_id FROM categorias WHERE nome = 'Educação' LIMIT 1;
    
    -- Loop através de cada usuário
    FOREACH usuario_atual IN ARRAY usuarios
    LOOP
        RAISE NOTICE 'Inserindo transações para usuário: %', usuario_atual;
        
        -- Inserir 10 transações variadas para cada usuário
        
        -- Transação 1: Salário (RECEITA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_salario_id::UUID,
            'Salário Setembro',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 5500.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 4800.00
                ELSE 8000.00  -- Admin
            END,
            'RECEITA',
            CURRENT_DATE - INTERVAL '1 day',
            NOW(),
            NOW()
        );
        
        -- Transação 2: Freelance (RECEITA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_freelance_id::UUID,
            'Projeto Freelance',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 1200.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 900.00
                ELSE 2200.00  -- Admin
            END,
            'RECEITA',
            CURRENT_DATE - INTERVAL '10 days',
            NOW(),
            NOW()
        );
        
        -- Transação 3: Aluguel (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_casa_id::UUID,
            'Aluguel Setembro',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 1800.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 1200.00
                ELSE 2500.00  -- Admin
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '5 days',
            NOW(),
            NOW()
        );
        
        -- Transação 4: Supermercado (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_alimentacao_id::UUID,
            'Supermercado',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 650.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 520.00
                ELSE 720.00  -- Admin
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '2 days',
            NOW(),
            NOW()
        );
        
        -- Transação 5: Combustível (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_transporte_id::UUID,
            'Combustível',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 280.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 250.00
                ELSE 320.00  -- Admin
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '7 days',
            NOW(),
            NOW()
        );
        
        -- Transação 6: Plano de Saúde (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_saude_id::UUID,
            'Plano de Saúde',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 420.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 380.00
                ELSE 850.00  -- Admin
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '12 days',
            NOW(),
            NOW()
        );
        
        -- Transação 7: Cinema (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_entretenimento_id::UUID,
            'Cinema',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 45.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 40.00
                ELSE 120.00  -- Admin (família)
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '20 days',
            NOW(),
            NOW()
        );
        
        -- Transação 8: Curso Online (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_educacao_id::UUID,
            'Curso Online',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 150.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 200.00
                ELSE 500.00  -- Admin
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '25 days',
            NOW(),
            NOW()
        );
        
        -- Transação 9: Restaurante (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_alimentacao_id::UUID,
            'Jantar Restaurante',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 120.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 95.00
                ELSE 180.00  -- Admin
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '18 days',
            NOW(),
            NOW()
        );
        
        -- Transação 10: Conta de Luz (DESPESA)
        INSERT INTO transacoes (
            id, usuario_id, categoria_id, descricao, valor, tipo, 
            data_transacao, data_criacao, data_atualizacao
        ) VALUES (
            gen_random_uuid(),
            usuario_atual,
            cat_casa_id::UUID,
            'Conta de Luz',
            CASE 
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440001' THEN 180.00
                WHEN usuario_atual = '550e8400-e29b-41d4-a716-446655440002' THEN 150.00
                ELSE 220.00  -- Admin
            END,
            'DESPESA',
            CURRENT_DATE - INTERVAL '14 days',
            NOW(),
            NOW()
        );
        
    END LOOP;
    
    RAISE NOTICE 'Finalizado! Inseridas 10 transações para cada usuário.';
    
END $$;

-- Verificar os dados inseridos
SELECT 
    u.nome,
    u.email,
    COUNT(t.id) as total_transacoes,
    SUM(CASE WHEN t.tipo = 'RECEITA' THEN t.valor ELSE 0 END) as total_receitas,
    SUM(CASE WHEN t.tipo = 'DESPESA' THEN t.valor ELSE 0 END) as total_despesas,
    (SUM(CASE WHEN t.tipo = 'RECEITA' THEN t.valor ELSE 0 END) - 
     SUM(CASE WHEN t.tipo = 'DESPESA' THEN t.valor ELSE 0 END)) as saldo
FROM usuarios u
LEFT JOIN transacoes t ON u.id = t.usuario_id
WHERE u.id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002', 
    '550e8400-e29b-41d4-a716-446655440003'
)
GROUP BY u.id, u.nome, u.email
ORDER BY u.nome;

-- Também verificar algumas transações por usuário
SELECT 
    u.nome as usuario,
    t.descricao,
    t.valor,
    t.tipo,
    t.data_transacao,
    c.nome as categoria
FROM transacoes t
JOIN usuarios u ON t.usuario_id = u.id
JOIN categorias c ON t.categoria_id = c.id
WHERE u.id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002', 
    '550e8400-e29b-41d4-a716-446655440003'
)
ORDER BY u.nome, t.data_transacao DESC
LIMIT 30;