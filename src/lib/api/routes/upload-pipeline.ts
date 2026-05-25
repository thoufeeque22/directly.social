import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerPipelineInitialize } from './upload-pipeline/initialize';
import { registerPipelineChunk } from './upload-pipeline/chunk';
import { registerPipelineAssemble } from './upload-pipeline/assemble';

export function registerUploadPipelineRoutes(registry: OpenAPIRegistry) {
  registerPipelineInitialize(registry);
  registerPipelineChunk(registry);
  registerPipelineAssemble(registry);
}
