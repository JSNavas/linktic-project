<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Project } from 'src/interfaces/types';
import { generateId } from 'src/utils/generateId';
import { Notify } from 'quasar';

const props = defineProps<Props>();

interface Props {
  projectUpdate?: Project;
}

const projectForm = reactive<Project>({
  id: generateId(),
  name: '',
  description: '',
  status: false,
});

const emit = defineEmits<{
  (e: 'save', project: Project): void;
  (e: 'close', value: boolean): void;
}>();

const handleSave = () => {
  if (projectForm.name === '' || projectForm.description === '') {
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
  if (projectForm) {
    emit('save', projectForm);
  }
};

const handleClose = () => {
  emit('close', true);
};

onMounted(() => {
  if (props.projectUpdate) {
    const { id, name, description, status } = props.projectUpdate;
    projectForm.id = id;
    projectForm.name = name;
    projectForm.description = description;
    projectForm.status = status;
  }
});
</script>

<template>
  <q-card class="my-card no-shadow">
    <q-separator dark inset />
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-item>
            <q-input
              autogrow
              class="full-width custom-select"
              label="Nombre"
              v-model="projectForm.name"
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
              v-model="projectForm.description"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />
          </q-item>
        </div>
        <div class="col-12">
          <q-item>
            <q-toggle
              v-model="projectForm.status"
              size="lg"
              :label="projectForm.status == true ? 'Activo' : 'Inactivo'"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
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
