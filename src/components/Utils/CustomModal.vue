<script setup>
const model = defineModel('show', { required: true });

defineProps({
  title: String,
});
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      persistent
      backdrop-filter="blur(4px)"
      transition-hide="rotate"
      v-model="model"
    >
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6 text-center">{{ title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <slot />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
