#!/usr/bin/env node
/**
 * Check for Next.js routing conflicts between Pages Router and App Router
 * 
 * This script prevents the error:
 * "Conflicting app and page file was found, please remove the conflicting files to continue"
 * 
 * Next.js doesn't allow the same route to exist in both:
 * - pages/ directory (Pages Router)
 * - app/ directory (App Router)
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const PAGES_DIR = 'pages';
const APP_DIR = 'app';

// Get all route files in a directory
function getRouteFiles(dir, baseDir = dir) {
  let routes = [];
  
  if (!existsSync(dir)) {
    return routes;
  }
  
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively get routes from subdirectories
      routes = routes.concat(getRouteFiles(filePath, baseDir));
    } else if (stat.isFile()) {
      // Only include page/route files (not API routes for now)
      if (file.match(/\.(js|jsx|ts|tsx)$/) && !file.startsWith('_') && !file.startsWith('.')) {
        const relativePath = relative(baseDir, filePath);
        const routePath = convertFileToRoute(relativePath);
        routes.push({
          file: relativePath,
          route: routePath,
          fullPath: filePath
        });
      }
    }
  }
  
  return routes;
}

// Convert file path to route path
function convertFileToRoute(filePath) {
  // Remove extension
  let route = filePath.replace(/\.(js|jsx|ts|tsx)$/, '');
  
  // Handle index files
  if (route.endsWith('/index') || route === 'index') {
    route = route.replace(/\/index$|^index$/, '') || '/';
  }
  
  // Handle page.* files (App Router convention)
  if (route.endsWith('/page') || route === 'page') {
    route = route.replace(/\/page$|^page$/, '') || '/';
  }
  
  // Ensure route starts with /
  if (!route.startsWith('/')) {
    route = '/' + route;
  }
  
  return route;
}

// Main check function
function checkConflicts() {
  console.log('🔍 Checking for routing conflicts between Pages Router and App Router...\n');
  
  const pagesRoutes = getRouteFiles(PAGES_DIR);
  const appRoutes = getRouteFiles(APP_DIR);
  
  console.log(`📄 Found ${pagesRoutes.length} routes in pages/ directory`);
  console.log(`📱 Found ${appRoutes.length} routes in app/ directory\n`);
  
  // Find conflicts
  const conflicts = [];
  
  for (const pageRoute of pagesRoutes) {
    for (const appRoute of appRoutes) {
      if (pageRoute.route === appRoute.route) {
        conflicts.push({
          route: pageRoute.route,
          pageFile: pageRoute.file,
          appFile: appRoute.file
        });
      }
    }
  }
  
  if (conflicts.length > 0) {
    console.log('❌ CONFLICTS FOUND!\n');
    console.log('The following routes exist in BOTH pages/ and app/ directories:\n');
    
    for (const conflict of conflicts) {
      console.log(`  Route: ${conflict.route}`);
      console.log(`    - pages/${conflict.pageFile}`);
      console.log(`    - app/${conflict.appFile}`);
      console.log('');
    }
    
    console.log('⚠️  Next.js will fail to build with these conflicts.');
    console.log('💡 To fix: Remove one of the conflicting files for each route.\n');
    
    process.exit(1);
  } else {
    console.log('✅ No routing conflicts found!');
    console.log('✨ Your Pages Router and App Router files are compatible.\n');
    
    if (pagesRoutes.length > 0 && appRoutes.length > 0) {
      console.log('ℹ️  You are using a hybrid routing approach:');
      console.log('   - Pages Router for most routes');
      console.log('   - App Router for specific routes');
      console.log('   This is supported as long as routes don\'t conflict.\n');
    }
    
    process.exit(0);
  }
}

// Run the check
checkConflicts();
