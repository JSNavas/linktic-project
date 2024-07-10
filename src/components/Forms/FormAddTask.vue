<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Task } from 'src/interfaces/types';
import { generateId } from 'src/utils/generateId';
import { Notify } from 'quasar';

const props = defineProps<Props>();

interface Props {
  taskUpdate?: Task;
}

const taskForm = reactive({
  id: generateId(),
  name: '',
  description: '',
  status: 'Pendiente',
});

const emit = defineEmits<{
  (e: 'save', task: Task): void;
  (e: 'close', value: boolean): void;
}>();

const handleSave = () => {
  if (taskForm.name === '' || taskForm.description === '') {
    Notify.create({
      type: 'negative',
      position: 'top-right',
      actions: [
        {
          icon: 'close',
          color: 'white',
        },
      ],
      message: 'Campos obligatorios',
    });
    return;
  }
  if (taskForm) {
    emit('save', taskForm);
  }
};

const handleClose = () => {
  emit('close', true);
};

onMounted(() => {
  if (props.taskUpdate) {
    const { id, name, description, status } = props.taskUpdate;
    taskForm.id = id;
    taskForm.name = name;
    taskForm.description = description;
    taskForm.status = status;
  }
});
</script>

<template>
  <q-card class="q-pa-md" flat>
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-item>
            <q-input
              autogrow
              class="full-width custom-select"
              label="Nombre"
              v-model="taskForm.name"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />
          </q-item>
        </div>
        <div class="col-12">
          <q-item>
            <q-input
              type="textarea"
              class="full-width custom-select"
              label="Descripción"
              v-model="taskForm.description"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />
          </q-item>
        </div>
        <div class="col-12">
          <q-item>
            <q-select
              class="full-width custom-select"
              label="Estado"
              v-model="taskForm.status"
              :options="['Pendiente', 'En progreso', 'Completada']"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />
          </q-item>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        @click="handleClose"
        outline
        size="md"
        class="text-capitalize text-primary"
        >Cancelar
      </q-btn>

      <q-btn
        @click="handleSave"
        rounded
        size="md"
        square
        class="text-capitalize bg-primary text-white"
        >Guardar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
