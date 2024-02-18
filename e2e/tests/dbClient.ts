import fs from 'fs';
import csvParser from 'csv-parser';
import { join } from 'path';
import { Pool } from 'pg';

const dbClient = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432", 10),
});

/**
 * @param tableName テーブル名
 * @param filePath insertしたいCSVファイルのパス
 * @returns
 */
async function insertCsvDataIntoTable(tableName: string, filePath: string) {
  const results: Record<string, string>[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: Record<string, string>) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row).map(value => `'${value}'`).join(', ');
          const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
          await query(sql);
        }
        resolve();
      })
      .on('error', reject);
  });
}

/**
 * @param dirPath CSVファイルが入っているディレクトリのパス(CSVのファイル名はテーブル名と一致していることを前提とする)
 */
export async function insertAllCsvInDir(dirPath: string) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file.endsWith('.csv')) {
      const tableName = file.slice(0, -4); // '.csv' を取り除いてテーブル名を取得
      await insertCsvDataIntoTable(tableName, join(dirPath, file));
    }
  }
}

export const query = (text: string, params?: any[]) => dbClient.query(text, params);
