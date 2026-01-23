#!/usr/bin/env node

/**
 * PR Status Checker Script
 * 
 * This script helps diagnose issues with multiple pull requests
 * and provides recommendations for merging them.
 * 
 * Usage:
 *   node scripts/check-pr-merge-status.js
 * 
 * Requirements:
 *   - GitHub CLI (gh) installed and authenticated
 *   - Run from repository root
 */

import { execSync } from 'child_process';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output;
  } catch (error) {
    if (!silent) {
      log(`❌ Error executing: ${command}`, colors.red);
      log(error.message, colors.red);
    }
    return null;
  }
}

function checkGhCli() {
  log('\n📋 Checking GitHub CLI...', colors.cyan);
  const ghVersion = exec('gh --version', true);
  
  if (!ghVersion) {
    log('❌ GitHub CLI (gh) is not installed!', colors.red);
    log('\n📥 Install instructions:', colors.yellow);
    log('  macOS:   brew install gh', colors.yellow);
    log('  Windows: winget install GitHub.cli', colors.yellow);
    log('  Linux:   sudo apt install gh', colors.yellow);
    log('\n🔗 More info: https://cli.github.com/', colors.blue);
    process.exit(1);
  }
  
  log('✅ GitHub CLI is installed', colors.green);
  
  // Check authentication
  const authStatus = exec('gh auth status', true);
  if (!authStatus) {
    log('❌ GitHub CLI is not authenticated!', colors.red);
    log('\n🔐 Run: gh auth login', colors.yellow);
    process.exit(1);
  }
  
  log('✅ GitHub CLI is authenticated', colors.green);
}

function getPullRequests() {
  log('\n📊 Fetching open pull requests...', colors.cyan);
  
  const prsJson = exec(
    'gh pr list --json number,title,author,createdAt,updatedAt,state,mergeable,statusCheckRollup,reviewDecision --limit 50',
    true
  );
  
  if (!prsJson) {
    log('❌ Failed to fetch pull requests', colors.red);
    return [];
  }
  
  try {
    return JSON.parse(prsJson);
  } catch (error) {
    log('❌ Failed to parse PR data', colors.red);
    return [];
  }
}

function getStatusIcon(status) {
  const icons = {
    SUCCESS: '✅',
    FAILURE: '❌',
    PENDING: '⏳',
    EXPECTED: '⏳',
    null: '❔',
    undefined: '❔'
  };
  return icons[status] || '❔';
}

function getMergeableIcon(mergeable) {
  const icons = {
    MERGEABLE: '✅',
    CONFLICTING: '❌',
    UNKNOWN: '❔'
  };
  return icons[mergeable] || '❔';
}

function getReviewIcon(decision) {
  const icons = {
    APPROVED: '✅',
    CHANGES_REQUESTED: '❌',
    REVIEW_REQUIRED: '⏳',
    null: '❔',
    undefined: '❔'
  };
  return icons[decision] || '❔';
}

function analyzePR(pr) {
  const issues = [];
  const recommendations = [];
  
  // Check mergeable status
  if (pr.mergeable === 'CONFLICTING') {
    issues.push('Has merge conflicts');
    recommendations.push('Resolve conflicts: git merge main or use GitHub UI');
  }
  
  // Check status checks
  const checks = pr.statusCheckRollup || [];
  const failedChecks = checks.filter(c => c.conclusion === 'FAILURE');
  const pendingChecks = checks.filter(c => !c.conclusion || c.conclusion === 'PENDING');
  
  if (failedChecks.length > 0) {
    issues.push(`${failedChecks.length} check(s) failed`);
    recommendations.push('Fix failing checks before merging');
  }
  
  if (pendingChecks.length > 0) {
    issues.push(`${pendingChecks.length} check(s) pending`);
    recommendations.push('Wait for all checks to complete');
  }
  
  // Check review status
  if (pr.reviewDecision === 'CHANGES_REQUESTED') {
    issues.push('Changes requested in review');
    recommendations.push('Address review comments and request re-review');
  } else if (!pr.reviewDecision || pr.reviewDecision === 'REVIEW_REQUIRED') {
    issues.push('Needs review');
    recommendations.push('Request review from team members');
  }
  
  return { issues, recommendations };
}

function displayPRs(prs) {
  log('\n═══════════════════════════════════════════════════════════', colors.bright);
  log('                    📊 PR STATUS REPORT                     ', colors.bright);
  log('═══════════════════════════════════════════════════════════\n', colors.bright);
  
  if (prs.length === 0) {
    log('✅ No open pull requests!', colors.green);
    return;
  }
  
  log(`Found ${prs.length} open pull request(s)\n`, colors.cyan);
  
  const readyToMerge = [];
  const needsWork = [];
  
  prs.forEach((pr, index) => {
    const { issues, recommendations } = analyzePR(pr);
    
    log(`─────────────────────────────────────────────────────────────`, colors.cyan);
    log(`PR #${pr.number}: ${pr.title}`, colors.bright);
    log(`Author: ${pr.author.login} | Updated: ${new Date(pr.updatedAt).toLocaleDateString()}`, colors.reset);
    
    // Status checks
    const checks = pr.statusCheckRollup || [];
    const allPassed = checks.every(c => c.conclusion === 'SUCCESS');
    const checkStatus = checks.length === 0 ? '❔ No checks' : 
                       allPassed ? '✅ All passed' : 
                       `${getStatusIcon('FAILURE')} Some failed`;
    log(`\nChecks: ${checkStatus}`, colors.reset);
    
    // Mergeable status
    log(`Mergeable: ${getMergeableIcon(pr.mergeable)} ${pr.mergeable || 'UNKNOWN'}`, colors.reset);
    
    // Review status
    log(`Review: ${getReviewIcon(pr.reviewDecision)} ${pr.reviewDecision || 'PENDING'}`, colors.reset);
    
    // Issues and recommendations
    if (issues.length > 0) {
      log('\n⚠️  Issues:', colors.yellow);
      issues.forEach(issue => log(`   • ${issue}`, colors.yellow));
      needsWork.push({ pr, issues, recommendations });
    }
    
    if (recommendations.length > 0) {
      log('\n💡 Recommendations:', colors.cyan);
      recommendations.forEach(rec => log(`   • ${rec}`, colors.cyan));
    }
    
    if (issues.length === 0) {
      log('\n✅ Ready to merge!', colors.green);
      readyToMerge.push(pr);
    }
    
    log(''); // Empty line
  });
  
  // Summary
  log('═══════════════════════════════════════════════════════════', colors.bright);
  log('                        📈 SUMMARY                          ', colors.bright);
  log('═══════════════════════════════════════════════════════════\n', colors.bright);
  
  log(`Total PRs: ${prs.length}`, colors.cyan);
  log(`Ready to merge: ${readyToMerge.length}`, colors.green);
  log(`Need work: ${needsWork.length}`, colors.yellow);
  
  // Merge strategy recommendation
  if (readyToMerge.length > 0) {
    log('\n🎯 Recommended Merge Order:', colors.green);
    readyToMerge.forEach((pr, index) => {
      log(`   ${index + 1}. PR #${pr.number} - ${pr.title}`, colors.green);
    });
    log('\n💡 Tip: Merge one at a time, then update other PRs', colors.cyan);
  }
  
  if (needsWork.length > 0) {
    log('\n⚠️  PRs Needing Work:', colors.yellow);
    needsWork.forEach(({ pr, issues }) => {
      log(`   • PR #${pr.number}: ${issues.join(', ')}`, colors.yellow);
    });
  }
  
  log('\n═══════════════════════════════════════════════════════════\n', colors.bright);
}

function displayHelp() {
  log('\n📚 Additional Commands:', colors.cyan);
  log('\nView PR details:', colors.bright);
  log('  gh pr view <PR_NUMBER>', colors.reset);
  log('\nView PR checks:', colors.bright);
  log('  gh pr checks <PR_NUMBER>', colors.reset);
  log('\nMerge PR:', colors.bright);
  log('  gh pr merge <PR_NUMBER>', colors.reset);
  log('\nUpdate local branch:', colors.bright);
  log('  git checkout <BRANCH>', colors.reset);
  log('  git pull origin main', colors.reset);
  log('  git push --force-with-lease', colors.reset);
  log('\n📖 Full guide: docs/MERGE_MULTIPLE_PRS_GUIDE.md', colors.blue);
  log('📖 دليل عربي: docs/MERGE_MULTIPLE_PRS_GUIDE_AR.md\n', colors.blue);
}

function main() {
  log('═══════════════════════════════════════════════════════════', colors.bright);
  log('           🔍 TEC Ecosystem PR Merge Status Checker         ', colors.bright);
  log('═══════════════════════════════════════════════════════════', colors.bright);
  
  // Check prerequisites
  checkGhCli();
  
  // Get and display PRs
  const prs = getPullRequests();
  displayPRs(prs);
  
  // Show help
  displayHelp();
  
  log('✅ Check complete!\n', colors.green);
}

// Run the script
try {
  main();
} catch (error) {
  log(`\n❌ Error: ${error.message}`, colors.red);
  process.exit(1);
}

