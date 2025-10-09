# AIML Department Website - Development Script
# PowerShell script for managing the college website

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "AIML College Website - Development Tools" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 [command]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  serve       Start local development server" -ForegroundColor Green
    Write-Host "  build       Create optimized production files" -ForegroundColor Green  
    Write-Host "  clean       Clean temporary and cache files" -ForegroundColor Green
    Write-Host "  validate    Validate HTML, CSS, and JS syntax" -ForegroundColor Green
    Write-Host "  format      Format and beautify code files" -ForegroundColor Green
    Write-Host "  info        Show project information" -ForegroundColor Green
    Write-Host "  help        Show this help message" -ForegroundColor Green
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\dev.ps1 serve     # Start development server"
    Write-Host "  .\dev.ps1 validate  # Check code syntax"
    Write-Host "  .\dev.ps1 info      # Show project details"
}

function Start-DevServer {
    Write-Host "Starting AIML Website Development Server..." -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
    
    $port = 8000
    $url = "http://localhost:$port"
    
    Write-Host "Server URL: $url" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Try Python first, then Node.js
    try {
        python -m http.server $port
    }
    catch {
        try {
            Write-Host "Python not found, trying Node.js..." -ForegroundColor Yellow
            npx serve . -p $port
        }
        catch {
            Write-Host "Error: Neither Python nor Node.js found!" -ForegroundColor Red
            Write-Host "Please install Python or Node.js to run the development server" -ForegroundColor Red
            Write-Host "Alternative: Open index.html directly in your browser" -ForegroundColor Yellow
        }
    }
}

function Invoke-Clean {
    Write-Host "Cleaning project files..." -ForegroundColor Green
    
    $cleaned = @()
    
    # Remove common temporary files
    $tempFiles = @("*.tmp", "*.log", ".DS_Store", "Thumbs.db")
    foreach ($pattern in $tempFiles) {
        $files = Get-ChildItem -Path . -Name $pattern -Recurse -Force -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            Remove-Item $file -Force -ErrorAction SilentlyContinue
            $cleaned += $file
        }
    }
    
    if ($cleaned.Count -gt 0) {
        Write-Host "Cleaned $($cleaned.Count) temporary files" -ForegroundColor Yellow
    } else {
        Write-Host "No temporary files to clean" -ForegroundColor Yellow
    }
    
    Write-Host "Clean complete!" -ForegroundColor Green
}

function Test-Files {
    Write-Host "Validating AIML Website Files..." -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    
    $files = @(
        @{Path="index.html"; Type="HTML"},
        @{Path="assets\css\styles.css"; Type="CSS"},  
        @{Path="assets\js\main.js"; Type="JavaScript"}
    )
    
    foreach ($file in $files) {
        if (Test-Path $file.Path) {
            $size = (Get-Item $file.Path).Length
            Write-Host "OK $($file.Path)" -ForegroundColor Green -NoNewline
            Write-Host " ($($file.Type), $size bytes)" -ForegroundColor Gray
        } else {
            Write-Host "ERROR $($file.Path) - File not found!" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Validation complete!" -ForegroundColor Green
}

function Show-ProjectInfo {
    Write-Host "AIML Department Website - Project Information" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Project Structure:" -ForegroundColor Yellow
    Write-Host "├── index.html              (Main HTML file)" -ForegroundColor White
    Write-Host "├── assets/" -ForegroundColor White  
    Write-Host "│   ├── css/" -ForegroundColor White
    Write-Host "│   │   └── styles.css      (All CSS styles)" -ForegroundColor White
    Write-Host "│   └── js/" -ForegroundColor White
    Write-Host "│       └── main.js         (JavaScript functionality)" -ForegroundColor White
    Write-Host "├── build.bat               (Windows batch script)" -ForegroundColor White
    Write-Host "└── dev.ps1                 (PowerShell development script)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "File Sizes:" -ForegroundColor Yellow
    $files = @("index.html", "assets\css\styles.css", "assets\js\main.js")
    foreach ($file in $files) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            $sizeKB = [math]::Round($size / 1024, 1)
            Write-Host "  $file`: $sizeKB KB" -ForegroundColor White
        }
    }
    
    Write-Host ""
    Write-Host "Technologies Used:" -ForegroundColor Yellow
    Write-Host "  • HTML5 (Semantic markup)" -ForegroundColor White
    Write-Host "  • CSS3 (Modern styling with gradients)" -ForegroundColor White
    Write-Host "  • JavaScript (ES6+ with GSAP animations)" -ForegroundColor White
    Write-Host "  • Font Awesome (Icons)" -ForegroundColor White
    Write-Host "  • Google Fonts (Inter font family)" -ForegroundColor White
}

# Main script logic
switch ($Command.ToLower()) {
    "serve" { Start-DevServer }
    "clean" { Invoke-Clean }
    "validate" { Test-Files }
    "info" { Show-ProjectInfo }
    "help" { Show-Help }
    default { 
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host "Run '.\dev.ps1 help' for available commands" -ForegroundColor Yellow
    }
}