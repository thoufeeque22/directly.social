import { PublishingRepository, StorageProvider } from "../platforms/types";
import { PrismaPublishingRepository } from "./publishing-repository";
import { FileSystemStorageProvider } from "./storage-provider";

/**
 * (OO-002): Service Locator for infrastructure components.
 * Allows for dependency injection/replacement in test environments.
 */
class InfrastructureRegistry {
  private static repository: PublishingRepository = new PrismaPublishingRepository();
  private static storage: StorageProvider = new FileSystemStorageProvider();

  static getRepository(): PublishingRepository {
    return this.repository;
  }

  static setRepository(repo: PublishingRepository) {
    this.repository = repo;
  }

  static getStorage(): StorageProvider {
    return this.storage;
  }

  static setStorage(storage: StorageProvider) {
    this.storage = storage;
  }
}

export const getRepository = () => InfrastructureRegistry.getRepository();
export const getStorage = () => InfrastructureRegistry.getStorage();
