import { query } from './dbClient';
import { AfterSpec, BeforeSpec, ExecutionContext, Specification, Step } from "gauge-ts";
import { insertAllCsvInDir } from './dbClient';
import path from 'path';

export default class SetupAndTearDown {
  // テスト実行前後でデータベースの全てのテーブルをクリアする
  @BeforeSpec()
  public async clearDatabaseTablesBeforeSpec(context: ExecutionContext) {
    await this.clearDatabaseTables();
    const spec = context.getCurrentSpec();

    if (!spec) {
      throw new Error('spec is not found');
    }

    const specFilePath = spec.getFileName();
  }
  @AfterSpec()
  public async clearDatabaseTablesAfterSpec() {
    await this.clearDatabaseTables();
  }
  private async clearDatabaseTables() {
    const tables = await query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `);

    for (const row of tables.rows) {
      await query(`TRUNCATE TABLE ${row.tablename} CASCADE;`);
    }
  }

  // specDirPathはspecsディレクトリからのspecファイルの相対パス
  @Step("<specDirPath> のテスト実行準備をする")
  public async setUp(specDirPath: string) {
    await this.insertCsvData(specDirPath);
    await this.setEnv(specDirPath);
  }
  // setupのCSVファイルをデータベースに挿入する
  private async insertCsvData(specDirPath: string) {
    const specDir = path.dirname(specDirPath);
    const setUpDirPath = path.join(process.cwd(), specDir, 'setup');
    await insertAllCsvInDir(setUpDirPath);
  }
  // テスト実行するspecファイルのディレクトリパスを環境変数にセットする
  private async setEnv(specDirPath: string) {
    const specDir = path.dirname(specDirPath);
    const currentSpecDir = path.join(process.cwd(), specDir);
    process.env.CURRENT_SPEC_DIR = currentSpecDir;
  }
}
