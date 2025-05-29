import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

interface FileUploadItem {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploaded' | 'failed';
}

export function useFileUpload() {
  const uploadQueue = ref<FileUploadItem[]>([])
  const isUploading = ref(false)

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

  const uploadSingleFile = async (fileItem: FileUploadItem): Promise<string | null> => {
    const fileExt = fileItem.file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    try {
      const { error } = await supabase.storage
        .from('comment-attachments')
        .upload(filePath, fileItem.file)

      if (error) {
        console.error('Upload error:', error)
        fileItem.status = 'failed'
        return null
      }

      const { data: publicUrlData } = supabase.storage
        .from('comment-attachments')
        .getPublicUrl(filePath)

      if (publicUrlData?.publicUrl) {
        fileItem.status = 'uploaded'
        return publicUrlData.publicUrl
      }

      return null
    } catch (error) {
      console.error('Error uploading file:', error)
      fileItem.status = 'failed'
      return null
    }
  }

  const uploadAllFiles = async (): Promise<string[]> => {
    const pendingFiles = uploadQueue.value.filter(item => item.status === 'pending')
    if (pendingFiles.length === 0) return []

    isUploading.value = true
    const uploadedUrls: string[] = []

    try {
      const uploadPromises = pendingFiles.map(fileItem => uploadSingleFile(fileItem))
      const results = await Promise.allSettled(uploadPromises)

      results.forEach(result => {
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

  const clearAll = () => {
    uploadQueue.value = []
  }

  return {
    uploadQueue,
    isUploading,
    addFiles,
    uploadAllFiles,
    clearAll
  }
}
