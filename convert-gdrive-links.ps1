# Google Drive Link Converter for Images
# Converts Google Drive sharing links to direct image URLs for HTML

param(
    [Parameter(Position=0)]
    [string]$SharingLink
)

function Convert-GoogleDriveLink {
    param([string]$Link)
    
    if ($Link -match "drive\.google\.com/file/d/([a-zA-Z0-9_-]+)") {
        $fileId = $matches[1]
        $directUrl = "https://drive.google.com/uc?export=view&id=$fileId"
        return $directUrl
    } else {
        return $null
    }
}

function Show-Help {
    Write-Host "Google Drive Link Converter for AIML Website" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This tool converts Google Drive sharing links to direct image URLs" -ForegroundColor White
    Write-Host "that work in HTML <img> tags." -ForegroundColor White
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host '  .\convert-gdrive-links.ps1 "https://drive.google.com/file/d/FILE_ID/view?usp=sharing"' -ForegroundColor Green
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Yellow
    Write-Host '  Input:  https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing' -ForegroundColor Gray
    Write-Host '  Output: https://drive.google.com/uc?export=view&id=1ABC123XYZ' -ForegroundColor Gray
    Write-Host ""
    Write-Host "How to use Google Drive images:" -ForegroundColor Yellow
    Write-Host "1. Upload image to Google Drive" -ForegroundColor White
    Write-Host "2. Right-click → Share → Anyone with the link" -ForegroundColor White  
    Write-Host "3. Copy the sharing link" -ForegroundColor White
    Write-Host "4. Run this script to convert it" -ForegroundColor White
    Write-Host "5. Use the converted URL in your HTML" -ForegroundColor White
}

if (-not $SharingLink -or $SharingLink -eq "help" -or $SharingLink -eq "--help") {
    Show-Help
    exit 0
}

$converted = Convert-GoogleDriveLink -Link $SharingLink

if ($converted) {
    Write-Host "Google Drive Link Converter" -ForegroundColor Cyan
    Write-Host "===========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Original Link:" -ForegroundColor Yellow
    Write-Host $SharingLink -ForegroundColor Gray
    Write-Host ""
    Write-Host "Converted Link (use this in HTML):" -ForegroundColor Yellow
    Write-Host $converted -ForegroundColor Green
    Write-Host ""
    Write-Host "HTML Example:" -ForegroundColor Yellow
    Write-Host '<img src="' -NoNewline -ForegroundColor Gray
    Write-Host $converted -NoNewline -ForegroundColor Green
    Write-Host '" alt="Description">' -ForegroundColor Gray
    Write-Host ""
    
    # Copy to clipboard if possible
    try {
        $converted | Set-Clipboard
        Write-Host "✓ Converted link copied to clipboard!" -ForegroundColor Green
    } catch {
        Write-Host "Note: Copy the converted link manually" -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: Invalid Google Drive link format" -ForegroundColor Red
    Write-Host "Please provide a valid Google Drive sharing link" -ForegroundColor Yellow
    Write-Host ""
    Show-Help
}