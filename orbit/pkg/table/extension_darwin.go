//go:build darwin

package table

import (
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/authdb"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/csrutil_info"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/diskutil/apfs"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/diskutil/corestorage"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/dscl"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/firmware_eficheck_integrity_check"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/nvram_info"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/pmset"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/privaterelay"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/pwd_policy"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/software_update"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/sudo_info"
	"github.com/fleetdm/fleet/v4/orbit/pkg/table/user_login_settings"
	"github.com/macadmins/osquery-extension/tables/filevaultusers"
	"github.com/macadmins/osquery-extension/tables/macos_profiles"
	"github.com/macadmins/osquery-extension/tables/mdm"
	"github.com/macadmins/osquery-extension/tables/munki"
	"github.com/macadmins/osquery-extension/tables/unifiedlog"
	"github.com/osquery/osquery-go"
	"github.com/osquery/osquery-go/plugin/table"
)

func platformTables() []osquery.OsqueryPlugin {
	return []osquery.OsqueryPlugin{
		// Fleet tables
		table.NewPlugin("icloud_private_relay", privaterelay.Columns(), privaterelay.Generate),
		table.NewPlugin("user_login_settings", user_login_settings.Columns(), user_login_settings.Generate),
		table.NewPlugin("pwd_policy", pwd_policy.Columns(), pwd_policy.Generate),
		table.NewPlugin("csrutil_info", csrutil_info.Columns(), csrutil_info.Generate),
		table.NewPlugin("nvram_info", nvram_info.Columns(), nvram_info.Generate),
		table.NewPlugin("authdb", authdb.Columns(), authdb.Generate),
		table.NewPlugin("pmset", pmset.Columns(), pmset.Generate),
		table.NewPlugin("sudo_info", sudo_info.Columns(), sudo_info.Generate),
		table.NewPlugin("software_update", software_update.Columns(), software_update.Generate),
		table.NewPlugin("firmware_eficheck_integrity_check", firmware_eficheck_integrity_check.Columns(), firmware_eficheck_integrity_check.Generate),
		table.NewPlugin("dscl", dscl.Columns(), dscl.Generate),
		table.NewPlugin("apfs_volumes", apfs.VolumesColumns(), apfs.VolumesGenerate),
		table.NewPlugin("apfs_physical_stores", apfs.PhysicalStoresColumns(), apfs.PhysicalStoresGenerate),
		table.NewPlugin("corestorage_logical_volumes", corestorage.LogicalVolumesColumns(), corestorage.LogicalVolumesGenerate),
		table.NewPlugin("corestorage_logical_volume_families", corestorage.LogicalVolumeFamiliesColumns(), corestorage.LogicalVolumeFamiliesGenerate),

		// Macadmins extension tables
		table.NewPlugin("filevault_users", filevaultusers.FileVaultUsersColumns(), filevaultusers.FileVaultUsersGenerate),
		table.NewPlugin("macos_profiles", macos_profiles.MacOSProfilesColumns(), macos_profiles.MacOSProfilesGenerate),
		table.NewPlugin("mdm", mdm.MDMInfoColumns(), mdm.MDMInfoGenerate),
		table.NewPlugin("munki_info", munki.MunkiInfoColumns(), munki.MunkiInfoGenerate),
		table.NewPlugin("munki_installs", munki.MunkiInstallsColumns(), munki.MunkiInstallsGenerate),
		// osquery version 5.5.0 and up ships a unified_log table in core
		// we are renaming the one from the macadmins extension to avoid collision
		table.NewPlugin("macadmins_unified_log", unifiedlog.UnifiedLogColumns(), unifiedlog.UnifiedLogGenerate),
	}
}
