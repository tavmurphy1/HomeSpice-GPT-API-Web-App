import rapidjson
import re
from openai import AsyncOpenAI
from dotenv import load_dotenv
from models.recipe import RecipeCreate
from models.ingredient import Ingredient  # Make sure this is used
from fractions import Fraction

load_dotenv()
client = AsyncOpenAI()

GPT_RECIPE_PROMPT_TEMPLATE = (
    "You are a world-class chef.\n"
    "Create a recipe in JSON format with the following fields:\n"
    "- title (str)\n"
    "- description (str)\n"
    "- ingredients (list of strings)\n"
    "- steps (list of strings)\n"
    "- prep_time (int)\n"
    "- cook_time (int)\n"
    "- servings (int)\n"
    "- image_url (str or null)\n\n"
    "Use only ingredients from the following list: {}"
)

# Helper to process GPT ingredient strings into
# structured Ingredient-like dicts
def parse_ingredient_string(s: str) -> dict:
    if "to taste" in s.lower():
        name = s.lower().replace("to taste", "").strip() or "Seasoning"
        return {"name": name.title(), "quantity": 0.0, "unit": "to taste"}

    parts = s.replace(",", "").split()
    quantity = float(Fraction(parts[0]))
    unit = parts[1].lower()
    name = " ".join(parts[2:])

    known_units = {
        "tsp", "tbsp", "cups", "cup", "cloves", "pieces", "grams",
        "ml", "oz", "pint", "liters", "lb", "kg"
    }
    if unit not in known_units:
        name = " ".join([unit] + parts[2:])
        unit = "units"
    else:
        modifiers = {"chopped", "minced", "diced", "grated", "sliced"}
        tokens = name.split()
        if tokens and tokens[-1] in modifiers:
            tokens.pop()
        name = " ".join(tokens).title()

    return {"name": name, "quantity": quantity, "unit": unit}

# Main GPT-to-recipe generator
async def generate_recipe_from_ingredients(ingredients: list[str]) -> dict:
    prompt = GPT_RECIPE_PROMPT_TEMPLATE.format(", ".join(ingredients))

    response = await client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    content = response.choices[0].message.content.strip()

    # Strip wrapping code blocks
    if content.startswith("```"):
        content = content.strip("`")
        if content.startswith("json\n"):
            content = content[5:]

    # Clean up invalid JSON formatting
    content = re.sub(r',\s*([\]}])', r'\1', content)
    if content.startswith('"') and content.endswith('"'):
        content = content[1:-1]

    recipe_data = rapidjson.loads(content)

    # Normalize GPT outputs
    recipe_data.setdefault("description", "")
    recipe_data.setdefault("image_url", None)
    if recipe_data.get("image_url") == "null":
        recipe_data["image_url"] = None

    # Parse ingredients into structured objects
    parsed_ingredients = []
    for s in recipe_data.get("ingredients", []):
        try:
            parsed = parse_ingredient_string(s)
            Ingredient(**parsed)  # Validate early
            parsed_ingredients.append(parsed)
        except Exception:
            continue

    recipe_data["ingredients"] = parsed_ingredients

    # Final Pydantic validation using RecipeCreate
    validated = RecipeCreate.model_validate(recipe_data)
    return validated.model_dump(mode="python")  # use "python" for MongoDB
