#!/bin/bash

# Validation script for Todo Frontend Application

echo "Validating Todo Frontend Application..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    exit 1
fi

echo "✅ package.json found"

# Check if node_modules exists (dependencies installed)
if [ ! -d "node_modules" ]; then
    echo "⚠️ Warning: node_modules not found. Dependencies may not be installed."
else
    echo "✅ Dependencies appear to be installed"
fi

# Check for critical files
critical_files=(
    "app/layout.tsx"
    "app/page.tsx"
    "app/login/page.tsx"
    "app/signup/page.tsx"
    "app/dashboard/page.tsx"
    "lib/auth/useAuth.tsx"
    "lib/api/api-client.ts"
    "components/todos/TodoForm.tsx"
    "components/todos/TodoList.tsx"
    "components/todos/TodoItem.tsx"
)

missing_files=()
for file in "${critical_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All critical files present"
else
    echo "❌ Missing critical files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

# Check for environment configuration
if [ -f ".env.example" ]; then
    echo "✅ Environment configuration file found"
else
    echo "⚠️ Warning: .env.example not found"
fi

echo ""
echo "🎉 Validation completed successfully!"
echo ""
echo "To run the application:"
echo "1. Install dependencies: npm install"
echo "2. Run development server: npm run dev"
echo "3. Or build for production: npm run build"