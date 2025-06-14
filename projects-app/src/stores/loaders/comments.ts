// stores/loaders/comments.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Comment } from '@/types/Comments'
import {
  fetchCommentsForTask,
  addCommentToTask,
  fetchCommentsForProject,
  addCommentToProject,
  deleteFileFromStorage
} from '@/utils/supaQueries'
import { supabase } from '../../lib/supabaseClient'

export const useCommentsStore = defineStore('comments-store', () => {
  const comments = ref<Comment[]>([])
  const loading = ref(false)

  /**
 * Extracts file URLs from comment content
 */
  const extractFileUrls = (content: string): string[] => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const urls: string[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      urls.push(match[2]); // The URL is in the second capture group
    }

    return urls;
  };

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

  // Delete a comment and its associated files
  const deleteCommentWithFiles = async (commentId: string) => {
    const isDeleting = ref(true);

    try {
      // Find the comment
      const comment = comments.value.find(c => c.id === commentId);
      if (!comment) {
        console.error('Comment not found:', commentId);
        return;
      }
      // Extract all file URLs from the comment
      const fileUrls = extractFileUrls(comment.content);

      // Delete the files from storage if there are any
      if (fileUrls.length > 0) {
        console.log('Deleting files for comment:', fileUrls);
        // Delete each file from storage
        for (const url of fileUrls) {
          try {
            await deleteFileFromStorage(url);
          } catch (error) {
            console.error(`Failed to delete file: ${url}`, error);
            // Continue with other files even if one fails
          }
        }
      }
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        return;
      }
      // Update local state
      comments.value = comments.value.filter(c => c.id !== commentId);

      // If we were editing this comment, cancel editing
      if (editingCommentId.value === commentId) {
        cancelEdit();
      }
    } catch (error) {
      console.error('Error deleting comment with files:', error);
    } finally {
      isDeleting.value = false;
    }
  };

  // Then update your deleteComment function to use this new function:
  const deleteComment = async (commentId: string) => {
    // Confirm deletion with the user
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    await deleteCommentWithFiles(commentId);
  };


  return {
    comments,
    loading,
    fetchComments: getComments,
    getComments,
    postComment,
    deleteComment,
    extractFileUrls,
    deleteCommentWithFiles
  }
})
