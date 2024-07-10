<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar, Notify } from 'quasar';
import { columns } from 'src/components/Tasks/taskListColumns';
import CustomModal from 'src/components/Utils/CustomModal.vue';
import FormNewTask from 'src/components/Forms/FormAddTask.vue';
import { Task } from 'src/interfaces/types';
import { useTaskStore } from 'stores/task-store';
import { storeToRefs } from 'pinia';

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const currentTask = ref<Task | null>(null);
const filter = ref('');
const selected = ref([]);
const loading = ref(false);
const showModal = ref(false);
const action = ref('');

const handleCloseModal = () => {
  currentTask.value = null;
  showModal.value = false;
  action.value = '';
};

const handleModal = () => {
  showModal.value = !showModal.value;
  currentTask.value = null;
  action.value = '';
};

const editTask = (row: Task, actionButton: string) => {
  currentTask.value = row;
  showModal.value = true;
  action.value = actionButton;
};

const getClassByStatus = (status: string) => {
  if (status === 'Pendiente') {
    return 'warning';
  }
  if (status === 'En progreso') {
    return 'primary';
  }
  if (status === 'Completada') {
    return 'secondary';
  }
};

const deleteTask = async (taskId: string) => {
  $q.dialog({
    title: 'Eliminar',
    message: '¿Está seguro que desea eliminar esta tarea?',
    ok: 'Eliminar',
    cancel: 'Cancelar',
    persistent: true,
  }).onOk(async () => {
    loading.value = true;
    await taskStore.deleteTask(taskId, props.projectId).then(() => {
      loading.value = false;
      $q.notify({
        type: 'positive',
        position: 'top-right',
        actions: [
          {
            icon: 'close',
            color: 'white',
          },
        ],
        message: 'La tarea se ha eliminado con éxito',
      });
    });
  });
};

const handleSaveTask = async (task: Task) => {
  const actionButton = action.value == 'update' ? 'actualizado' : 'creado';

  await taskStore.addTask(task, props.projectId);
  showModal.value = false;
  action.value = '';

  await taskStore.getTasks(props.projectId).then(() => {
    Notify.create({
      type: 'positive',
      position: 'top-right',
      actions: [
        {
          icon: 'close',
          color: 'white',
        },
      ],
      message: `La tarea se ha ${actionButton} con éxito`,
    });
  });
};

const countTasksByStatus = computed(() => {
  return tasks.value.reduce((filter, task) => {
    if (task.status) {
      filter[task.status] = filter[task.status] ? filter[task.status] + 1 : 1;
    }
    return filter;
  }, {} as Record<string, number>);
});

onMounted(async () => {
  loading.value = true;
  await taskStore.getTasks(props.projectId).then(() => {
    loading.value = false;
  });
});
</script>

<template>
  <q-page>
    <q-banner class="q-pa-md">
      <q-btn
        outline
        rounded
        icon="add"
        color="primary"
        label="Nueva Tarea"
        @click="handleModal"
      />

      <q-chip size="15px" class="float-right">
        <q-avatar color="warning" text-color="white">{{
          countTasksByStatus['Pendiente'] ?? 0
        }}</q-avatar>
        Pendiente
      </q-chip>

      <q-chip size="15px" class="float-right">
        <q-avatar color="primary" text-color="white">{{
          countTasksByStatus['En progreso'] ?? 0
        }}</q-avatar>
        En progreso
      </q-chip>

      <q-chip size="15px" class="float-right">
        <q-avatar color="secondary" text-color="white">{{
          countTasksByStatus['Completada'] ?? 0
        }}</q-avatar>
        Completada
      </q-chip>
    </q-banner>

    <div class="q-pa-md">
      <q-table
        :rows="tasks"
        :columns="columns"
        row-key="name"
        selection="multiple"
        v-model:selected="selected"
        :filter="filter"
        :loading="loading"
        grid
        hide-header
        :rows-per-page-options="[1000]"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:top-right>
          <q-input square v-model="filter" placeholder="Búsqueda">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:no-data="">
          <div class="full-width row flex-center text-black q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> No data available... </span>
          </div>
        </template>

        <template v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-mt-md"
            :style="props.selected ? 'transform: scale(0.95);' : ''"
          >
            <q-card class="my-card" flat bordered>
              <q-card-section>
                <div
                  :class="`text-overline text-${getClassByStatus(
                    props.row.status
                  )}`"
                >
                  {{ props.row.status }}
                  <q-icon
                    v-if="props.row.status === 'Completada'"
                    name="check_circle"
                    class="float-right"
                    size="20px"
                  />
                </div>

                <q-linear-progress
                  :value="100"
                  :color="getClassByStatus(props.row.status)"
                />

                <div class="text-h5 q-mt-sm q-mb-xs">{{ props.row.name }}</div>
                <div class="text-caption text-grey">
                  {{ props.row.description }}
                </div>
              </q-card-section>

              <q-card-actions>
                <q-space />
                <q-btn
                  outline
                  round
                  size="12px"
                  color="secondary"
                  icon="edit"
                  @click="editTask(props.row, 'update')"
                  class="q-mr-sm"
                />
                <q-btn
                  outline
                  round
                  size="12px"
                  color="red"
                  icon="delete"
                  @click="deleteTask(props.row.id)"
                  class="q-mr-sm"
                />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>

      <CustomModal
        :title="action == 'update' ? 'Actualizar tarea' : 'Nueva tarea'"
        v-model:show="showModal"
      >
        <FormNewTask
          :taskUpdate="currentTask"
          @save="handleSaveTask"
          @close="handleCloseModal"
        />
      </CustomModal>
    </div>
  </q-page>
</template>
