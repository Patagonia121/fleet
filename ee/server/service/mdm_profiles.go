package service

import "text/template"

type fileVaultProfileOptions struct {
	PayloadIdentifier    string
	Base64DerCertificate string
}

var fileVaultProfileTemplate = template.Must(template.New("").Option("missingkey=error").Parse(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>Defer</key>
			<true/>
			<key>Enable</key>
			<string>On</string>
			<key>PayloadDisplayName</key>
			<string>FileVault 2</string>
			<key>PayloadIdentifier</key>
			<string>com.apple.MCX.FileVault2.3548D750-6357-4910-8DEA-D80ADCE2C787</string>
			<key>PayloadType</key>
			<string>com.apple.MCX.FileVault2</string>
			<key>PayloadUUID</key>
			<string>3548D750-6357-4910-8DEA-D80ADCE2C787</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>ShowRecoveryKey</key>
			<false/>
		</dict>
		<dict>
			<key>EncryptCertPayloadUUID</key>
			<string>A326B71F-EB80-41A5-A8CD-A6F932544281</string>
			<key>Location</key>
			<string>Fleet</string>
			<key>PayloadDisplayName</key>
			<string>FileVault Recovery Key Escrow</string>
			<key>PayloadIdentifier</key>
			<string>com.apple.security.FDERecoveryKeyEscrow.3690D771-DCB8-4D5D-97D6-209A138DF03E</string>
			<key>PayloadType</key>
			<string>com.apple.security.FDERecoveryKeyEscrow</string>
			<key>PayloadUUID</key>
			<string>3C329F2B-3D47-4141-A2B5-5C52A2FD74F8</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
		</dict>
		<dict>
			<key>PayloadCertificateFileName</key>
			<string>Fleet certificate</string>
			<key>PayloadContent</key>
			<data>{{ .Base64DerCertificate }}</data>
			<key>PayloadDisplayName</key>
			<string>Certificate Root</string>
			<key>PayloadIdentifier</key>
			<string>com.apple.security.root.A326B71F-EB80-41A5-A8CD-A6F932544281</string>
			<key>PayloadType</key>
			<string>com.apple.security.pkcs1</string>
			<key>PayloadUUID</key>
			<string>A326B71F-EB80-41A5-A8CD-A6F932544281</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
		</dict>
	</array>
	<key>PayloadDisplayName</key>
	<string>Disk encryption</string>
	<key>PayloadIdentifier</key>
	<string>{{ .PayloadIdentifier }}</string>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>74FEAC88-B614-468E-A4B4-B4B0C93B5D52</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>`))
