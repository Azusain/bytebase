<template>
  <div class="w-full mb-2">
    <NRadioGroup
      v-model:value="state.allDatabases"
      class="w-full !flex flex-row justify-start items-center gap-4"
    >
      <NTooltip trigger="hover">
        <template #trigger>
          <NRadio
            :value="true"
            :label="$t('issue.grant-request.all-databases')"
          />
        </template>
        {{ $t("issue.grant-request.all-databases-tip") }}
      </NTooltip>
      <NRadio
        class="!leading-6"
        :value="false"
        :disabled="!project"
        :label="$t('issue.grant-request.manually-select')"
      />
    </NRadioGroup>
  </div>
  <div
    v-if="!state.allDatabases"
    class="w-full flex flex-row justify-start items-center"
  >
    <DatabaseResourceSelector
      v-if="project"
      :project-name="project.name"
      :database-resources="state.databaseResources"
      @update="handleSelectedDatabaseResourceChanged"
    />
  </div>
</template>

<script lang="ts" setup>
import { NRadioGroup, NRadio, NTooltip } from "naive-ui";
import { computed, onMounted, reactive, watch } from "vue";
import { useProjectByName } from "@/store";
import type { DatabaseResource } from "@/types";
import { stringifyDatabaseResources } from "@/utils/issue/cel";
import DatabaseResourceSelector from "./DatabaseResourceSelector.vue";

interface LocalState {
  allDatabases: boolean;
  databaseResources: DatabaseResource[];
}

const props = defineProps<{
  projectName: string;
  databaseResources?: DatabaseResource[];
}>();

const emit = defineEmits<{
  (event: "update:condition", value?: string): void;
  (
    event: "update:database-resources",
    databaseResources: DatabaseResource[]
  ): void;
}>();

const state = reactive<LocalState>({
  allDatabases: (props.databaseResources || []).length === 0,
  databaseResources: props.databaseResources || [],
});
const { project } = useProjectByName(computed(() => props.projectName));

const handleSelectedDatabaseResourceChanged = (
  databaseResourceList: DatabaseResource[]
) => {
  state.databaseResources = databaseResourceList;
};

onMounted(() => {
  if (props.databaseResources && props.databaseResources.length > 0) {
    state.allDatabases = false;
  }
});

watch(
  () => [state.allDatabases, state.databaseResources],
  () => {
    if (state.allDatabases) {
      emit("update:condition", "");
    } else {
      if (state.databaseResources.length === 0) {
        emit("update:condition", undefined);
      } else {
        const condition = stringifyDatabaseResources(state.databaseResources);
        emit("update:condition", condition);
      }
      emit("update:database-resources", state.databaseResources);
    }
  },
  {
    immediate: true,
  }
);
</script>
