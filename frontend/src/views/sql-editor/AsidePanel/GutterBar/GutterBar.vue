<template>
  <div
    ref="containerRef"
    class="h-full flex flex-col items-stretch justify-between overflow-hidden text-sm p-1"
  >
    <div class="flex flex-col gap-y-1">
      <TabItem
        tab="WORKSHEET"
        :size="size"
        @click="handleClickTab('WORKSHEET')"
      />
      <TabItem tab="SCHEMA" :size="size" @click="handleClickTab('SCHEMA')" />
      <TabItem tab="HISTORY" :size="size" @click="handleClickTab('HISTORY')" />
    </div>

    <div class="flex flex-col justify-end items-center">
      <OpenAIButton :size="size" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSQLEditorContext, type AsidePanelTab } from "../../context";
import OpenAIButton from "./OpenAIButton.vue";
import TabItem from "./TabItem.vue";
import { type Size } from "./common";

withDefaults(
  defineProps<{
    size?: Size;
  }>(),
  {
    size: "medium",
  }
);

const { asidePanelTab } = useSQLEditorContext();

const handleClickTab = (target: AsidePanelTab) => {
  asidePanelTab.value = target;
};
</script>
