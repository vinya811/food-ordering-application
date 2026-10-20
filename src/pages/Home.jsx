import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Home.css";
import foods from "../data/foods";
import FoodCard from "../components/FoodCard";

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: "🍽️" },
    { name: "Pizza", icon: "🍕" },
    { name: "Burgers", icon: "🍔" },
    { name: "Chinese", icon: "🍜" },
    { name: "Pasta", icon: "🍝" },
    { name: "Desserts", icon: "🍰" },
    { name: "Drinks", icon: "🥤" }
  ];

  const popularFoods =
    selectedCategory === "All"
      ? foods.slice(0, 4)
      : foods.filter(
          (food) => food.category === selectedCategory
        );

  const handleOrderNow = () => {
    navigate("/menu");
  };

  return (
    <div className="home">

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO FOODIE 🍴
          </p>

          <h1>
            Delicious food,
            <br />
            delivered to your door.
          </h1>

          <p className="hero-text">
            Discover your favorite meals and order
            delicious food from our menu.
          </p>

          <button
            className="order-btn"
            onClick={handleOrderNow}
          >
            Order Now →
          </button>

        </div>

        <div className="hero-image">
          🍔
        </div>

      </section>


      {/* CATEGORIES */}

      <section className="categories-section">

        <p className="section-small">
          EXPLORE
        </p>

        <h2>
          Food Categories
        </h2>

        <div className="categories">

          {categories.map((category) => (
            <div
              key={category.name}
              className={`category-card ${
                selectedCategory === category.name
                  ? "active-category"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(category.name)
              }
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <h3>
                {category.name}
              </h3>

            </div>
          ))}

        </div>

      </section>


      {/* POPULAR FOOD */}

      <section className="popular-section">

        <div className="section-heading">

          <div>

            <p className="section-small">
              OUR FAVORITES
            </p>

            <h2>
              {selectedCategory === "All"
                ? "Popular Dishes"
                : `${selectedCategory} Favorites`}
            </h2>

          </div>

          <button
            className="view-menu"
            onClick={() => navigate("/menu")}
          >
            View Full Menu →
          </button>

        </div>


        <div className="food-grid">

          {popularFoods.length > 0 ? (

            popularFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAddToCart={addToCart}
              />
            ))

          ) : (

            <div className="no-home-results">

              <div>
                🔍
              </div>

              <h3>
                No food available
              </h3>

              <p>
                Try another category.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Home;