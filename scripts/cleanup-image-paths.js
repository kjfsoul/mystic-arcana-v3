#!/usr/bin/env node

/**
 * Image Path Cleanup Script
 * 
 * This script scans the project for tarot image path references,
 * checks if they match the allowed structure, and reports any issues.
 * 
 * Usage:
 *   node scripts/cleanup-image-paths.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Config
const ALLOWED_BASE_PATH = '/images/tarot/decks/rider-waite';
const validPaths = [
  /\/images\/tarot\/decks\/rider-waite\/major\/[\w-]+\.(png|jpg|webp)/i,
  /\/images\/tarot\/decks\/rider-waite\/minor\/(cups|wands|pentacles|swords)\/[\w-]+\.(png|jpg|webp)/i
];

const excludeDirs = [
  'node_modules',
  'dist',
  'build',
  '.git'
];

// Valid extensions to scan
const validExtensions = [
  '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.md'
];

// Function to check if path is valid
function isPathValid(path) {
  if (!path || typeof path !== 'string') return false;
  
  // Must start with allowed base path
  if (!path.startsWith(ALLOWED_BASE_PATH)) return false;
  
  // Must match one of our valid path patterns
  return validPaths.some(pattern => pattern.test(path));
}

// Function to extract paths from content
function extractImagePaths(content) {
  const results = [];
  
  // Find "/images/tarot" paths
  const regex = /["'`]?(\/images\/tarot[^"'`\s)]+)["'`\s)]/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      results.push(match[1]);
    }
  }
  
  return results;
}

// Function to recursively scan directories
async function scanDir(dirPath) {
  try {
    const files = await readdir(dirPath);
    const issues = [];
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        // Skip excluded directories
        if (!excludeDirs.includes(file)) {
          const subIssues = await scanDir(filePath);
          issues.push(...subIssues);
        }
      } else if (stats.isFile()) {
        // Check if file has valid extension
        const ext = path.extname(file).toLowerCase();
        if (validExtensions.includes(ext)) {
          try {
            const content = await readFile(filePath, 'utf8');
            const imagePaths = extractImagePaths(content);
            
            for (const imagePath of imagePaths) {
              if (!isPathValid(imagePath)) {
                issues.push({
                  file: filePath,
                  path: imagePath,
                  valid: false
                });
              }
            }
          } catch (readError) {
            console.error(`Error reading file ${filePath}:`, readError);
          }
        }
      }
    }
    
    return issues;
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    return [];
  }
}

// Main function
async function main() {
  console.log('Scanning project for tarot image paths...');
  console.log('Allowed paths:');
  console.log(`  - ${ALLOWED_BASE_PATH}/major/[card-name].(png|jpg|webp)`);
  console.log(`  - ${ALLOWED_BASE_PATH}/minor/(cups|wands|pentacles|swords)/[card-name].(png|jpg|webp)`);
  console.log('---------------------------------------------------');
  
  const startDir = process.cwd();
  const issues = await scanDir(startDir);
  
  console.log('---------------------------------------------------');
  
  if (issues.length === 0) {
    console.log('No invalid tarot image paths found. All paths follow the correct structure.');
  } else {
    console.log(`Found ${issues.length} invalid tarot image paths:`);
    console.log('---------------------------------------------------');
    
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. File: ${path.relative(startDir, issue.file)}`);
      console.log(`   Path: ${issue.path}`);
      console.log('');
    });
    
    console.log('---------------------------------------------------');
    console.log('RECOMMENDATION:');
    console.log('Update these paths to use the following structure:');
    console.log(`  - For major arcana: ${ALLOWED_BASE_PATH}/major/[card-name].png`);
    console.log(`  - For minor arcana: ${ALLOWED_BASE_PATH}/minor/[suit]/[card-name].png`);
    console.log('---------------------------------------------------');
  }
}

main().catch(error => {
  console.error('Error running script:', error);
  process.exit(1);
});