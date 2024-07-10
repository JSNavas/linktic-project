import { db } from 'src/boot/firebase';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Project } from 'src/interfaces/types';
import {
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
} from 'firebase/firestore/lite';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Array<Project>>([]);

  const getProjects = async () => {
    const collectionRef = collection(db, 'projects');
    const query = await getDocs(collectionRef);

    projects.value = query.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
      } as Project;
    });
  };

  const addProject = async (project: Project) => {
    const collectionRef = collection(db, 'projects');
    await setDoc(doc(collectionRef, project.id), project);
    return getProjects();
  };

  const deleteProject = async (id: string) => {
    const collectionRef = collection(db, 'projects');
    await deleteDoc(doc(collectionRef, id));
    return getProjects();
  };

  return {
    projects,
    getProjects,
    addProject,
    deleteProject,
  };
});
