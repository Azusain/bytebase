<template>
  <div class="w-full relative">
    <NTransfer
      v-model:value="selectedValueList"
      style="height: 512px"
      :options="sourceTransferOptions"
      :render-source-list="renderSourceList"
      :render-target-list="renderTargetList"
      :source-filterable="true"
      :source-filter-placeholder="$t('common.filter-by-name')"
    />
    <div
      v-if="loading"
      class="z-1 absolute inset-0 bg-white bg-opacity-80 flex flex-row justify-center items-center"
    >
      <BBSpin size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderBy } from "lodash-es";
import type { TransferRenderSourceList, TreeOption } from "naive-ui";
import { NTransfer, NTree } from "naive-ui";
import { computed, h, onMounted, ref, watch } from "vue";
import { BBSpin } from "@/bbkit";
import {
  useDatabaseV1Store,
  useDBSchemaV1Store,
  useProjectByName,
} from "@/store";
import { useDatabaseV1List } from "@/store/modules/v1/databaseList";
import type { DatabaseResource } from "@/types";
import { DatabaseMetadataView } from "@/types/proto/v1/database_service";
import { wrapRefAsPromise } from "@/utils";
import Label from "./Label.vue";
import type { DatabaseTreeOption } from "./common";
import {
  flattenTreeOptions,
  getSchemaOrTableTreeOptions,
  mapTreeOptions,
} from "./common";

const props = defineProps<{
  projectName: string;
  databaseResources: DatabaseResource[];
}>();

const emit = defineEmits<{
  (e: "update", databaseResourceList: DatabaseResource[]): void;
}>();

const databaseStore = useDatabaseV1Store();
const dbSchemaStore = useDBSchemaV1Store();
const { project } = useProjectByName(props.projectName);
const selectedValueList = ref<string[]>(
  props.databaseResources.map((databaseResource) => {
    if (databaseResource.table !== undefined) {
      return `${databaseResource.databaseName}/schemas/${databaseResource.schema}/tables/${databaseResource.table}`;
    } else if (databaseResource.schema !== undefined) {
      return `${databaseResource.databaseName}/schemas/${databaseResource.schema}`;
    } else {
      return databaseResource.databaseName;
    }
  })
);
const defaultExpandedKeys = ref<string[]>([]);
const loading = ref(true);

onMounted(async () => {
  await wrapRefAsPromise(useDatabaseV1List(props.projectName).ready, true);

  await Promise.all(
    selectedValueList.value.map(async (key) => {
      const [databaseName] = key.split("/schemas/");
      await dbSchemaStore.getOrFetchDatabaseMetadata({
        database: databaseName,
        view: DatabaseMetadataView.DATABASE_METADATA_VIEW_BASIC,
      });
    })
  );
  defaultExpandedKeys.value = selectedValueList.value
    .map((key) => {
      if (key.includes("/tables/")) {
        const schemaName = key.split("/tables/")[0];
        const databaseName = schemaName.split("/schemas/")[0];
        return [databaseName, schemaName];
      } else if (key.includes("/schemas/")) {
        const databaseName = key.split("/schemas/")[0];
        return [databaseName];
      } else {
        return [];
      }
    })
    .flat();
  loading.value = false;
});

const databaseList = computed(() => {
  const list = orderBy(
    databaseStore.databaseListByProject(project.value.name),
    [
      (db) => db.effectiveEnvironmentEntity.order,
      (db) => db.effectiveEnvironmentEntity.title,
      (db) => db.databaseName,
      (db) => db.instanceResource.title,
    ],
    ["desc", "asc", "asc", "asc"]
  );
  return list;
});

const sourceTreeOptions = computed(() => {
  return mapTreeOptions(databaseList.value);
});

const sourceTransferOptions = computed(() => {
  const options = flattenTreeOptions(sourceTreeOptions.value);
  return options;
});

const renderSourceList: TransferRenderSourceList = ({ onCheck, pattern }) => {
  return h(NTree, {
    keyField: "value",
    checkable: true,
    selectable: false,
    checkOnClick: true,
    data: sourceTreeOptions.value,
    blockLine: true,
    virtualScroll: true,
    style: "height: 428px", // since <NTransfer> height is 512
    renderLabel: ({ option }: { option: TreeOption }) => {
      return h(Label, {
        option: option as DatabaseTreeOption,
        keyword: pattern,
      });
    },
    pattern,
    showIrrelevantNodes: false,
    defaultExpandedKeys: defaultExpandedKeys.value,
    checkedKeys: selectedValueList.value,
    onLoad: async (node: TreeOption) => {
      const treeNode = node as DatabaseTreeOption;
      if (treeNode.level === "database") {
        await dbSchemaStore.getOrFetchDatabaseMetadata({
          database: treeNode.value,
          view: DatabaseMetadataView.DATABASE_METADATA_VIEW_BASIC,
        });
        const database = databaseStore.getDatabaseByName(treeNode.value);
        const children = getSchemaOrTableTreeOptions(database);
        if (children && children.length > 0) {
          treeNode.children = children;
          treeNode.isLeaf = false;
        } else {
          treeNode.isLeaf = true;
        }
      }
    },
    onUpdateCheckedKeys: (checkedKeys: string[]) => {
      onCheck(checkedKeys);
    },
  });
};

const targetTreeOptions = computed(() => {
  if (selectedValueList.value.length === 0) {
    return [];
  }
  const nodes = mapTreeOptions(databaseList.value, selectedValueList.value);
  for (const databaseNode of nodes) {
    if (!databaseNode.children || databaseNode.children.length === 0) {
      databaseNode.isLeaf = true;
      continue;
    } else {
      for (const childNode of databaseNode.children) {
        if (!childNode.children || childNode.children.length === 0) {
          childNode.isLeaf = true;
        }
      }
    }
  }
  return nodes;
});

const renderTargetList: TransferRenderSourceList = ({ onCheck }) => {
  return h(NTree, {
    keyField: "value",
    checkable: true,
    selectable: false,
    checkOnClick: true,
    defaultExpandAll: true,
    data: targetTreeOptions.value,
    blockLine: true,
    virtualScroll: true,
    style: "height: 468px", // since <NTransfer> height is 512
    renderLabel: ({ option }: { option: TreeOption }) => {
      return h(Label, {
        option: option as DatabaseTreeOption,
      });
    },
    showIrrelevantNodes: false,
    checkedKeys: selectedValueList.value,
    onUpdateCheckedKeys: (checkedKeys: string[]) => {
      onCheck(checkedKeys);
    },
  });
};

watch(selectedValueList, () => {
  emit(
    "update",
    selectedValueList.value.map((key) => {
      const [databaseName, schemaAndTable] = key.split("/schemas/");
      const databaseResource: DatabaseResource = {
        databaseName,
      };
      if (schemaAndTable) {
        const [schema, table] = schemaAndTable.split("/tables/");
        if (table) {
          databaseResource.schema = schema;
          databaseResource.table = table;
        } else {
          databaseResource.schema = schema;
        }
      }
      return databaseResource;
    })
  );
});
</script>
