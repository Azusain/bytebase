<template>
  <NTooltip :disabled="errors.length === 0" placement="top">
    <template #trigger>
      <NButton
        size="medium"
        tag="div"
        :disabled="errors.length > 0"
        v-bind="issueReviewActionButtonProps(action)"
        @click="$emit('perform-action', action)"
      >
        {{ issueReviewActionDisplayName(action) }}
      </NButton>
    </template>
    <template #default>
      <ErrorList :errors="errors" />
    </template>
  </NTooltip>
</template>

<script setup lang="ts">
import { NButton, NTooltip } from "naive-ui";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { IssueReviewAction } from "@/components/IssueV1/logic";
import {
  issueReviewActionDisplayName,
  issueReviewActionButtonProps,
  allowUserToApplyReviewAction,
  useIssueContext,
  displayReviewRoleTitle,
} from "@/components/IssueV1/logic";
import type { ErrorItem } from "@/components/misc/ErrorList.vue";
import ErrorList from "@/components/misc/ErrorList.vue";

const props = defineProps<{
  action: IssueReviewAction;
}>();

defineEmits<{
  (event: "perform-action", action: IssueReviewAction): void;
}>();

const { t } = useI18n();
const { issue, reviewContext } = useIssueContext();

const errors = computed(() => {
  const errors: ErrorItem[] = [];

  if (!allowUserToApplyReviewAction(issue.value, reviewContext, props.action)) {
    errors.push(t("issue.error.you-are-not-allowed-to-perform-this-action"));
    const flow = reviewContext.flow.value;
    const index = flow.currentStepIndex;
    const steps = flow.template.flow?.steps ?? [];
    const step = steps[index];
    if (step) {
      for (let i = 0; i < step.nodes.length; i++) {
        const node = step.nodes[i];
        const roleTitle = displayReviewRoleTitle(node);
        if (node) {
          errors.push({
            error: roleTitle,
            indent: 1,
          });
        }
      }
    }
  }
  return errors;
});
</script>
