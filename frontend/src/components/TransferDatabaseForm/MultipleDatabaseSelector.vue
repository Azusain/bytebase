<template>
  <div class="w-full">
    <!-- Leave some margin space to avoid accidentally clicking the Collaspe when trying to click the selector -->
    <NCollapse
      arrow-placement="left"
      :default-expanded-names="environmentList.map((env) => env.name)"
    >
      <NCollapseItem
        v-for="{
          environment,
          databaseList: databaseListInEnvironment,
        } in databaseListGroupByEnvironment"
        :key="environment.name"
        :name="environment.name"
      >
        <template #header>
          <label class="flex items-center gap-x-2" @click.stop.prevent>
            <NCheckbox
              v-bind="
                getAllSelectionStateForEnvironment(
                  environment,
                  databaseListInEnvironment
                )
              "
              @update:checked="
                toggleAllDatabasesSelectionForEnvironment(
                  environment,
                  databaseListInEnvironment,
                  $event
                )
              "
            />
            <div>{{ environment.title }}</div>
            <ProductionEnvironmentV1Icon :environment="environment" />
          </label>
        </template>

        <template #header-extra>
          <div class="flex items-center text-xs text-gray-500 mr-2">
            {{
              $t(
                "database.n-selected-m-in-total",
                getSelectionStateSummaryForEnvironment(
                  environment,
                  databaseListInEnvironment
                )
              )
            }}
          </div>
        </template>

        <BBGrid
          class="relative bg-white border"
          :column-list="gridColumnList"
          :show-header="false"
          :data-source="databaseListInEnvironment"
          row-key="id"
          @click-row="handleClickRow"
        >
          <template #item="{ item: database }: { item: ComposedDatabase }">
            <div class="bb-grid-cell gap-x-2 !pl-[23px]">
              <div @click.stop.prevent>
                <NCheckbox
                  :checked="
                    isDatabaseSelectedForEnvironment(
                      database.name,
                      environment.name
                    )
                  "
                  @update:checked="
                    toggleDatabaseNameForEnvironment(
                      database.name,
                      environment.name,
                      $event
                    )
                  "
                />
              </div>
              <span
                class="font-medium text-main"
                :class="database.syncState !== State.ACTIVE && 'opacity-40'"
              >
                {{ database.databaseName }}
              </span>
            </div>
            <div v-if="showProjectColumn" class="bb-grid-cell">
              <ProjectNameCell :project="database.projectEntity" />
            </div>
            <div class="bb-grid-cell justify-end">
              <InstanceV1Name
                :instance="database.instanceResource"
                :link="false"
              />
            </div>
            <div class="bb-grid-cell textinfolabel justify-end">
              {{ hostPortOfInstanceV1(database.instanceResource) }}
            </div>
          </template>
        </BBGrid>
      </NCollapseItem>
    </NCollapse>
  </div>
</template>

<script lang="ts" setup>
import { NCollapse, NCollapseItem, NCheckbox } from "naive-ui";
import { computed, reactive, watch } from "vue";
import { type BBGridColumn, BBGrid } from "@/bbkit";
import { ProjectNameCell } from "@/components/v2/Model/DatabaseV1Table/cells";
import { useEnvironmentV1List } from "@/store";
import type { ComposedDatabase } from "@/types";
import { State } from "@/types/proto/v1/common";
import type { Environment } from "@/types/proto/v1/environment_service";
import { hostPortOfInstanceV1 } from "@/utils";
import { InstanceV1Name, ProductionEnvironmentV1Icon } from "../v2";
import type { TransferSource } from "./utils";

type LocalState = {
  selectedDatabaseNameListForEnvironment: Map<string, Set<string>>;
};

const props = withDefaults(
  defineProps<{
    transferSource: TransferSource;
    databaseList: ComposedDatabase[];
    selectedDatabaseNameList?: string[];
  }>(),
  {
    selectedDatabaseNameList: () => [],
  }
);

const emit = defineEmits<{
  (e: "update:selectedDatabaseNameList", databaseNameList: string[]): void;
}>();

const environmentList = useEnvironmentV1List();

const state = reactive<LocalState>({
  selectedDatabaseNameListForEnvironment: new Map(),
});

const toggleDatabaseNameForEnvironment = (
  databaseName: string,
  environmentName: string,
  selected: boolean
) => {
  const map = state.selectedDatabaseNameListForEnvironment;
  const set = map.get(environmentName) || new Set();
  if (selected) {
    set.add(databaseName);
  } else {
    set.delete(databaseName);
  }
  map.set(environmentName, set);
};

watch(
  () => [props.databaseList, props.selectedDatabaseNameList],
  (args) => {
    const [databaseList, selectedDatabaseNameList] = args as [
      ComposedDatabase[],
      string[],
    ];
    for (const name of selectedDatabaseNameList) {
      const database = databaseList.find((db) => db.name === name);
      if (!database) {
        continue;
      }
      toggleDatabaseNameForEnvironment(
        name,
        database.effectiveEnvironment,
        true
      );
    }
  },
  { immediate: true }
);

watch(
  () => state.selectedDatabaseNameListForEnvironment,
  (map) => {
    const list: string[] = [];
    for (const listForEnv of map.values()) {
      list.push(...listForEnv);
    }
    emit("update:selectedDatabaseNameList", list);
  },
  { deep: true }
);

const showProjectColumn = computed(() => {
  return props.transferSource === "OTHER";
});

const gridColumnList = computed((): BBGridColumn[] => {
  return [
    {
      width: "1fr",
    },
    {
      width: "8rem",
      hide: !showProjectColumn.value,
    },
    {
      width: "20rem",
    },
    {
      width: "10rem",
    },
  ].filter((col) => !col.hide);
});

const databaseListGroupByEnvironment = computed(() => {
  const listByEnv = environmentList.value.map((environment) => {
    const databaseList = props.databaseList.filter(
      (db) => db.effectiveEnvironment === environment.name
    );
    return {
      environment,
      databaseList,
    };
  });

  return listByEnv.filter((group) => group.databaseList.length > 0);
});

watch(
  () => props.transferSource,
  () => {
    // Clear selected database name list when transferSource changed.
    state.selectedDatabaseNameListForEnvironment.clear();
  }
);

const isDatabaseSelectedForEnvironment = (
  databaseName: string,
  environmentName: string
) => {
  const map = state.selectedDatabaseNameListForEnvironment;
  const set = map.get(environmentName) || new Set();
  return set.has(databaseName);
};

const getAllSelectionStateForEnvironment = (
  environment: Environment,
  databaseList: ComposedDatabase[]
): { checked: boolean; indeterminate: boolean } => {
  const set =
    state.selectedDatabaseNameListForEnvironment.get(environment.name) ??
    new Set();
  const checked = set.size > 0 && databaseList.every((db) => set.has(db.name));
  const indeterminate = !checked && databaseList.some((db) => set.has(db.name));

  return {
    checked,
    indeterminate,
  };
};

const toggleAllDatabasesSelectionForEnvironment = (
  environment: Environment,
  databaseList: ComposedDatabase[],
  on: boolean
) => {
  databaseList.forEach((db) =>
    toggleDatabaseNameForEnvironment(db.name, environment.name, on)
  );
};

const getSelectionStateSummaryForEnvironment = (
  environment: Environment,
  databaseList: ComposedDatabase[]
) => {
  const set =
    state.selectedDatabaseNameListForEnvironment.get(environment.name) ||
    new Set();
  const selected = databaseList.filter((db) => set.has(db.name)).length;
  const total = databaseList.length;
  return { selected, total };
};

const handleClickRow = (db: ComposedDatabase) => {
  const environmentName = db.effectiveEnvironment;
  toggleDatabaseNameForEnvironment(
    db.name,
    environmentName,
    !isDatabaseSelectedForEnvironment(db.name, environmentName)
  );
};
</script>
