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
      if (taskId) {
        newComment = await addCommentToTask({ content, taskId, userId })
      } else if (projectId) {
        newComment = await addCommentToProject({ content, projectId, userId })
      }

      if (newComment) {
        comments.value = [...comments.value, newComment] // ✅ trigger Vue reactivity
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
