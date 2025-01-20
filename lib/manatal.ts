import sql from "mssql";

const LOG_CTX = "[lib/manatal]";

const {
  AZURE_SQL_HOST,
  AZURE_SQL_DATABASE,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_USERNAME,
  AZURE_SQL_JOBS_VIEW,
} = process.env;

const sqlConfig: sql.config = {
  server: AZURE_SQL_HOST,
  database: AZURE_SQL_DATABASE,
  user: AZURE_SQL_USERNAME,
  password: AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

export const getRecruitmentInfo = async (): Promise<string> => {
  // throw new Error("NOT IMPLEMENTED");
  try {
    console.log(`${LOG_CTX} Try connecting to Azure SQL`);
    const pool = await sql.connect(sqlConfig);

    console.log(`${LOG_CTX} Try querying Azure SQL`);
    const result = await pool
      .request()
      .query(`SELECT * FROM ${AZURE_SQL_JOBS_VIEW}`);
    const recruitmentInfo = JSON.stringify(result.recordset, null, 2);
    pool.close();
    return recruitmentInfo;
  } catch (e) {
    throw Error(
      `${LOG_CTX} could not obtain recruitement info: ${JSON.stringify(e)}`,
    );
  }
};
