import {DataStoreFactory, DataStore} from 'gauge-ts';

export class DataStoreManager {
    private static dataStore: DataStore;

    // 並列実行時は使用しない
    public static getSuiteDataStore(): DataStore {
        if (!DataStoreManager.dataStore) {
            DataStoreManager.dataStore = DataStoreFactory.getSuiteDataStore();
        }
        return DataStoreManager.dataStore;
    }

    public static getSpecDataStore(): DataStore {
        if (!DataStoreManager.dataStore) {
            DataStoreManager.dataStore = DataStoreFactory.getSpecDataStore();
        }
        return DataStoreManager.dataStore;
    }

    public static getScenarioDataStore(): DataStore {
        if (!DataStoreManager.dataStore) {
            DataStoreManager.dataStore = DataStoreFactory.getScenarioDataStore();
        }
        return DataStoreManager.dataStore;
    }
}
