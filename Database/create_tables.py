import sqlite3

def create_tables(conn):
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pessoa_fisica (
    CPF TEXT PRIMARY KEY,
    NOME TEXT NOT NULL,
    EMAIL TEXT UNIQUE
    SENHA TEXT NOT NULL
);
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS professor (
        CPF TEXT PRIMARY KEY,
        FOREIGN KEY (CPF) REFERENCES pessoa_fisica (CPF)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS disciplina (
        ID_DISCIPLINA TEXT PRIMARY KEY,
        nome TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ministra (
        ID_DISCIPLINA TEXT,
        CPF TEXT,
        PRIMARY KEY (ID_DISCIPLINA, CPF),
        FOREIGN KEY (ID_DISCIPLINA) REFERENCES disciplina (ID_DISCIPLINA),
        FOREIGN KEY (CPF) REFERENCES professor (CPF)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS localizacao (
        ID_LOCAL INTEGER PRIMARY KEY AUTOINCREMENT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS armario (
        ID_LOCAL INTEGER PRIMARY KEY,
        CPF TEXT,
        FOREIGN KEY (ID_LOCAL) REFERENCES localizacao (ID_LOCAL),
        FOREIGN KEY (CPF) REFERENCES professor (CPF)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mesa (
        ID_LOCAL INTEGER PRIMARY KEY,
        ID_MESA INTEGER,
        FOREIGN KEY (ID_LOCAL) REFERENCES localizacao (ID_LOCAL)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tipo_item (
        ID_TIPO INTEGER PRIMARY KEY AUTOINCREMENT,
        QUANTIDADE_MAX INTEGER,
        QUANTIDADE_DISP INTEGER,
        DESC_TIPO_ITEM TEXT,
        NOME TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS item (
        ID_ITEM INTEGER PRIMARY KEY AUTOINCREMENT,
        ID_TIPO INTEGER,
        QUEBRADO INTEGER DEFAULT 0,
        ID_LOCAL INTEGER,
        FOREIGN KEY (ID_TIPO) REFERENCES tipo_item (ID_TIPO),
        FOREIGN KEY (ID_LOCAL) REFERENCES localizacao (ID_LOCAL),
        CHECK (QUEBRADO IN (0, 1))
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS solicitacao (
        ID_SOLICITACAO INTEGER PRIMARY KEY AUTOINCREMENT,
        DATA_SOLICITACAO TEXT,
        STATUS_SOL TEXT,
        DATA_ENTREGA TEXT,
        DATA_DEVOLUCAO TEXT,
        DESCRICAO_SOLICITACAO TEXT,
        CPF TEXT NOT NULL,
        FOREIGN KEY (CPF) REFERENCES pessoa_fisica (CPF)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS solicita (
        ID_SOLICITACAO INTEGER,
        ID_TIPO INTEGER,
        QUANTIDADE INTEGER,
        PRIMARY KEY (ID_SOLICITACAO, ID_TIPO),
        FOREIGN KEY (ID_SOLICITACAO) REFERENCES solicitacao (ID_SOLICITACAO),
        FOREIGN KEY (ID_TIPO) REFERENCES tipo_item (ID_TIPO)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS responsavel (
        ID_ITEM INTEGER,
        ID_SOLICITACAO INTEGER,
        DATA_RESP TEXT,
        PRIMARY KEY (ID_ITEM, ID_SOLICITACAO),
        FOREIGN KEY (ID_ITEM) REFERENCES item (ID_ITEM),
        FOREIGN KEY (ID_SOLICITACAO) REFERENCES solicitacao (ID_SOLICITACAO)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projeto (
        ID_PROJETO INTEGER PRIMARY KEY AUTOINCREMENT,
        NOME_PROJETO TEXT,
        DESCRICAO_PROJETO TEXT,
        CPF TEXT,
        FOREIGN KEY (CPF) REFERENCES pessoa_fisica (CPF)
    );
    """)

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
    CREATE TABLE IF NOT EXISTS aluno (
        CPF TEXT PRIMARY KEY,
        login_aluno TEXT,
        matricula TEXT,
        FOREIGN KEY (CPF) REFERENCES pessoa_fisica (CPF)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tecnico (
        CPF TEXT PRIMARY KEY,
        FOREIGN KEY (CPF) REFERENCES pessoa_fisica (CPF)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS compra (
        CPF TEXT,
        ID_ITEM INTEGER,
        DATA_COMPRA TEXT,
        QUANTIDADE_COMPRA INTEGER,
        PRIMARY KEY(CPF, ID_ITEM),
        FOREIGN KEY (CPF) REFERENCES pessoa_fisica (CPF),
        FOREIGN KEY (ID_ITEM) REFERENCES item (ID_ITEM)
    );
    """)

    conn.commit()

conn = sqlite3.connect("./Database/cin_hardware.db")
create_tables(conn)