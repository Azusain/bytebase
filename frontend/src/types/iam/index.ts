import type { ProjectPermission, WorkspacePermission } from "./permission";
import PERMISSION_DATA from "../../../../backend/component/iam/permission.yaml";

export const WORKSPACE_PERMISSIONS: WorkspacePermission[] =
  PERMISSION_DATA.permissions.workspacePermissions;

export const PROJECT_PERMISSIONS: ProjectPermission[] =
  PERMISSION_DATA.permissions.projectPermissions;

export * from "./permission";

export * from "./role";
