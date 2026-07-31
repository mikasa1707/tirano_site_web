import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
  imagePath: process.env.IMAGE_PATH || 'uploads/images',
  videoPath: process.env.VIDEO_PATH || 'uploads/videos',
  documentPath: process.env.DOCUMENT_PATH || 'uploads/documents',
  tempPath: process.env.TEMP_PATH || 'uploads/temp',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10 Mo
  allowedImages: (process.env.ALLOWED_IMAGES || 'jpg,jpeg,png,webp').split(','),
  allowedVideos: (process.env.ALLOWED_VIDEOS || 'mp4,mov,avi,webm').split(','),
  allowedDocuments: (
    process.env.ALLOWED_DOCUMENTS || 'pdf,doc,docx,xls,xlsx,ppt,pptx'
  ).split(','),
}));
