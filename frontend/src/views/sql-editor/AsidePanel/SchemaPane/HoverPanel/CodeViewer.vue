<template>
  <div class="w-[32rem] h-[20rem] flex flex-col gap-y-2">
    <div class="flex flex-row content-justify items-center gap-x-2">
      <div class="textlabel flex-1 truncate">
        {{ name }}
      </div>
      <div class="flex flex-row justify-end items-center">
        <NCheckbox v-if="!formatted.error" v-model:checked="format">
          {{ $t("sql-editor.format") }}
        </NCheckbox>
      </div>
    </div>
    <div class="w-full flex-1 relative">
      <MonacoEditor
        :content="format ? formatted.data : code"
        :readonly="true"
        class="border w-full h-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computedAsync, useLocalStorage } from "@vueuse/core";
import { NCheckbox } from "naive-ui";
import { computed } from "vue";
import { MonacoEditor } from "@/components/MonacoEditor";
import formatSQL from "@/components/MonacoEditor/sqlFormatter";
import type { ComposedDatabase } from "@/types";
import { dialectOfEngineV1 } from "@/types";
import type {
  DatabaseMetadata,
  SchemaMetadata,
} from "@/types/proto/v1/database_service";
import { hasSchemaProperty } from "@/utils";

const props = defineProps<{
  db: ComposedDatabase;
  database: DatabaseMetadata;
  schema: SchemaMetadata;
  name: string;
  code: string;
}>();
const format = useLocalStorage<boolean>(
  "bb.sql-editor.schema-hover-panel.code-viewer.format",
  false
);
const instanceEngine = computed(() => props.db.instanceResource.engine);

const name = computed(() => {
  const { schema, name } = props;
  if (hasSchemaProperty(instanceEngine.value)) {
    return `${schema.name}.${name}`;
  }
  return name;
});

const formatted = computedAsync(
  async () => {
    const sql = props.code;
    try {
      const result = await formatSQL(
        sql,
        dialectOfEngineV1(instanceEngine.value)
      );
      return result;
    } catch (err) {
      return {
        error: err,
        data: sql,
      };
    }
  },
  {
    error: null,
    data: props.code,
  }
);
</script>
