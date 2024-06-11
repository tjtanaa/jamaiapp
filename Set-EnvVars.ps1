# Path to the .env file
$envFilePath = ".\.env"

# Read the .env file
if (Test-Path $envFilePath) {
    $envFileContent = Get-Content $envFilePath

    foreach ($line in $envFileContent) {
        # Skip empty lines and comments
        if ($line -match '^\s*$' -or $line -match '^\s*#') {
            continue
        }

        # Split the line into key and value
        $parts = $line -split '=', 2
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()

            # Replace placeholders with actual values if needed
            $value = $value -replace '\$\{(\w+)\}', {
                param($matches)
                $envVarName = $matches[1]
                if (Test-Path "Env:\$envVarName") {
                    return (Get-Item "Env:\$envVarName").Value
                } else {
                    return ""
                }
            }

            # Set the environment variable
            [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
        }
    }
} else {
    Write-Error "The .env file was not found at path: $envFilePath"
}