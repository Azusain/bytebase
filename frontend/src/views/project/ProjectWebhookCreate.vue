<template>
  <div class="space-y-4 divide-y divide-block-border">
    <div class="text-xl leading-6 font-medium text-main">
      {{ $t("project.webhook.creation.title") }}
    </div>
    <ProjectWebhookForm
      class="pt-4"
      :create="true"
      :project="project"
      :webhook="defaultNewWebhook"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import ProjectWebhookForm from "@/components/ProjectWebhookForm.vue";
import { useProjectByName } from "@/store";
import { projectNamePrefix } from "@/store/modules/v1/common";
import { emptyProjectWebhook } from "@/types";

const props = defineProps<{
  projectId: string;
}>();

const { project } = useProjectByName(
  computed(() => `${projectNamePrefix}${props.projectId}`)
);

const defaultNewWebhook = emptyProjectWebhook();
</script>
