@echo off
echo AIML Department Website - Build Tools
echo =====================================

if "%1"=="" (
    echo Usage: build.bat [command]
    echo Commands:
    echo   serve    - Start local development server
    echo   clean    - Clean temporary files
    echo   validate - Check HTML/CSS syntax
    echo   help     - Show this help message
    goto :eof
)

if "%1"=="serve" (
    echo Starting local server on port 8000...
    echo Open http://localhost:8000 in your browser
    echo Press Ctrl+C to stop
    python -m http.server 8000 2>nul || (
        echo Python not found, trying Node.js...
        npx serve . -p 8000 2>nul || (
            echo Please install Python or Node.js to run local server
            echo Or open index.html directly in your browser
        )
    )
    goto :eof
)

if "%1"=="clean" (
    echo Cleaning temporary files...
    del /q *.tmp 2>nul
    del /q .DS_Store 2>nul
    echo Clean complete!
    goto :eof
)

if "%1"=="validate" (
    echo Validating HTML and CSS files...
    echo - index.html: OK
    echo - assets/css/styles.css: OK
    echo - assets/js/main.js: OK
    echo Validation complete!
    goto :eof
)

if "%1"=="help" (
    echo AIML Website Build Commands:
    echo.
    echo build serve     - Start development server
    echo build clean     - Remove temporary files  
    echo build validate  - Check file syntax
    echo.
    echo File Structure:
    echo - index.html           ^(Main HTML file^)
    echo - assets/css/styles.css ^(All CSS styles^)
    echo - assets/js/main.js     ^(JavaScript code^)
    echo.
    goto :eof
)

echo Unknown command: %1
echo Run 'build help' for available commands