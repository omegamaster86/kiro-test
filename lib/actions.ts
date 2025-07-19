'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string
  
  // バリデーション: 空のタイトルをチェック
  if (!title || title.trim().length === 0) {
    throw new Error('タスクのタイトルを入力してください')
  }
  
  try {
    // 新しいタスクをデータベースに保存
    await prisma.todo.create({
      data: {
        title: title.trim(),
        completed: false
      }
    })
    
    // ページを更新してUIに反映
    revalidatePath('/')
  } catch (error) {
    console.error('タスク作成エラー:', error)
    throw new Error('タスクの作成に失敗しました')
  }
}

export async function toggleTodo(id: string) {
  try {
    // 現在のタスクを取得
    const currentTodo = await prisma.todo.findUnique({
      where: { id }
    })
    
    if (!currentTodo) {
      throw new Error('タスクが見つかりません')
    }
    
    // 完了状態を切り替え
    await prisma.todo.update({
      where: { id },
      data: {
        completed: !currentTodo.completed
      }
    })
    
    // ページを更新してUIに反映
    revalidatePath('/')
  } catch (error) {
    console.error('タスク状態切り替えエラー:', error)
    throw new Error('タスクの状態切り替えに失敗しました')
  }
}

export async function updateTodo(id: string, title: string) {
  // バリデーション: 空のタイトルをチェック
  if (!title || title.trim().length === 0) {
    throw new Error('タスクのタイトルを入力してください')
  }
  
  try {
    // タスクの存在確認
    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    })
    
    if (!existingTodo) {
      throw new Error('タスクが見つかりません')
    }
    
    // タスクのタイトルを更新
    await prisma.todo.update({
      where: { id },
      data: {
        title: title.trim()
      }
    })
    
    // ページを更新してUIに反映
    revalidatePath('/')
  } catch (error) {
    console.error('タスク更新エラー:', error)
    throw new Error('タスクの更新に失敗しました')
  }
}

export async function deleteTodo(id: string) {
  try {
    // タスクの存在確認
    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    })
    
    if (!existingTodo) {
      throw new Error('タスクが見つかりません')
    }
    
    // タスクをデータベースから削除
    await prisma.todo.delete({
      where: { id }
    })
    
    // ページを更新してUIに反映
    revalidatePath('/')
  } catch (error) {
    console.error('タスク削除エラー:', error)
    throw new Error('タスクの削除に失敗しました')
  }
}