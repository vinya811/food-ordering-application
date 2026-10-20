function FoodCard({ food, onAddToCart }) {
  return (
    <div className="food-card">

      <div className="food-image">
        {food.emoji}
      </div>

      <div className="food-info">

        <div className="rating">
          ⭐ {food.rating}
        </div>

        <h3>{food.name}</h3>

        <p>{food.description}</p>

        <div className="food-bottom">

          <strong>₹{food.price}</strong>

          <button onClick={() => onAddToCart(food)}>
            + Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default FoodCard;