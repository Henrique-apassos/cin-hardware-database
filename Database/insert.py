import sqlite3

conn = sqlite3.connect("./Database/cin_hardware.db")
cursor = conn.cursor()

cursor.execute("""
INSERT INTO pessoa_fisica (CPF, nome, email) VALUES
('48215937500', 'Sofia Oliveira', 'sofia.oliveira@emailteste.com'),
('73958162428', 'Miguel Souza', 'miguel.souza@emailteste.com');""")

cursor.execute("""
INSERT INTO professor (CPF) VALUES
('12345678900'), ('98765432100'), ('11122233344'),
('33344455566'), ('44455566677'), ('55566677788'),
('66677788899'), ('77788899900'), ('88899900011'), ('99900011122');""")

cursor.execute("""
INSERT INTO aluno (CPF, login_aluno, matricula) VALUES
('45678912300', 'carlossouza', 20231001),
('78912345600', 'dianarocha', 20231002),
('00011122233', 'gabrielaalves', 20231003),
('11122233300', 'henriquesantos', 20231004),
('22233344400', 'isabelapereira', 20231005),
('33344455500', 'joaosilva', 20231006),
('44455566600', 'karinacosta', 20231007),
('55566677700', 'leonardosouza', 20231008),
('66677788800', 'marianadias', 20231009),
('77788899901', 'nicolasmartins', 20231010),
('88899900002', 'oliviarocha', 20231011),
('99900011103', 'pedrocosta', 20231012),
('00011122204', 'queilalima', 20231013),
('11122233305', 'rafaeltorres', 20231014);
""")

cursor.execute("""
INSERT INTO disciplina (nome) VALUES
('Circuitos Elétricos'),
('Sistemas Digitais'),
('Programação para Engenharia'),
('Arquitetura de Computadores'),
('Redes de Computadores'),
('Inteligência Artificial'),
('Banco de Dados'),
('Engenharia de Software'),
('Sistemas Embarcados'),
('Matemática Discreta'),
('Teoria da Computação'),
('Organização de Computadores'),
('Eletrônica Analógica'),
('Controle de Sistemas'),
('Processamento de Sinais');
""")

cursor.execute("""
INSERT INTO ministra (id_disciplina, CPF) VALUES
(1, '12345678900'),
(2, '98765432100'),
(3, '11122233344'),
(4, '33344455566'),
(5, '44455566677'),
(6, '55566677788'),
(7, '66677788899'),
(8, '77788899900'),
(9, '88899900011'),
(10, '99900011122'),
(11, '12345678900'),
(12, '98765432100'),
(13, '11122233344'),
(14, '33344455566'),
(15, '44455566677');""")

cursor.execute("""
INSERT INTO localizacao DEFAULT VALUES;
""")

cursor.execute("""
INSERT INTO armario (id_local, CPF) VALUES
(1, '12345678900'),
(2, '98765432100'),
(3, '11122233344'),
(4, '33344455566'),
(5, '44455566677');
""")

cursor.execute("""
INSERT INTO mesa (id_local, id_mesa) VALUES
(1, 1),
(2, 2), 
(3, 3),
(4, 1), (5, 2), (6, 3),
(9, 1), (8, 2), (7, 3),
(10, 1), (11, 2), (12, 3);
""")

cursor.execute("""
INSERT INTO tipo_item (quantidade_max, quantidade_disp, desc_tipo_item, nome) VALUES
(100, 100, 'Resistores de 220 Ohms 1/4W', 'Resistor 220Ω'),
(80, 75, 'Capacitores eletrolíticos 100uF', 'Capacitor 100uF'),
(40, 35, 'Placas Arduino UNO R3', 'Arduino UNO'),
(100, 100, 'LEDs vermelhos 5mm', 'LED Vermelho'),
(50, 48, 'Transistores NPN 2N2222', 'Transistor 2N2222'),
(20, 18, 'Multímetros digitais', 'Multímetro'),
(70, 68, 'Fios jumper macho-fêmea 20cm', 'Fio jumper'),
(8, 7, 'Osciloscópios digitais', 'Osciloscópio'),
(25, 00, 'Protoboards médias', 'Protoboard'),
(15, 13, 'Fonte de alimentação 12V 5A', 'Fonte 12V 5A'),
(30, 28, 'Sensores de temperatura LM35', 'Sensor LM35'),
(20, 19, 'Displays LCD 16x2', 'Display LCD'),
(35, 34, 'Microcontroladores PIC16F877A', 'Microcontrolador PIC'),
(60, 58, 'Cabos USB 2.0', 'Cabo USB'),
(40, 37, 'Relés 5V para controle', 'Relé 5V'),
(25, 23, 'Servomotores padrão SG90', 'Servo Motor'),
(30, 29, 'Módulos WiFi ESP8266', 'Modulo WiFi ESP8266'),
(35, 33, 'Sensores ultrassônicos HC-SR04', 'Sensor Ultrassônico'),
(80, 80, 'Botões pulsadores para circuitos', 'Botão Pulsador'),
(100, 100, 'Resistores de 10k Ohms 1/4W', 'Resistor 10kΩ'),
(70, 69, 'Diodos retificadores 1N4007', 'Diodo 1N4007'),
(20, 19, 'Chaves seletoras de múltiplas posições', 'Chave Seletora'),
(15, 15, 'Placas Raspberry Pi 4', 'Placa Raspberry Pi'),
(25, 24, 'Memórias EEPROM 24C256', 'Memória EEPROM'),
(40, 38, 'Sensores LDR para luminosidade', 'Sensor de Luminosidade'),
(30, 30, 'Conversores ADC MCP3008', 'Conversor Analógico-Digital'),
(20, 00, 'Displays OLED 128x64', 'Display OLED'),
(10, 10, 'Placas FPGA DE0-Nano', 'Placa FPGA'),
(12, 12, 'Fontes de bancada ajustáveis', 'Fonte de bancada'),
(25, 25, 'Kits de ferramentas básicas', 'Kit Ferramentas');
""")

cursor.execute("""
INSERT INTO item (ID_TIPO, QUEBRADO, ID_LOCAL) VALUES
(1, 0, 1),
(1, 0, 1),
(1, 0, 2),
(1, 1, 3),
(2, 0, 2),
(2, 0, 3),
(2, 0, 4),
(3, 0, 5),
(3, 0, 5),
(3, 0, 6),
(3, 1, 6),
(4, 0, 7),
(4, 0, 8),
(4, 0, 9),
(5, 0, 10),
(5, 1, 9),
(5, 0, 8),
(6, 0, 7),
(6, 0, 6),
(6, 0, 5),
(7, 0, 4),
(7, 0, 3),
(7, 1, 2),
(8, 0, 1),
(8, 0, 1),
(8, 0, 2),
(9, 0, 2),
(9, 0, 3),
(9, 1, 3),
(10, 0, 4),
(10, 0, 4),
(10, 0, 5),
(11, 0, 5),
(11, 0, 6),
(11, 1, 7),
(12, 0, 8),
(12, 0, 8),
(12, 0, 9),
(13, 0, 9),
(13, 0, 10),
(13, 1, 10),
(14, 0, 1),
(14, 0, 2),
(14, 0, 3),
(15, 0, 4),
(15, 0, 5),
(15, 0, 6),
(16, 0, 7),
(16, 1, 8),
(16, 0, 9),
(17, 0, 10),
(17, 0, 1),
(17, 0, 2),
(18, 0, 3),
(18, 0, 4),
(18, 1, 5),
(19, 0, 6),
(19, 0, 7),
(19, 0, 8),
(20, 0, 9),
(20, 0, 10),
(20, 1, 1),
(21, 0, 2),
(21, 0, 3),
(21, 0, 4),
(22, 0, 5),
(22, 1, 6),
(22, 0, 7),
(23, 0, 8),
(23, 0, 9),
(23, 0, 10),
(24, 0, 1),
(24, 1, 2),
(24, 0, 3),
(25, 0, 4),
(25, 0, 5),
(25, 1, 6),
(26, 0, 7),
(26, 0, 8),
(26, 0, 9),
(27, 0, 10),
(27, 1, 1),
(27, 0, 2),
(28, 0, 3),
(28, 0, 4),
(28, 1, 5),
(29, 0, 6),
(29, 0, 7),
(29, 0, 8),
(30, 0, 9),
(30, 1, 10),
(30, 0, 1);

""")

cursor.execute("""
INSERT INTO solicitacao (
    DATA_SOLICITACAO,
    STATUS_SOL,
    DATA_ENTREGA,
    DATA_DEVOLUCAO,
    DESCRICAO_SOLICITACAO,
    CPF
) VALUES
('2025-01-10', 'aprovada', '2025-01-11', '2025-01-20', 'Uso em projeto de sistemas embarcados', '45678912300'),
('2025-01-12', 'pendente', NULL, NULL, 'Solicitação para aula de laboratório', '78912345600'),
('2025-01-15', 'rejeitada', NULL, NULL, 'Não há estoque suficiente', '00011122233'),
('2025-01-18', 'aprovada', '2025-01-19', '2025-01-25', 'Uso em pesquisa de eletrônica', '11122233300'),
('2025-01-20', 'aprovada', '2025-01-21', '2025-01-30', 'Uso em trabalho final de disciplina', '22233344400'),
('2025-01-22', 'pendente', NULL, NULL, 'Reserva para evento de robótica', '33344455500'),
('2025-01-25', 'aprovada', '2025-01-26', '2025-02-05', 'Projeto de automação residencial', '44455566600'),
('2025-01-28', 'rejeitada', NULL, NULL, 'Item indisponível no momento', '55566677700'),
('2025-02-01', 'aprovada', '2025-02-02', '2025-02-10', 'Competição de programação de hardware', '66677788800'),
('2025-02-03', 'pendente', NULL, NULL, 'Preparação para feira de ciências', '77788899901');

""")

cursor.execute("""
INSERT INTO solicita (ID_SOLICITACAO, ID_TIPO, QUANTIDADE) VALUES
(1, 3, 2),
(1, 4, 5),
(2, 1, 10),
(3, 2, 3),
(4, 6, 1),
(5, 7, 15),
(6, 8, 2),
(7, 9, 1),
(8, 10, 1),
(9, 11, 4),
(10, 12, 3);

""")

cursor.execute("""
INSERT INTO responsavel (ID_ITEM, ID_SOLICITACAO, DATA_RESP) VALUES
(3, 1, '2025-01-11'),
(4, 1, '2025-01-11'),
(6, 4, '2025-01-19'),
(7, 5, '2025-01-21'),
(9, 7, '2025-01-26'),
(11, 9, '2025-02-02');
""")

cursor.execute("""
INSERT INTO projeto (id_projeto, nome_projeto, descricao_projeto, CPF) VALUES
(1, 'Robô Seguidor de Linha', 'Robô autônomo que segue uma linha usando sensores ópticos', '45678912300'),
(2, 'Estação Meteorológica', 'Sistema que coleta dados climáticos e envia para a nuvem', '78912345600'),
(3, 'Sistema de Irrigação Automático', 'Controle automático de irrigação usando sensores de umidade', '00011122233'),
(4, 'Drone de Entrega', 'Veículo aéreo não tripulado para entregas rápidas', '11122233300'),
(5, 'Controle de Iluminação Inteligente', 'Automação de iluminação residencial via smartphone', '22233344400');""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS projeto_usa (
        ID_PROJETO INTEGER,
        ID_ITEM INTEGER,
        PRIMARY KEY (ID_PROJETO, ID_ITEM),
        FOREIGN KEY (ID_ITEM) REFERENCES item (ID_ITEM),
        FOREIGN KEY (ID_PROJETO) REFERENCES projeto (ID_PROJETO)
    );
    """)

cursor.execute("""
INSERT INTO compra (CPF, id_item, data_compra, quantidade_compra) VALUES
('22233344406', 1, '2025-01-05', 50),
('33344455507', 3, '2025-01-07', 5),
('44455566608', 6, '2025-01-09', 2),
('55566677709', 10, '2025-01-15', 3),
('66677788810', 14, '2025-01-20', 10),
('22233344406', 20, '2025-01-22', 5),
('33344455507', 25, '2025-01-25', 4),
('44455566608', 27, '2025-01-28', 2),
('55566677709', 30, '2025-02-01', 1),
('66677788810', 5, '2025-02-03', 6);
""")

conn.commit()

conn.close()