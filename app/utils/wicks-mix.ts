type Amount = {
  quantity: number | null;
  unit: string | null;
  name: string;
};

type Ingredient = Record<string, Amount[]>;

type Section = Record<string, Ingredient>;

type ShoppingList = Record<string, Record<string, Amount[]>>;
// type ShoppingList = Record<string, Section>;

type Recipes = Record<string, number>;

const ingredientRegex =
  /^((?<quantity>[\d.¼½¾⅓⅔⅛⅜⅝⅞]+)?\s*(?<unit>teaspoons?|tsp|tablespoons?|tbsp|fluid ounces?|fl oz|cups?|c|pints?|pt|quarts?|qt|gallons?|gal|milliliters?|millilitres?|ml|litres?|litres?|l|deciliters?|decilitres?|dl|ounces?|oz|pounds?|lb|grams?|g|kilograms?|kg|milligrams?|mg|inches?|in|centimeters?|centimetres?|cm|millimeters?|millimetres?|mm|fahrenheit|°F|celsius|°C|pinch(es)?|dash(es)?|sticks?|cloves?|heads?|bunch(es)?|slices?|pieces?|sprigs?|wholes?|halves|half|quarters?|handfuls?|thumb)?\s+)?(?<name>.+)$/;

// Utility function to convert fractions to decimals
function fractionToDecimal(str: string) {
  const fractions: { [key: string]: number } = {
    "¼": 0.25,
    "½": 0.5,
    "¾": 0.75,
    "⅓": 1 / 3,
    "⅔": 2 / 3,
    "⅛": 0.125,
    "⅜": 0.375,
    "⅝": 0.625,
    "⅞": 0.875,
  };
  if (fractions[str]) return fractions[str];
  if (str.includes("/")) {
    const [numerator, denominator] = str.split("/").map(Number);
    return numerator / denominator;
  }
  return parseFloat(str);
}

// Helper function to parse the ingredients from a file's content
function parseIngredients(list: string) {
  const sections: Section = {};

  const [ingredientsPart] = list.split("Recipes:");

  let currentSection: string | null = null;
  let lastLine: string | null = null;

  ingredientsPart.split("\n").forEach((line) => {
    const normalizedSection = line.replace(/:$/, "").trim(); // Remove trailing colons

    if (lastLine === null && normalizedSection.trim() !== "") {
      // First line
      currentSection = normalizedSection;
      sections[currentSection] = {};
    } else if (
      lastLine !== null &&
      lastLine.trim() === "" &&
      normalizedSection.trim() !== ""
    ) {
      // if last line was empty, then this is a section
      currentSection = normalizedSection;
      sections[currentSection] = {};
    } else {
      const match = normalizedSection.match(ingredientRegex); // Matches quantity, unit, and ingredient name

      if (
        match &&
        currentSection &&
        match.groups &&
        "quantity" in match.groups &&
        "unit" in match.groups &&
        "name" in match.groups
      ) {
        const {
          quantity: quantityGroup,
          unit: unitGroup,
          name: nameGroup,
        } = match.groups;
        const quantityStr = quantityGroup ? quantityGroup.trim() : null;
        const unitValue = unitGroup ? unitGroup.trim() : null;
        const name = nameGroup.toLowerCase(); // Convert ingredient to lowercase for easier matching

        // Convert string to number or null
        const quantity = quantityStr
          ? quantityStr
              .split("+")
              .reduce((acc, part) => acc + fractionToDecimal(part), 0)
          : null;

        const ingredientDetail = {
          quantity,
          unit: unitValue || null,
          name,
        };

        if (sections[currentSection][name]) {
          sections[currentSection][name].push(ingredientDetail);
        } else {
          sections[currentSection][name] = [ingredientDetail];
        }
      }
    }
    lastLine = normalizedSection;
  });

  return sections;
}

function combineQuantities(ingredients: Amount[]) {
  const reducedIngredients = ingredients.reduce((acc: Amount[], current) => {
    // Check if the ingredient with the same unit already exists in the accumulator
    const foundIngredient = acc.find(
      (ing) => ing.unit === current.unit && ing.name === current.name,
    );

    if (foundIngredient && foundIngredient.quantity && current.quantity) {
      // If found, just update its quantity
      foundIngredient.quantity += current.quantity;
    } else {
      // Otherwise, push it into the accumulator
      acc.push(current);
    }

    return acc;
  }, [] as Amount[]);

  return reducedIngredients;
}

// Main function
export function combineLists(lists: string[]) {
  const combinedSections: ShoppingList = {};
  const recipes: Recipes = {};
  let output = "";

  lists.forEach((list) => {
    const listSections = parseIngredients(list);

    // Combine ingredients by section
    Object.entries(listSections).forEach(([section, ingredients]) => {
      if (!combinedSections[section]) {
        combinedSections[section] = {};
      }
      Object.entries(ingredients).forEach(([name, quantities]) => {
        if (combinedSections[section][name]) {
          combinedSections[section][name].push(...quantities);
        } else {
          combinedSections[section][name] = quantities;
        }
      });
    });

    // Extract recipe information
    const recipeMatch = list.match(/Recipes:(.+)$/s);
    if (recipeMatch) {
      const recipeList = recipeMatch[1].split("\n").filter(Boolean);
      recipeList.forEach((recipe) => {
        const match = recipe.match(/^(\d+)[x×]\s+(.+)$/);
        if (match) {
          const count = parseInt(match[1], 10);
          const name = match[2];
          recipes[name] = (recipes[name] || 0) + count;
        }
      });
    }
  });

  // Output
  Object.entries(combinedSections).forEach(([section, ingredients]) => {
    output += section + "\n"; // Add the section name followed by a newline to the output string
    Object.entries(ingredients).forEach(([name, quantities]) => {
      const combinedIngredient = combineQuantities(quantities);
      const outputStr = `${combinedIngredient
        .map(
          (ing) =>
            `${ing.quantity ? ing.quantity : ""}${ing.unit ? ing.unit : ""}`,
        )
        .join(" + ")} ${name}`;
      output += outputStr + "\n"; // Add the outputStr followed by a newline to the output string
    });
    output += "\n"; // Add an empty line after each section
  });

  if (Object.keys(recipes).length > 0) {
    output += "Recipes:\n"; // Add "Recipes:" followed by a newline to the output string
    Object.entries(recipes).forEach(([name, count]) => {
      output += `${count}x ${name}\n`; // Add the recipe line followed by a newline to the output string
    });
  }

  return output; // Return the output string
}
