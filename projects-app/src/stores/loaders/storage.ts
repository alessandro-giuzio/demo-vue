import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { uploadFilesToStorage, deleteFileFromStorage } from '@/utils/supaQueries'

export interface FileUploadItem {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
}
export const useFileUploadStore = defineStore('file-upload-store', () => {
  const uploadQueue = ref<FileUploadItem[]>([])
  const isUploading = ref(false)
  // Add files to upload queue
  const addFiles = (files: File[]) => {
    const newItems: FileUploadItem[] = files.map(file => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      progress: 0,
      status: 'pending'
    }))

    uploadQueue.value = [...uploadQueue.value, ...newItems]
    return newItems.map(item => item.id)
  }

  // Remove file from queue
  const removeFile = (fileId: string) => {
    uploadQueue.value = uploadQueue.value.filter(item => item.id !== fileId)
  }

  // Clear completed uploads
  const clearCompleted = () => {
    uploadQueue.value = uploadQueue.value.filter(
      item => item.status !== 'completed' && item.status !== 'error'
    )
  }

  // Clear all uploads
  const clearAll = () => {
    uploadQueue.value = []
  }

  // Upload single file with progress tracking
  const uploadSingleFile = async (fileItem: FileUploadItem): Promise<string | null> => {
    try {
      // Update status to uploading
      const item = uploadQueue.value.find(i => i.id === fileItem.id)
      if (!item) return null

      item.status = 'uploading'
      item.progress = 0

      // Simulate progress updates (since we don't have real progress from Supabase)
      const progressInterval = setInterval(() => {
        if (item.progress < 90) {
          item.progress += Math.random() * 20
        }
      }, 200)

      // Upload the file
      const result = await uploadFilesToStorage([fileItem.file])

      clearInterval(progressInterval)

      if (result.urls.length > 0) {
        item.progress = 100
        item.status = 'completed'
        item.url = result.urls[0]
        return result.urls[0]
      } else {
        throw new Error('No URL returned from upload')
      }
    } catch (error) {
      const item = uploadQueue.value.find(i => i.id === fileItem.id)
      if (item) {
        item.status = 'error'
        item.error = error instanceof Error ? error.message : 'Upload failed'
      }
      console.error('Upload failed:', error)
      return null
    }
  }

  // Upload all pending files
  // Or wherever your file upload store is located

  // Upload all files in the queue
  const uploadAllFiles = async () => {
    if (!hasFiles.value) return [];

    // Filter files that need uploading
    const filesToUpload = uploadQueue.value.filter(
      (item) => item.status === 'pending' || item.status === 'failed'
    );

    if (filesToUpload.length === 0) {
      return uploadQueue.value
        .filter((item) => item.status === 'completed')
        .map((item) => item.url);
    }

    try {
      // Set all selected files to uploading status
      filesToUpload.forEach((item) => {
        item.status = 'uploading';
      });

      // Upload each file in the queue
      const uploadPromises = filesToUpload.map(async (item) => {
        try {
          const publicUrl = await uploadFilesToStorage(item.file);

          // Update the item in the queue
          const index = uploadQueue.value.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            uploadQueue.value[index].status = 'completed';
            uploadQueue.value[index].url = publicUrl;
          }

          return publicUrl;
        } catch (error) {
          // Mark the item as failed
          const index = uploadQueue.value.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            uploadQueue.value[index].status = 'failed';
            uploadQueue.value[index].error = error.message;
          }

          console.error(`Failed to upload ${item.file.name}:`, error);
          return null;
        }
      });

      // Wait for all uploads to complete or fail
      const results = await Promise.allSettled(uploadPromises);

      // Return all successful URLs
      return uploadQueue.value
        .filter((item) => item.status === 'completed')
        .map((item) => item.url);
    } catch (error) {
      console.error('Upload failed:', error);
      return [];
    }
  };

  // Validate file before adding to queue
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'image/',
      'application/pdf',
      'text/',
      'application/msword',
      'application/vnd.openxmlformats-officedocument'
    ]

    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit' }
    }

    const isValidType = allowedTypes.some(type => file.type.startsWith(type))
    if (!isValidType) {
      return { valid: false, error: 'File type not allowed' }
    }

    return { valid: true }
  }

  // Add files with validation
  const addFilesWithValidation = (files: File[]): {
    added: string[],
    rejected: { file: File, error: string }[]
  } => {
    const added: string[] = []
    const rejected: { file: File, error: string }[] = []

    files.forEach(file => {
      const validation = validateFile(file)
      if (validation.valid) {
        const [fileId] = addFiles([file])
        added.push(fileId)
      } else {
        rejected.push({ file, error: validation.error || 'Invalid file' })
      }
    })

    return { added, rejected }
  }

  // Get files by status
  const getFilesByStatus = (status: FileUploadItem['status']) => {
    return uploadQueue.value.filter(item => item.status === status)
  }

  // Get completed files with URLs
  const getCompletedFiles = () => {
    return uploadQueue.value
      .filter(item => item.status === 'completed' && item.url)
      .map(item => ({
        id: item.id,
        name: item.file.name,
        url: item.url!,
        type: item.file.type,
        size: item.file.size
      }))
  }

  // Computed getters
  const pendingCount = computed(() =>
    uploadQueue.value.filter(item => item.status === 'pending').length
  )

  const uploadingCount = computed(() =>
    uploadQueue.value.filter(item => item.status === 'uploading').length
  )

  const completedCount = computed(() =>
    uploadQueue.value.filter(item => item.status === 'completed').length
  )

  const errorCount = computed(() =>
    uploadQueue.value.filter(item => item.status === 'error').length
  )

  const hasFiles = computed(() => uploadQueue.value.length > 0)

  const hasCompletedFiles = computed(() => completedCount.value > 0)
  const deleteFile = async (fileId: string): Promise<boolean> => {
    const fileIndex = uploadQueue.value.findIndex(item => item.id === fileId);

    if (fileIndex === -1) {
      console.error('File not found in upload queue:', fileId);
      return false;
    }

    const file = uploadQueue.value[fileIndex];

    // Only attempt to delete from storage if the file was successfully uploaded
    if (file.status === 'completed' && file.url) {
      try {
        const deleted = await deleteFileFromStorage(file.url);
        if (!deleted) {
          console.warn('Failed to delete file from storage, but will remove from UI');
        }
        // Remove from queue regardless of storage deletion success
        uploadQueue.value = uploadQueue.value.filter(item => item.id !== fileId);
        return true;
      } catch (error) {
        console.error('Error deleting file:', error);
        return false;
      }
    } else {
      // File wasn't uploaded yet, just remove from queue
      uploadQueue.value = uploadQueue.value.filter(item => item.id !== fileId);
      return true;
    }
  };

  /**
   * Delete multiple files from storage by URL
   */
  const deleteFiles = async (fileUrls: string[]): Promise<boolean[]> => {
    const results = await Promise.allSettled(
      fileUrls.map(url => deleteFileFromStorage(url))
    );

    return results.map(result =>
      result.status === 'fulfilled' ? result.value : false
    );
  };
  return {
    // State
    uploadQueue: readonly(uploadQueue),
    isUploading: readonly(isUploading),

    // Actions
    addFiles,
    addFilesWithValidation,
    removeFile,
    clearCompleted,
    clearAll,
    uploadSingleFile,
    uploadAllFiles,
    validateFile,
    getFilesByStatus,
    getCompletedFiles,
    deleteFile,
    deleteFiles,

    // Computed
    pendingCount,
    uploadingCount,
    completedCount,
    errorCount,
    hasFiles,
    hasCompletedFiles
  }
})
