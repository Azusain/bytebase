<template>
  <component
    :is="showLink ? 'router-link' : tag"
    v-bind="bindings"
    class="inline-flex items-center gap-x-1"
    :class="[
      showLink && !plain && 'normal-link',
      showLink && 'hover:underline',
    ]"
  >
    <InstanceV1EngineIcon
      v-if="icon && iconPosition === 'prefix'"
      :instance="instance"
    />

    <slot name="prefix" />

    <NEllipsis :disabled="!tooltip" :line-clamp="1" :class="textClass">
      {{ instanceV1Name(instance) }}
    </NEllipsis>

    <InstanceV1EngineIcon
      v-if="icon && iconPosition === 'suffix'"
      :instance="instance"
    />
  </component>
</template>

<script lang="ts" setup>
import { NEllipsis } from "naive-ui";
import { computed } from "vue";
import type {
  Instance,
  InstanceResource,
} from "@/types/proto/v1/instance_service";
import { hasWorkspacePermissionV2, instanceV1Name } from "@/utils";
import InstanceV1EngineIcon from "./InstanceV1EngineIcon.vue";

const props = withDefaults(
  defineProps<{
    instance: Instance | InstanceResource;
    tag?: string;
    link?: boolean;
    icon?: boolean;
    plain?: boolean;
    tooltip?: boolean;
    iconPosition?: "prefix" | "suffix";
    textClass?: string;
  }>(),
  {
    tag: "span",
    link: true,
    icon: true,
    plain: false,
    tooltip: true,
    iconPosition: "prefix",
    textClass: "",
  }
);

const bindings = computed(() => {
  if (props.link) {
    return {
      to: `/${props.instance.name}`,
      activeClass: "",
      exactActiveClass: "",
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
      },
    };
  }
  return {};
});

// Only show the link if the user has permission to view the instance.
const showLink = computed(
  () => props.link && hasWorkspacePermissionV2("bb.instances.get")
);
</script>
