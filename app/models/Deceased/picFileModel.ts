export interface PicFileModel {
  fileId?: number;
  deceasedId: number;
  fileType: number;
  fileGUIDName?: string | null;
  fileUrl?: string | null;
  deleteDate?: string | null;
  picFile?: File | null;
  altName?: string | null;
  status: 'done' | 'error';
}
