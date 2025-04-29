const oracledb = require('oracledb');

const dbConfig = {
  user: 'RM554867',
  password: 'fiap24',
  connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.fiap.com.br)(PORT=1521))(CONNECT_DATA=(SID=orcl)))'
};

async function testConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Conexão bem-sucedida!');
    await connection.close();
  } catch (err) {
    console.error('❌ Erro ao conectar:', err);
  }
}

testConnection();
