import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { uploadFilesToStorage } from '@/utils/supaQueries'

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
  const uploadAllFiles = async (): Promise<string[]> => {
    const pendingFiles = uploadQueue.value.filter(item => item.status === 'pending')
    if (pendingFiles.length === 0) return []

    isUploading.value = true
    const uploadedUrls: string[] = []

    try {
      // Upload files in parallel (you could also do sequential if preferred)
      const uploadPromises = pendingFiles.map(uploadSingleFile)
      const results = await Promise.allSettled(uploadPromises)

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          uploadedUrls.push(result.value)
        }
      })

      return uploadedUrls
    } catch (error) {
      console.error('Batch upload failed:', error)
      return uploadedUrls
    } finally {
      isUploading.value = false
    }
  }

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

    // Computed
    pendingCount,
    uploadingCount,
    completedCount,
    errorCount,
    hasFiles,
    hasCompletedFiles
  }
})
