<template>
  <div v-if="ruleMapByEngine.size > 0">
    <div class="flex justify-end">
      <NButton type="primary" @click="showRuleSelectPanel = true">
        {{ $t("sql-review.add-or-remove-rules") }}
      </NButton>
    </div>
    <SQLReviewTabsByEngine :rule-map-by-engine="ruleMapByEngine">
      <template
        #default="{
          ruleList: ruleListFilteredByEngine,
          engine,
        }: {
          ruleList: RuleTemplateV2[];
          engine: Engine;
        }"
      >
        <SQLRuleTableWithFilter
          :engine="engine"
          :rule-list="ruleListFilteredByEngine"
          :editable="true"
          @rule-upsert="onRuleChange"
        />
      </template>
    </SQLReviewTabsByEngine>
  </div>
  <NoDataPlaceholder v-else>
    <NButton type="primary" @click="showRuleSelectPanel = true">
      {{ $t("sql-review.add-rules") }}
    </NButton>
  </NoDataPlaceholder>

  <SQLReviewRulesSelectPanel
    :show="showRuleSelectPanel"
    :selected-rule-map="ruleMapByEngine"
    @close="showRuleSelectPanel = false"
    @rule-select="$emit('rule-upsert', $event, {})"
    @rule-remove="$emit('rule-remove', $event)"
  />
</template>

<script lang="ts" setup>
import { NButton } from "naive-ui";
import { ref } from "vue";
import type { Engine } from "@/types/proto/v1/common";
import type { RuleTemplateV2 } from "@/types/sqlReview";
import NoDataPlaceholder from "../misc/NoDataPlaceholder.vue";
import SQLReviewRulesSelectPanel from "./components/SQLReviewRulesSelectPanel.vue";
import SQLReviewTabsByEngine from "./components/SQLReviewTabsByEngine.vue";
import SQLRuleTableWithFilter from "./components/SQLRuleTableWithFilter.vue";

defineProps<{
  ruleMapByEngine: Map<Engine, Map<string, RuleTemplateV2>>;
}>();

const emit = defineEmits<{
  (
    event: "rule-upsert",
    rule: RuleTemplateV2,
    update: Partial<RuleTemplateV2>
  ): void;
  (event: "rule-remove", rule: RuleTemplateV2): void;
}>();

const onRuleChange = (
  rule: RuleTemplateV2,
  overrides: Partial<RuleTemplateV2>
) => {
  emit("rule-upsert", rule, overrides);
};

const showRuleSelectPanel = ref<boolean>(false);
</script>
