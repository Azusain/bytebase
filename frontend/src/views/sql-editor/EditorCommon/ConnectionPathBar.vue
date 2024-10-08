<template>
  <div
    class="w-full shrink-0 flex flex-row flex-nowrap items-center justify-between bg-white overflow-hidden h-[42px]"
  >
    <div
      v-if="
        currentTab &&
        isValidInstanceName(instance.name) &&
        isValidDatabaseName(database.name)
      "
      class="flex justify-start items-center h-8 px-1 whitespace-nowrap shrink-0 gap-x-2"
    >
      <NButton
        :disabled="!projectContextReady"
        size="small"
        type="primary"
        ghost
        style="
          --n-color-hover: rgb(var(--color-accent) / 0.05);
          --n-color-pressed: rgb(var(--color-accent) / 0.05);
          --n-color-focus: rgb(var(--color-accent) / 0.05);
        "
        @click="changeConnection"
      >
        <div class="flex flex-row gap-x-2 text-main">
          <NPopover
            v-if="!hideEnvironments"
            :disabled="!isProductionEnvironment"
          >
            <template #trigger>
              <div class="inline-flex items-center text-sm rounded-sm bg-white">
                <span
                  class="px-2 rounded-sm"
                  :class="[
                    isProductionEnvironment
                      ? 'text-error bg-error/15'
                      : 'text-main bg-control-bg',
                  ]"
                >
                  {{ environment.title }}
                </span>
              </div>
            </template>
            <template #default>
              <div class="max-w-[20rem]">
                {{ $t("sql-editor.sql-execute-in-production-environment") }}
              </div>
            </template>
          </NPopover>

          <div class="flex items-center">
            <InstanceV1EngineIcon :instance="instance" show-status />
            <span class="ml-2">{{ instance.title }}</span>
          </div>
          <div class="flex items-center">
            <span class="">
              <heroicons-solid:chevron-right
                class="flex-shrink-0 h-4 w-4 text-control-light"
              />
            </span>
            <heroicons-outline:database />
            <span class="ml-2">{{ database.databaseName }}</span>

            <ReadonlyDatasourceHint
              v-if="!hideReadonlyDatasourceHint"
              :instance="instance"
              class="ml-1"
            />
          </div>
        </div>
      </NButton>

      <div v-if="showBatchQuerySelector" class="relative flex items-center">
        <BatchQueryDatabasesSelector />
      </div>
    </div>

    <div
      v-else
      class="flex justify-start items-center h-8 px-2 whitespace-nowrap overflow-x-auto"
    >
      <NButton
        :disabled="!projectContextReady"
        size="small"
        type="primary"
        ghost
        style="
          --n-color-hover: rgb(var(--color-accent) / 0.05);
          --n-color-pressed: rgb(var(--color-accent) / 0.05);
          --n-color-focus: rgb(var(--color-accent) / 0.05);
        "
        @click="changeConnection"
      >
        {{ $t("sql-editor.select-a-database-to-start") }}
      </NButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NPopover } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { InstanceV1EngineIcon } from "@/components/v2";
import {
  useAppFeature,
  useConnectionOfCurrentSQLEditorTab,
  useSQLEditorStore,
  useSQLEditorTabStore,
} from "@/store";
import { isValidDatabaseName, isValidInstanceName } from "@/types";
import { EnvironmentTier } from "@/types/proto/v1/environment_service";
import { useSQLEditorContext } from "../context";
import BatchQueryDatabasesSelector from "./BatchQueryDatabasesSelector.vue";
import ReadonlyDatasourceHint from "./ReadonlyDatasourceHint.vue";

const { currentTab, isDisconnected } = storeToRefs(useSQLEditorTabStore());
const { showConnectionPanel } = useSQLEditorContext();
const { projectContextReady } = storeToRefs(useSQLEditorStore());
const hideReadonlyDatasourceHint = useAppFeature(
  "bb.feature.sql-editor.hide-readonly-datasource-hint"
);
const hideEnvironments = useAppFeature(
  "bb.feature.sql-editor.hide-environments"
);
const disallowBatchQuery = useAppFeature(
  "bb.feature.sql-editor.disallow-batch-query"
);

const { instance, database, environment } =
  useConnectionOfCurrentSQLEditorTab();

const isProductionEnvironment = computed(() => {
  if (!currentTab.value) {
    return false;
  }
  if (isDisconnected.value) {
    return false;
  }

  return environment.value.tier === EnvironmentTier.PROTECTED;
});

const showBatchQuerySelector = computed(() => {
  if (disallowBatchQuery.value) {
    return false;
  }

  const tab = currentTab.value;
  return (
    tab &&
    // Only show entry when user selected a database.
    isValidDatabaseName(database.value.name) &&
    tab.mode !== "ADMIN"
  );
});

const changeConnection = () => {
  showConnectionPanel.value = true;
};
</script>
