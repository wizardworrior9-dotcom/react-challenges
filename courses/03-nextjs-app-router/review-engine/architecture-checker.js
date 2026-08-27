import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * Checks architecture patterns using AST parsing
 * Adapted for Next.js App Router patterns
 */
export async function checkArchitecture(challengeMetadata, projectDir) {
  const patternsRequired = challengeMetadata.patternsRequired || [];
  const filesToCheck = challengeMetadata.filesToCheck || [];
  
  if (patternsRequired.length === 0) {
    return {
      score: 100,
      passed: true,
      details: []
    };
  }

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  // Aggregate: a pattern "passes" if found in at least one file (project-level)
  const foundAnywhere = new Set();

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    
    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileResults = checkFileForPatterns(fileContent, patternsRequired, file);
      fileResults.patternsFound.forEach(p => foundAnywhere.add(p));
      results.details.push({
        file,
        patternsFound: fileResults.patternsFound,
        patternsMissing: fileResults.patternsMissing
      });
    } catch (error) {
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  // Score = (required patterns found in at least one file) / total required
  patternsRequired.forEach(p => {
    if (foundAnywhere.has(p)) results.patternsFound.push(p);
    else results.patternsMissing.push(p);
  });
  const requiredFoundCount = results.patternsFound.length;
  results.score = patternsRequired.length > 0
    ? Math.round((requiredFoundCount / patternsRequired.length) * 100 * 10) / 10
    : 100;
  results.passed = results.score >= 80;

  return results;
}

function checkFileForPatterns(content, patternsRequired, fileName) {
  const patternsFound = [];
  const patternsMissing = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
    });

    const foundPatterns = new Set();
    const traverseFn = (traverse && traverse.default) ? traverse.default : traverse;
    const normalizedName = fileName.replace(/\\/g, '/');

    traverseFn(ast, {
      // Check for 'use client' / 'use server' directives
      Directive(path) {
        if (path.node.value.value === 'use client') {
          foundPatterns.add('useClient');
          foundPatterns.add('clientComponent');
        }
        if (path.node.value.value === 'use server') {
          foundPatterns.add('useServer');
        }
      },

      // Check for Server Component (no 'use client') and app structure
      Program(path) {
        const hasUseClient = path.node.directives?.some(
          d => d.value.value === 'use client'
        );
        if (!hasUseClient && normalizedName.includes('page.tsx')) {
          foundPatterns.add('serverComponent');
        }
        if (normalizedName.includes('app/')) {
          foundPatterns.add('appDirectory');
        }
        if (normalizedName.includes('page.tsx')) {
          foundPatterns.add('fileBasedRouting');
        }
        if (normalizedName.includes('loading.tsx') || normalizedName.includes('loading.js')) {
          foundPatterns.add('loadingTsx');
        }
        if (normalizedName.includes('error.tsx') || normalizedName.includes('error.js')) {
          foundPatterns.add('errorTsx');
        }
        if (normalizedName.includes('not-found.tsx') || normalizedName.includes('not-found.js')) {
          foundPatterns.add('notFoundTsx');
        }
        if (normalizedName.includes('[') && normalizedName.includes(']')) {
          foundPatterns.add('dynamicSegment');
        }
        // Check for cache: no-store via regex on raw content
        if (/cache:\s*['"]no-store['"]/.test(content)) {
          foundPatterns.add('cacheNoStore');
        }
        // Check for revalidatePath and revalidateTag calls
        if (/revalidatePath\s*\(/.test(content)) {
          foundPatterns.add('revalidatePath');
        }
        if (/revalidateTag\s*\(/.test(content)) {
          foundPatterns.add('revalidateTag');
        }
        // Check for use server directive via regex (top-level string literal)
        if (/['"]\s*use server\s*['"]/.test(content)) {
          foundPatterns.add('useServer');
        }
        // Check for fetch with next.revalidate or cache option (fetchCache pattern)
        if (/next:\s*\{[^}]*revalidate|cache:\s*['"]force-cache['"]|cache:\s*['"]no-store['"]/.test(content)) {
          foundPatterns.add('fetchCache');
        }
        // Check for revalidate (export const revalidate or next:{revalidate})
        if (/revalidatePath\s*\(|revalidateTag\s*\(|next:\s*\{[^}]*revalidate|export\s+const\s+revalidate\s*=/.test(content)) {
          foundPatterns.add('revalidate');
        }
        // Check for notFound() call from next/navigation
        if (/notFound\s*\(\)/.test(content)) {
          foundPatterns.add('notFound');
        }
        // Check for generateMetadata export
        if (/export\s+(async\s+)?function\s+generateMetadata|export\s+const\s+generateMetadata/.test(content)) {
          foundPatterns.add('generateMetadata');
        }
        // Check for next/image and next/font
        if (/from\s+['"]next\/image['"]/.test(content)) {
          foundPatterns.add('nextImage');
        }
        if (/from\s+['"]next\/font(\/google|\/local)?['"]/.test(content)) {
          foundPatterns.add('nextFont');
        }
        // Check for searchParams and pagination
        if (/searchParams/.test(content)) {
          foundPatterns.add('searchParams');
        }
        if (/page|pagination|\?page=/.test(content)) {
          foundPatterns.add('pagination');
        }
        // Check for Redux Toolkit patterns
        if (/configureStore/.test(content)) {
          foundPatterns.add('configureStore');
        }
        if (/<Provider|Provider\s+store|Provider/.test(content)) {
          foundPatterns.add('Provider');
        }
        if (/useSelector/.test(content)) {
          foundPatterns.add('useSelector');
        }
        if (/useDispatch/.test(content)) {
          foundPatterns.add('useDispatch');
        }
      },

      // Check for Link, Suspense, Image, Font, Redux component imports
      ImportDeclaration(path) {
        if (path.node.source.value === 'next/link') {
          foundPatterns.add('Link');
        }
        if (path.node.source.value === 'next/navigation') {
          foundPatterns.add('navigation');
        }
        if (path.node.source.value === 'next/image') {
          foundPatterns.add('nextImage');
        }
        if (typeof path.node.source.value === 'string' && path.node.source.value.startsWith('next/font')) {
          foundPatterns.add('nextFont');
        }
        if (path.node.source.value === '@reduxjs/toolkit') {
          foundPatterns.add('configureStore');
        }
        if (path.node.source.value === 'react-redux') {
          path.node.specifiers?.forEach(spec => {
            if (spec.imported?.name === 'Provider') foundPatterns.add('Provider');
            if (spec.imported?.name === 'useSelector') foundPatterns.add('useSelector');
            if (spec.imported?.name === 'useDispatch') foundPatterns.add('useDispatch');
          });
        }
        if (path.node.source.value === 'react') {
          path.node.specifiers?.forEach(spec => {
            if (spec.imported?.name === 'Suspense') {
              foundPatterns.add('Suspense');
            }
          });
        }
      },

      Identifier(path) {
        if (path.node.name === 'params') {
          foundPatterns.add('params');
        }
        if (path.node.name === 'searchParams') {
          foundPatterns.add('searchParams');
        }
      },

      MemberExpression(path) {
        if (path.node.object?.name === 'params') {
          foundPatterns.add('params');
        }
        if (path.node.object?.name === 'searchParams') {
          foundPatterns.add('searchParams');
        }
      },

      // Check for async component (Server Component data fetching)
      FunctionDeclaration(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
          const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
          if (!hasUseClient) {
            foundPatterns.add('asyncServerComponent');
          }
        }
      },

      FunctionExpression(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
          const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
          if (!hasUseClient) {
            foundPatterns.add('asyncServerComponent');
          }
        }
      },

      ExportDefaultDeclaration(path) {
        const decl = path.node.declaration;
        if (decl && (decl.async || (decl.type === 'FunctionDeclaration' && decl.async))) {
          foundPatterns.add('asyncComponent');
          const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
          if (!hasUseClient) {
            foundPatterns.add('asyncServerComponent');
          }
        }
      },

      ArrowFunctionExpression(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
          const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
          if (!hasUseClient) {
            foundPatterns.add('asyncServerComponent');
          }
        }
      },

      AwaitExpression() {
        foundPatterns.add('await');
      },

      // Check for metadata export
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          const decl = path.node.declaration;
          if (decl.id && decl.id.name === 'metadata') {
            foundPatterns.add('metadata');
          }
          if (decl.declarations) {
            decl.declarations.forEach(d => {
              if (d.id?.name === 'metadata') foundPatterns.add('metadata');
              if (d.id?.name === 'dynamic') {
                foundPatterns.add('dynamicExport');
                if (d.init?.value === 'force-dynamic') {
                  foundPatterns.add('forceDynamic');
                  foundPatterns.add('forceStaticOrDynamic');
                }
                if (d.init?.value === 'force-static') {
                  foundPatterns.add('forceStatic');
                  foundPatterns.add('forceStaticOrDynamic');
                }
              }
            });
          }
          if (decl.id && (decl.id.name === 'GET' || decl.id.name === 'POST')) {
            foundPatterns.add('routeHandler');
            foundPatterns.add(decl.id.name);
          }
        }
        path.node.specifiers?.forEach(spec => {
          if (spec.exported && spec.exported.name === 'metadata') {
            foundPatterns.add('metadata');
          }
          if (spec.exported && (spec.exported.name === 'GET' || spec.exported.name === 'POST')) {
            foundPatterns.add('routeHandler');
            foundPatterns.add(spec.exported.name);
          }
        });
      },

      // Check for API route (route.ts) and hooks
      CallExpression(path) {
        const calleeName = path.node.callee.name;
        if (calleeName === 'fetch') foundPatterns.add('fetch');
        if (calleeName === 'useState') foundPatterns.add('useState');
        if (calleeName === 'useEffect') foundPatterns.add('useEffect');
        if (calleeName === 'useReducer') foundPatterns.add('useReducer');
        if (calleeName === 'useCallback') foundPatterns.add('useCallback');
        if (calleeName === 'useMemo') foundPatterns.add('useMemo');
        if (calleeName === 'notFound') foundPatterns.add('notFound');
        if (calleeName === 'revalidatePath') foundPatterns.add('revalidatePath');
        if (calleeName === 'revalidateTag') foundPatterns.add('revalidateTag');
        if (calleeName === 'NextResponse') {
          foundPatterns.add('apiRoute');
          foundPatterns.add('ResponseJson');
        }
        if (path.node.callee.object && 
            (path.node.callee.object.name === 'Response' || path.node.callee.object.name === 'NextResponse') &&
            path.node.callee.property &&
            path.node.callee.property.name === 'json') {
          foundPatterns.add('apiRoute');
          foundPatterns.add('ResponseJson');
        }
      },

      // Check for Server Actions
      FunctionDeclaration(path) {
        if (path.node.async && 
            (path.node.id?.name?.includes('action') || 
             content.includes('use server'))) {
          foundPatterns.add('serverAction');
        }
      },

      // Check for form handling and Suspense
      JSXElement(path) {
        const elementName = path.node.openingElement.name?.name;
        if (elementName === 'form') {
          foundPatterns.add('formHandling');
        }
        if (elementName === 'Suspense') {
          foundPatterns.add('Suspense');
        }
      }
    });

    // Check which required patterns were found
    for (const pattern of patternsRequired) {
      if (foundPatterns.has(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) {
    // If parsing fails, try simple string matching as fallback
    for (const pattern of patternsRequired) {
      if (content.includes(pattern) || content.includes(pattern.replace(/([A-Z])/g, '-$1').toLowerCase())) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}
