-- Script para criar transações em meses diferentes
-- Execute este script para ter dados variados em vários meses

DO $$
DECLARE 
    usuario_id UUID := '550e8400-e29b-41d4-a716-446655440001';  -- João Silva
    mes INTEGER;
    ano INTEGER := 2025;
BEGIN
    -- Limpar transações antigas do usuário
    DELETE FROM transacoes WHERE usuario_id IN (
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003'
    );
    
    RAISE NOTICE 'Criando transações para múltiplos meses...';
    
    -- Loop para criar transações de Janeiro a Dezembro de 2025
    FOR mes IN 1..12 LOOP
        -- Para cada usuário
        FOR usuario_id IN SELECT unnest(ARRAY[
            '550e8400-e29b-41d4-a716-446655440001'::UUID,
            '550e8400-e29b-41d4-a716-446655440002'::UUID,
            '550e8400-e29b-41d4-a716-446655440003'::UUID
        ]) LOOP
            
            -- Receita 1: Salário (sempre no dia 1 do mês)
            INSERT INTO transacoes (
                id, usuario_id, categoria_id, descricao, valor, tipo,
                data_transacao, data_criacao, data_atualizacao
            ) VALUES (
                gen_random_uuid(),
                usuario_id,
                '650e8400-e29b-41d4-a716-446655440001',
                'Salário ' || to_char(make_date(ano, mes, 1), 'TMMonth'),
                CASE 
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440001' THEN 5500.00 + (mes * 10)
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440002' THEN 4800.00 + (mes * 10)
                    ELSE 8000.00 + (mes * 10)
                END,
                'RECEITA',
                make_date(ano, mes, 1),
                NOW(),
                NOW()
            );
            
            -- Receita 2: Freelance (dia 15)
            INSERT INTO transacoes (
                id, usuario_id, categoria_id, descricao, valor, tipo,
                data_transacao, data_criacao, data_atualizacao
            ) VALUES (
                gen_random_uuid(),
                usuario_id,
                '650e8400-e29b-41d4-a716-446655440002',
                'Projeto Freelance',
                CASE 
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440001' THEN 1200.00 + (mes * 50)
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440002' THEN 900.00 + (mes * 40)
                    ELSE 2200.00 + (mes * 60)
                END,
                'RECEITA',
                make_date(ano, mes, 15),
                NOW(),
                NOW()
            );
            
            -- Despesa 1: Aluguel (sempre dia 5)
            INSERT INTO transacoes (
                id, usuario_id, categoria_id, descricao, valor, tipo,
                data_transacao, data_criacao, data_atualizacao
            ) VALUES (
                gen_random_uuid(),
                usuario_id,
                '650e8400-e29b-41d4-a716-446655440013',
                'Aluguel',
                CASE 
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440001' THEN 1800.00
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440002' THEN 1200.00
                    ELSE 2500.00
                END,
                'DESPESA',
                make_date(ano, mes, 5),
                NOW(),
                NOW()
            );
            
            -- Despesa 2: Supermercado (dia 10)
            INSERT INTO transacoes (
                id, usuario_id, categoria_id, descricao, valor, tipo,
                data_transacao, data_criacao, data_atualizacao
            ) VALUES (
                gen_random_uuid(),
                usuario_id,
                '650e8400-e29b-41d4-a716-446655440011',
                'Supermercado',
                CASE 
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440001' THEN 650.00 + (mes * 5)
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440002' THEN 520.00 + (mes * 4)
                    ELSE 720.00 + (mes * 6)
                END,
                'DESPESA',
                make_date(ano, mes, 10),
                NOW(),
                NOW()
            );
            
            -- Despesa 3: Transporte (dia 20)
            INSERT INTO transacoes (
                id, usuario_id, categoria_id, descricao, valor, tipo,
                data_transacao, data_criacao, data_atualizacao
            ) VALUES (
                gen_random_uuid(),
                usuario_id,
                '650e8400-e29b-41d4-a716-446655440012',
                'Combustível',
                CASE 
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440001' THEN 280.00 + (mes * 3)
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440002' THEN 250.00 + (mes * 2)
                    ELSE 320.00 + (mes * 4)
                END,
                'DESPESA',
                make_date(ano, mes, 20),
                NOW(),
                NOW()
            );
            
        END LOOP;
        
        RAISE NOTICE 'Transações criadas para mês: %', mes;
    END LOOP;
    
    -- Criar também algumas transações para 2026 (Janeiro a Abril)
    FOR mes IN 1..4 LOOP
        FOR usuario_id IN SELECT unnest(ARRAY[
            '550e8400-e29b-41d4-a716-446655440001'::UUID,
            '550e8400-e29b-41d4-a716-446655440002'::UUID,
            '550e8400-e29b-41d4-a716-446655440003'::UUID
        ]) LOOP
            
            -- Salário
            INSERT INTO transacoes (
                id, usuario_id, categoria_id, descricao, valor, tipo,
                data_transacao, data_criacao, data_atualizacao
            ) VALUES (
                gen_random_uuid(),
                usuario_id,
                '650e8400-e29b-41d4-a716-446655440001',
                'Salário ' || to_char(make_date(2026, mes, 1), 'TMMonth'),
                CASE 
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440001' THEN 5800.00
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440002' THEN 5000.00
                    ELSE 8500.00
                END,
                'RECEITA',
                make_date(2026, mes, 1),
                NOW(),
                NOW()
            );
            
            -- Aluguel
            INSERT INTO transacoes (
                id, usuario_id, categoria_id, descricao, valor, tipo,
                data_transacao, data_criacao, data_atualizacao
            ) VALUES (
                gen_random_uuid(),
                usuario_id,
                '650e8400-e29b-41d4-a716-446655440013',
                'Aluguel',
                CASE 
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440001' THEN 1850.00
                    WHEN usuario_id = '550e8400-e29b-41d4-a716-446655440002' THEN 1250.00
                    ELSE 2600.00
                END,
                'DESPESA',
                make_date(2026, mes, 5),
                NOW(),
                NOW()
            );
            
        END LOOP;
        
        RAISE NOTICE 'Transações criadas para 2026 mês: %', mes;
    END LOOP;
    
    RAISE NOTICE 'Finalizado! Transações criadas para todos os meses de 2025 e início de 2026.';
    
END $$;

-- Verificar resumo por mês
SELECT 
    to_char(t.data_transacao, 'YYYY-MM') as mes_ano,
    u.nome as usuario,
    COUNT(*) as total_transacoes,
    SUM(CASE WHEN t.tipo = 'RECEITA' THEN t.valor ELSE 0 END) as total_receitas,
    SUM(CASE WHEN t.tipo = 'DESPESA' THEN t.valor ELSE 0 END) as total_despesas,
    (SUM(CASE WHEN t.tipo = 'RECEITA' THEN t.valor ELSE 0 END) - 
     SUM(CASE WHEN t.tipo = 'DESPESA' THEN t.valor ELSE 0 END)) as saldo
FROM transacoes t
JOIN usuarios u ON t.usuario_id = u.id
WHERE u.id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003'
)
GROUP BY to_char(t.data_transacao, 'YYYY-MM'), u.nome, u.id
ORDER BY mes_ano DESC, u.nome
LIMIT 20;
