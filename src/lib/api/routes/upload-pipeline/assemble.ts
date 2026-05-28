import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/lib/api/zod-openapi';
import { UploadAssembleSchema } from '@/lib/schemas/upload-pipeline';

export function registerPipelineAssemble(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/upload/assemble',
    description: 'Finalizes the upload process by orchestrating chunk assembly, integrity verification, gallery registration, and post activity initialization. Also performs pre-flight transcode requirement checks for target platforms.',
    summary: 'Assemble Upload Orchestration',
    tags: ['Upload'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UploadAssembleSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Upload assembled successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.object({
                fileId: z.string(),
                fileName: z.string(),
                activityId: z.string(),
              }),
            }),
          },
        },
      },
    },
  });
}
