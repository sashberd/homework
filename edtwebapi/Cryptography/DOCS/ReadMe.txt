In order to import keys run:
aspnet_regiis -pi "EDTRSAContainer" "c:\keys.xml" 

If the key should be exportable it should imported as:
aspnet_regiis -pi "EDTRSAContainer" "c:\keys.xml" -exp

In order to grant authority to access EDTRSAContainer for NT AUTHORITY\NETWORK SERVICE run:
aspnet_regiis -pa "EDTRSAContainer" "NT AUTHORITY\NETWORK SERVICE"

To delete container run:
aspnet_regiis -pz "EDTRSAContainer"