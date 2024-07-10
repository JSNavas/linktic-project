<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar, Notify } from 'quasar';
import { useRouter } from 'vue-router';
import { useProjectStore } from 'stores/projects-store';
import { columns } from 'src/components/Projects/projectListColumns';
import { Project } from 'src/interfaces/types';
import { storeToRefs } from 'pinia';
import CustomModal from 'src/components/Utils/CustomModal.vue';
import FormAddProject from 'components/Forms/FormAddProject.vue';

const $q = useQuasar();
const router = useRouter();

const projectStore = useProjectStore();
const { projects } = storeToRefs(projectStore);

const currentProject = ref<Project | null>(null);
const pagination = { rowsPerPage: 10 };
const showModal = ref(false);
const filter = ref('');
const loading = ref(false);
const action = ref('');

const handleCloseModal = () => {
  currentProject.value = null;
  showModal.value = false;
  action.value = '';
};

const handleModal = () => {
  showModal.value = !showModal.value;
  currentProject.value = null;
  action.value = '';
};

const handleSaveProject = async (project: Project) => {
  const actionButton = action.value == 'update' ? 'actualizado' : 'creado';

  await projectStore.addProject(project);
  showModal.value = false;
  action.value = '';
  loading.value = true;

  await projectStore.getProjects().then(() => {
    loading.value = false;
    Notify.create({
      type: 'positive',
      position: 'top-right',
      actions: [
        {
          icon: 'close',
          color: 'white',
        },
      ],
      message: `El proyecto se ha ${actionButton} con éxito`,
    });
  });
};

const handleProjectTask = (project: Project) => {
  router.push({ name: 'ProjectTask', params: { id: project.id } });
};

const deleteProject = async (row: Project) => {
  $q.dialog({
    title: 'Eliminar',
    message: '¿Desea eliminar este proyecto?',
    ok: 'Eliminar',
    cancel: 'Cancelar',
    persistent: true,
  }).onOk(async () => {
    loading.value = true;
    await projectStore.deleteProject(row.id).then(() => {
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
        message: 'El proyecto se ha eliminado con éxito',
      });
    });
  });
};

const editProject = (row: Project, actionButton: string) => {
  currentProject.value = row;
  showModal.value = true;
  action.value = actionButton;
};

onMounted(async () => {
  loading.value = true;

  await projectStore.getProjects().then(() => {
    loading.value = false;
  });
});
</script>

<template>
  <q-page>
    <q-btn
      outline
      rounded
      icon="add"
      color="primary"
      label="Nuevo Proyecto"
      class="q-ma-sm"
      @click="handleModal"
    />

    <div class="q-pa-md">
      <q-table
        flat
        bordered
        :columns="columns"
        :pagination="pagination"
        :rows="projects"
        row-key="index"
        :loading="loading"
        :filter="filter"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:top>
          <q-space />
          <q-input
            v-model="filter"
            square
            color="primary"
            debounce="300"
            dense
            placeholder="Búsqueda"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.status == true ? 'green' : 'red'"
              rounded
              class="q-mr-sm text-center"
            />{{ props.row.status == true ? 'Activo' : 'Inactivo' }}
          </q-td>
        </template>

        <template v-slot:no-data="">
          <div class="full-width row flex-center text-black q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> No data available... </span>
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-fab
              color="primary"
              push
              outline
              icon="keyboard_arrow_right"
              direction="right"
            >
              <q-fab-action
                color="primary"
                @click="handleProjectTask(props.row)"
                icon="visibility"
              >
                <q-tooltip class="bg-black">Ver tareas</q-tooltip>
              </q-fab-action>

              <q-fab-action
                color="secondary"
                @click="editProject(props.row, 'update')"
                icon="edit"
              >
                <q-tooltip class="bg-black">Editar</q-tooltip>
              </q-fab-action>

              <q-fab-action
                color="negative"
                @click="deleteProject(props.row)"
                icon="delete"
              >
                <q-tooltip class="bg-black">Eliminar</q-tooltip>
              </q-fab-action>
            </q-fab>
          </q-td>
        </template>
      </q-table>
    </div>

    <CustomModal
      :title="action == 'update' ? 'Actualizar proyecto' : 'Nuevo proyecto'"
      v-model:show="showModal"
    >
      <FormAddProject
        :projectUpdate="currentProject"
        @save="handleSaveProject"
        @close="handleCloseModal"
      />
    </CustomModal>
  </q-page>
</template>
