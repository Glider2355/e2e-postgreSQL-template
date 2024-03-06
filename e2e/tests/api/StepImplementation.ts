import { Step, Table } from "gauge-ts";
import axios from "axios";
import fs from 'fs';
import { expect } from '@playwright/test';
import apiClient from "../../framework/apiClient";
import assert from "assert";

// JSONファイルの内容を読み込む関数
export const readJsonFile = (filePath: string): any => {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawContent);
};

export default class StepImplementation {
    /**
     * @param urlPath ドメインを含まないパス
     * @param expectedJsonName 実行中のspecファイルと同階層のexpect/以下に配置されているJSONファイル名(期待値)
     */
    @Step("<urlPath> からのgetリクエストのレスポンスが <expectedJsonName> と一致する")
    async getRequestAndCompareWithJson(urlPath: string, expectedJsonName: string) {
        const specDir = process.env.CURRENT_SPEC_DIR;
        const baseUrl = process.env.BACKEND_URL;
        if (typeof specDir !== 'string') {
            throw new Error("環境変数 'CURRENT_SPEC_DIR' が設定されていません。");
        }

        // GETリクエストを実行
        const fullUrl = `${baseUrl}${urlPath}`;
        const response = await axios.get(fullUrl);

        // 期待されるレスポンス
        const expectedResponse = readJsonFile(`${specDir}/expect/${expectedJsonName}`);

        expect(response.data).toEqual(expectedResponse);

    }

    @Step("URLパス <urlPath> に対してAPIを呼び出し、期待されるJSONレスポンスを検証する <table>")
    public async assertJson(urlPath: string, table: Table): Promise<void> {

        const response = await apiClient.get(urlPath);
        const actual = response.data;

        const expected = table.getTableRows().reduce<{ [key: string]: any }>((acc, row) => {
            const key = row.getCell('key');
            let value: any = row.getCell('expectedValue');
            // JSONとして解析可能な場合は解析する
            try {
                value = JSON.parse(value);
            } catch {
                // 値が単純な文字列など、JSONとして解析できない場合はそのまま使用
            }
            acc[key] = value;
            return acc;
        }, {});

        expect(actual).toEqual(expected);
    }
}
