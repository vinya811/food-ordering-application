import { useState } from "react";
import { useCart } from "../context/CartContext";
import foods from "../data/foods";
import FoodCard from "../components/FoodCard";
import "./Menu.css";

function Menu() {
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { name: "All", icon: "🍽️" },
    { name: "Pizza", icon: "🍕" },
    { name: "Burgers", icon: "🍔" },
    { name: "Chinese", icon: "🍜" },
    { name: "Pasta", icon: "🍝" },
    { name: "Desserts", icon: "🍰" },
    { name: "Drinks", icon: "🥤" }
  ];

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const matchesSearch =
      food.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page">

      {/* HEADER */}

      <section className="menu-header">

        <p className="menu-small">
          EXPLORE OUR FOOD
        </p>

        <h1>
          Our Menu 🍴
        </h1>

        <p>
          Choose your favorite food and add it to your cart.
        </p>

      </section>


      {/* SEARCH */}

      <div className="menu-search">

        <span>🔎</span>

        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
          >
            ✕
          </button>
        )}

      </div>


      {/* CATEGORIES */}

      <section className="menu-categories">

        {categories.map((category) => (
          <button
            key={category.name}
            className={
              selectedCategory === category.name
                ? "menu-category active"
                : "menu-category"
            }
            onClick={() =>
              setSelectedCategory(category.name)
            }
          >

            <span>
              {category.icon}
            </span>

            {category.name}

          </button>
        ))}

      </section>


      {/* FOOD */}

      <section className="menu-food">

        <div className="menu-title">

          <h2>
            {searchTerm
              ? "Search Results"
              : selectedCategory === "All"
              ? "All Food"
              : selectedCategory}
          </h2>

          <span>
            {filteredFoods.length} items
          </span>

        </div>


        {filteredFoods.length > 0 ? (

          <div className="menu-grid">

            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAddToCart={addToCart}
              />
            ))}

          </div>

        ) : (

          <div className="menu-no-results">

            <div>
              🔍
            </div>

            <h3>
              No food found
            </h3>

            <p>
              Try another food name or category.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default Menu;