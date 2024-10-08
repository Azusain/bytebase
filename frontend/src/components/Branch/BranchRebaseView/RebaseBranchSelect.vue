<template>
  <div
    class="w-full grid grid-cols-3 items-end text-sm gap-x-2"
    style="grid-template-columns: 1fr auto 1fr"
  >
    <BranchSelector
      class="!full text-center"
      :clearable="false"
      :project="project"
      :branch="headBranch?.name"
      :filter="headBranchFilter"
      @update:branch="$emit('update:head-branch-name', $event)"
    />
    <div class="flex flex-row justify-center px-2 h-[34px]">
      <MoveLeftIcon :size="40" stroke-width="1" />
    </div>
    <div class="flex flex-col">
      <NRadioGroup
        v-if="!parentBranchOnly"
        :value="sourceType"
        class="space-x-2"
        @update:value="$emit('update:source-type', $event as RebaseSourceType)"
      >
        <NRadio value="BRANCH">{{ $t("common.branch") }}</NRadio>
        <NRadio value="DATABASE">{{ $t("common.database") }}</NRadio>
      </NRadioGroup>
      <div v-if="parentBranchOnly">
        {{ $t("schema-designer.parent-branch") }}
      </div>

      <BranchSelector
        v-if="sourceType === 'BRANCH'"
        class="!w-full text-center"
        :disabled="parentBranchOnly"
        :clearable="false"
        :project="project"
        :branch="sourceBranch?.name"
        :filter="sourceBranchFilter"
        @update:branch="$emit('update:source-branch-name', $event)"
      />
      <DatabaseSelect
        v-if="sourceType === 'DATABASE'"
        :database-name="sourceDatabase?.name"
        :project-name="project.name"
        :allowed-engine-type-list="headBranch ? [headBranch.engine] : undefined"
        :filter="databaseFilter"
        :loading="isPreparingDatabaseGroups"
        style="width: 100%"
        @update:database-name="$emit('update:source-database-name', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MoveLeftIcon } from "lucide-vue-next";
import { NRadio, NRadioGroup } from "naive-ui";
import { computed, toRef } from "vue";
import { DatabaseSelect } from "@/components/v2";
import { useDatabaseInGroupFilter, useDatabaseV1Store } from "@/store";
import type { ComposedDatabase, ComposedProject } from "@/types";
import type { Branch } from "@/types/proto/v1/branch_service";
import BranchSelector from "../BranchSelector.vue";
import type { RebaseSourceType } from "./types";

const props = defineProps<{
  project: ComposedProject;
  sourceType: RebaseSourceType;
  headBranch: Branch | undefined;
  sourceBranch: Branch | undefined;
  sourceDatabase: ComposedDatabase | undefined;
  parentBranchOnly: boolean | undefined;
  isLoadingSourceBranch?: boolean;
  isLoadingHeadBranch?: boolean;
}>();

defineEmits<{
  (event: "update:source-type", type: RebaseSourceType): void;
  (event: "update:head-branch-name", branch: string | undefined): void;
  (event: "update:source-branch-name", branch: string | undefined): void;
  (event: "update:source-database-name", uid: string | undefined): void;
}>();

const referencedDatabase = computed(() => {
  const name = props.headBranch?.baselineDatabase;
  if (!name) return undefined;
  return useDatabaseV1Store().getDatabaseByName(name);
});
const { isPreparingDatabaseGroups, databaseFilter } = useDatabaseInGroupFilter(
  toRef(props, "project"),
  referencedDatabase
);

const sourceBranchOrDatabase = computed(() => {
  return props.sourceType === "BRANCH"
    ? props.sourceBranch
    : props.sourceDatabase;
});

const sourceBranchFilter = (branch: Branch) => {
  const { headBranch } = props;
  if (!headBranch) {
    return true;
  }
  return branch.engine === headBranch.engine && branch.name !== headBranch.name;
};
const headBranchFilter = (branch: Branch) => {
  const source = sourceBranchOrDatabase.value;
  if (!source) {
    return true;
  }
  if (props.sourceType === "BRANCH") {
    const sourceBranch = source as Branch;
    return (
      branch.engine === sourceBranch.engine && branch.name !== sourceBranch.name
    );
  } else {
    const sourceDatabase = source as ComposedDatabase;
    return branch.engine === sourceDatabase.instanceResource.engine;
  }
};
</script>
