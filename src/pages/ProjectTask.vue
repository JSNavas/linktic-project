<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import TaskList from 'components/Tasks/TaskList.vue';

const route = useRoute();
const projectId = ref(route.params.id);
</script>

<template>
  <q-page padding class="full-width">
    <TaskList :projectId="projectId" />
  </q-page>
</template>
