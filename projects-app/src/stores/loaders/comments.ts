// stores/loaders/comments.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Comment } from '@/types/Comments'
import {
  fetchCommentsForTask,
  addCommentToTask,
  fetchCommentsForProject,
  addCommentToProject
} from '@/utils/supaQueries'

export const useCommentsStore = defineStore('comments-store', () => {
  const comments = ref<Comment[]>([])
  const loading = ref(false)

  // Fetch comments by taskId or projectId
  const getComments = async ({
    taskId,
    projectId
  }: {
    taskId?: string
    projectId?: string
  }) => {
    loading.value = true
    try {
      let data: Comment[] = []
      if (taskId) {
        data = await fetchCommentsForTask(taskId)
      } else if (projectId) {
        data = await fetchCommentsForProject(projectId)
      }
      comments.value = data || []
    } catch (error) {
      console.error('Error loading comments:', error)
      comments.value = []
    } finally {
      loading.value = false
    }
  }

  // Post comment to task or project
  const postComment = async ({
    content,
    userId,
    taskId,
    projectId
  }: {
    content: string
    userId: string
    taskId?: string
    projectId?: string
  }) => {
    try {
      let newComment: Comment | null = null
      console.log('Task ID:', taskId)
      console.log('User ID:', userId)
      if (!taskId || !userId) {
        console.error('Invalid taskId or userId:', { taskId, userId })
        return null
      }
      if (taskId) {
        newComment = await addCommentToTask({ content, taskId, userId })
      } else if (projectId) {
        newComment = await addCommentToProject({ content, projectId, userId })
      }
      if (newComment) {
        comments.value = [newComment, ...comments.value].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at))
        console.log('Updated comments:', comments.value)
      }

    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  return {
    comments,
    loading,
    getComments,
    postComment
  }
})
