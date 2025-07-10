import { readFileSync } from "fs";
import path from "path";

// Load configuration
const configPath = path.join(__dirname, "className-config.json");
let config = {
  maxLength: 80,
  maxClasses: 6,
  indentSize: 2,
};

try {
  const configFile = readFileSync(configPath, "utf8");
  config = { ...config, ...JSON.parse(configFile) };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
} catch (_error) {
  // Use default config if file doesn't exist or is invalid
}

/**
 * Counts the number of classes in a className string
 */
function countClasses(classNameValue) {
  return classNameValue
    .trim()
    .split(/\s+/)
    .filter(cls => cls.length > 0).length;
}

/**
 * Groups classes logically for better readability
 */
function groupClasses(classes) {
  const classArray = classes
    .trim()
    .split(/\s+/)
    .filter(cls => cls.length > 0);
  const groupedClasses = [];
  let currentGroup = [];

  classArray.forEach(cls => {
    currentGroup.push(cls);
    // Start new group every 3-4 classes or when hitting certain patterns
    if (
      currentGroup.length >= 3 ||
      cls.includes("hover:") ||
      cls.includes("focus:") ||
      cls.includes("active:") ||
      cls.includes("md:") ||
      cls.includes("lg:") ||
      cls.includes("xl:")
    ) {
      groupedClasses.push([...currentGroup]);
      currentGroup = [];
    }
  });

  // Add remaining classes
  if (currentGroup.length > 0) {
    groupedClasses.push(currentGroup);
  }

  return groupedClasses;
}

/**
 * Checks if we need to add clsx import
 */
function needsClsxImport(root) {
  let hasClsxImport = false;

  root.find("ImportDeclaration").forEach(path => {
    if (path.value.source.value === "clsx") {
      hasClsxImport = true;
    }
  });

  return !hasClsxImport;
}

/**
 * Adds clsx import to the file
 */
function addClsxImport(root, j) {
  const imports = root.find("ImportDeclaration");
  const clsxImport = j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier("clsx"))],
    j.literal("clsx")
  );

  if (imports.length > 0) {
    // Add after the last import
    imports.at(-1).insertAfter(clsxImport);
  } else {
    // Add at the beginning of the file
    const program = root.find(j.Program).get(0);
    if (program && program.node && program.node.body) {
      program.node.body.unshift(clsxImport);
    } else {
      console.error("Could not find program body to add import");
    }
  }
}

/**
 * Main transform function
 */
function transform(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Focus on specific files for debugging
  const isTargetFile =
    fileInfo.path.includes("Card.tsx") ||
    fileInfo.path.includes("TransactionCard.tsx");

  console.log(`Processing file: ${fileInfo.path}`);

  // For target files, print the entire source for debugging
  if (isTargetFile) {
    console.log("File source:");
    console.log(fileInfo.source);
  }

  let hasChanges = false;
  let needsImport = false;

  // Find all JSX attributes named "className"
  console.log(`Looking for className attributes in ${fileInfo.path}`);
  const classNameAttrs = root.find("JSXAttribute", {
    name: { name: "className" },
  });

  console.log(`Found ${classNameAttrs.length} className attributes`);

  classNameAttrs.forEach(path => {
    const value = path.value.value;

    console.log(
      `  Found className attribute with value type: ${value ? value.type : "undefined"}`
    );

    // For target files, print the raw value for debugging
    if (isTargetFile) {
      if (value) {
        if (value.type === "Literal") {
          console.log(`  Raw literal value: "${value.value}"`);
        } else if (value.type === "TemplateLiteral") {
          console.log(
            `  Raw template literal quasis: ${JSON.stringify(value.quasis.map(q => q.value.cooked))}`
          );
          console.log(
            `  Raw template literal expressions: ${value.expressions.length}`
          );
        } else if (value.type === "JSXExpressionContainer") {
          console.log(
            `  JSXExpressionContainer with expression type: ${value.expression ? value.expression.type : "undefined"}`
          );
        }
      }
    }

    // Process string literals, template literals, and JSX expression containers with template literals
    if (value) {
      let classNameValue = "";
      let isProcessable = false;

      if (value.type === "Literal" && typeof value.value === "string") {
        classNameValue = value.value;
        isProcessable = true;
      } else if (value.type === "TemplateLiteral") {
        console.log(
          `  TemplateLiteral with ${value.quasis.length} quasis and ${value.expressions.length} expressions`
        );

        // For template literals with expressions like `class1 class2 ${className}`,
        // we can still process the static part (class1 class2)
        if (value.quasis.length > 0) {
          // Extract the static part of the template literal (before any expressions)
          classNameValue = value.quasis[0].value.cooked.trim();
          isProcessable = classNameValue.length > 0;

          if (isTargetFile) {
            console.log(
              `  Extracted static part from template literal: "${classNameValue}"`
            );
          }
        } else {
          console.log(`  Skipping template literal with no static parts`);
        }
      } else if (
        value.type === "JSXExpressionContainer" &&
        value.expression &&
        value.expression.type === "TemplateLiteral"
      ) {
        // Handle JSX expression containers with template literals
        const templateLiteral = value.expression;
        console.log(
          `  JSX TemplateLiteral with ${templateLiteral.quasis.length} quasis and ${templateLiteral.expressions.length} expressions`
        );

        // Store the original template literal for later use
        const _originalTemplateLiteral = templateLiteral;

        if (templateLiteral.quasis.length > 0) {
          // Extract the static part of the template literal (before any expressions)
          classNameValue = templateLiteral.quasis[0].value.cooked.trim();
          isProcessable = classNameValue.length > 0;

          if (isTargetFile) {
            console.log(
              `  Extracted static part from JSX template literal: "${classNameValue}"`
            );
          }
        }
      } else {
        console.log(`  Skipping unsupported value type`);
        return; // Skip unsupported types
      }

      // Skip if we couldn't extract a processable className value
      if (!isProcessable || classNameValue.length === 0) {
        return;
      }

      const classCount = countClasses(classNameValue);
      const shouldTransform =
        classNameValue.length > config.maxLength ||
        classCount > config.maxClasses;

      // Always log for target files, otherwise only log if should transform
      if (isTargetFile || shouldTransform) {
        console.log(`  className: "${classNameValue}"`);
        console.log(
          `  length: ${classNameValue.length}, count: ${classCount}, shouldTransform: ${shouldTransform}`
        );

        if (shouldTransform) {
          // Log the grouped classes for debugging
          const groupedClasses = groupClasses(classNameValue);
          console.log(
            `  Would transform into ${groupedClasses.length} groups:`
          );
          groupedClasses.forEach((group, i) => {
            console.log(`    Group ${i + 1}: "${group.join(" ")}"`);
          });
        }
      }

      if (shouldTransform) {
        // Group the classes
        const groupedClasses = groupClasses(classNameValue);

        // Create array of string literals for each group
        const clsxArgs = groupedClasses.map(group =>
          j.literal(group.join(" "))
        );

        // Check if we're dealing with a template literal with expressions
        if (
          value.type === "JSXExpressionContainer" &&
          value.expression &&
          value.expression.type === "TemplateLiteral" &&
          value.expression.expressions &&
          value.expression.expressions.length > 0
        ) {
          // Add the dynamic parts (expressions) to the clsx arguments
          for (let i = 0; i < value.expression.expressions.length; i++) {
            clsxArgs.push(value.expression.expressions[i]);
          }
        }

        // Create clsx call expression
        const clsxCall = j.callExpression(j.identifier("clsx"), clsxArgs);

        // Replace the className value with a JSX expression containing the clsx call
        path.value.value = j.jsxExpressionContainer(clsxCall);

        // Log the transformation for debugging
        if (isTargetFile) {
          console.log(
            `  Transformed className to clsx call with ${clsxArgs.length} arguments`
          );
          console.log(
            `  First few arguments: ${clsxArgs
              .slice(0, 3)
              .map(arg =>
                arg.type === "Literal" ? arg.value : "dynamic-expression"
              )
              .join(", ")}`
          );
        }

        hasChanges = true;
        needsImport = true;
      }
    }
  });

  // Add clsx import if needed
  if (needsImport && needsClsxImport(root)) {
    addClsxImport(root, j);
  }

  if (isTargetFile || hasChanges) {
    console.log(`  hasChanges: ${hasChanges}`);
  }
  return hasChanges
    ? root.toSource({ quote: "single", reuseParsers: true })
    : null;
}

export default transform;
export const parser = "tsx";
