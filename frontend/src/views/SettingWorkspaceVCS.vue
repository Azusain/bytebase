<template>
  <div class="space-y-4">
    <div class="textinfolabel">
      {{ $t("gitops.setting.description") }}
      <LearnMoreLink
        url="https://www.bytebase.com/docs/vcs-integration/add-git-provider?source=console"
        class="ml-1 text-sm"
      />
    </div>
    <div v-if="vcsList.length > 0" class="flex justify-end">
      <NButton
        type="primary"
        :disabled="!hasCreateVCSPermission"
        class="capitalize"
        @click.prevent="addVCSProvider"
      >
        {{ $t("gitops.setting.add-git-provider.self") }}
      </NButton>
    </div>

    <NDataTable
      v-if="vcsList.length > 0 || loading"
      key="vcs-table"
      :data="vcsList"
      :columns="columnList"
      :striped="true"
      :bordered="true"
    />
    <VCSSetupWizard v-else :show-cancel="false" />
  </div>
</template>

<script lang="ts" setup>
import { NButton, NDataTable } from "naive-ui";
import type { DataTableColumn } from "naive-ui";
import { computed, watchEffect, h, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import LearnMoreLink from "@/components/LearnMoreLink.vue";
import VCSIcon from "@/components/VCS/VCSIcon.vue";
import VCSSetupWizard from "@/components/VCS/VCSSetupWizard.vue";
import {
  WORKSPACE_ROUTE_GITOPS_CREATE,
  WORKSPACE_ROUTE_GITOPS_DETAIL,
} from "@/router/dashboard/workspaceRoutes";
import { useVCSProviderStore } from "@/store";
import { getVCSProviderId } from "@/store/modules/v1/common";
import type { VCSProvider } from "@/types/proto/v1/vcs_provider_service";
import { hasWorkspacePermissionV2 } from "@/utils";

const vcsV1Store = useVCSProviderStore();
const router = useRouter();
const { t } = useI18n();
const loading = ref<boolean>(true);

const hasCreateVCSPermission = computed(() => {
  return hasWorkspacePermissionV2("bb.vcsProviders.create");
});

const prepareVCSList = async () => {
  await vcsV1Store.getOrFetchVCSList();
  loading.value = false;
};

watchEffect(prepareVCSList);

const vcsList = computed(() => {
  return vcsV1Store.vcsList;
});

const addVCSProvider = () => {
  router.push({
    name: WORKSPACE_ROUTE_GITOPS_CREATE,
  });
};

const columnList = computed((): DataTableColumn<VCSProvider>[] => {
  return [
    {
      key: "title",
      title: t("common.name"),
      render: (vcs) =>
        h("div", { class: "flex items-center gap-x-2" }, [
          h(VCSIcon, { type: vcs.type, customClass: "h-5" }),
          vcs.title,
        ]),
    },
    {
      key: "instance_url",
      title: `${t("common.instance")} URL`,
      render: (vcs) => vcs.url,
    },
    {
      key: "view",
      title: "",
      render: (vcs) =>
        h(
          "div",
          { class: "flex justify-end" },
          h(
            NButton,
            {
              size: "small",
              onClick: () => {
                router.push({
                  name: WORKSPACE_ROUTE_GITOPS_DETAIL,
                  params: {
                    vcsResourceId: getVCSProviderId(vcs.name),
                  },
                });
              },
            },
            t("common.view")
          )
        ),
    },
  ];
});
</script>
