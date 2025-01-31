import sql from "mssql";

const LOG_CTX = "[lib/manatal]";

const {
  AZURE_SQL_HOST,
  AZURE_SQL_DATABASE,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_USERNAME,
  AZURE_SQL_JOBS_VIEW,
  AZURE_SQL_START_DATE,
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

export const getAllMatches = async (): Promise<sql.IRecordSet<Job.Match>> => {
  // throw new Error("NOT IMPLEMENTED");
  try {
    console.log(`${LOG_CTX} Try connecting to Azure SQL`);
    const pool = await sql.connect(sqlConfig);

    console.log(`${LOG_CTX} Try querying Azure SQL`);
    const startDate = AZURE_SQL_START_DATE || "2025-01-01 00:00:00.000000";
    const result = await pool
      .request()
      .input("start_date", sql.DateTime2, startDate)
      .query<Job.Match>(
        `SELECT * FROM ${AZURE_SQL_JOBS_VIEW} WHERE created_at > @start_date`,
      );
    const match = result.recordset;
    pool.close();
    return match;
  } catch (e) {
    throw Error(
      `${LOG_CTX} could not obtain recruitement info: ${JSON.stringify(e)}`,
    );
  }
};
