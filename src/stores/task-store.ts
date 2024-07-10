import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Task } from 'src/interfaces/types';
import { db } from 'src/boot/firebase';
import {
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
} from 'firebase/firestore/lite';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Array<Task>>([]);

  const getTasks = async (projectId: string) => {
    const projectRef = doc(db, 'projects', projectId);
    const tasksRef = collection(projectRef, 'tasks');
    const query = await getDocs(tasksRef);
    tasks.value = query.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        status: data.status,
      } as Task;
    });
  };

  const addTask = async (task: Task, projectId: string) => {
    const taskRef = doc(db, `projects/${projectId}/tasks/${task.id}`);
    await setDoc(taskRef, task);
    return getTasks(projectId);
  };

  const deleteTask = async (taskId: string, projectId: string) => {
    const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
    return getTasks(projectId);
  };

  return {
    tasks,
    getTasks,
    addTask,
    deleteTask,
  };
});
