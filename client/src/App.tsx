import React, { useState, useEffect } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/product");
        console.log(response);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      console.log("Fetch token", token);
      if (token) {
        setToken(token);
        setIsLoggedIn(true);
      }
    };
    fetchToken();
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = "http://localhost:8000/auth/sign-in";
    const response = await axios.post(url, {
      username,
      password,
    });
    setToken(response.data.accessToken);
    localStorage.setItem("token", response.data.accessToken);
    setIsLoggedIn(true);
  };

  // Handle buy button click
  const handleBuy = async (product: any) => {
    const url = "http://localhost:8000/payment/create-checkout-session";
    console.log("Token", token);
    const response = await axios.post(
      url,
      {
        priceId: product.default_price,
        quantity: 1,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const session = response.data.session;
    console.log("Session res", response);
    // window.location.href = session.url;
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ padding: "1rem", background: "#282c34", color: "white" }}>
        <h1>My Shop</h1>
      </nav>

      {/* Login / Signup Section */}
      {!isLoggedIn && (
        <div style={{ padding: "2rem" }}>
          <h2>Login / Sign-Up</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{ marginTop: "1rem" }}>
              Login
            </button>
          </form>
        </div>
      )}

      {/* Products Section */}
      {isLoggedIn && (
        <div style={{ padding: "2rem" }}>
          <h2>Products</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    width: "200px",
                  }}
                >
                  <h3>{product.name}</h3>
                  <button
                    onClick={() => handleBuy(product)}
                    style={{
                      background: "#007bff",
                      color: "white",
                      padding: "0.5rem",
                    }}
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
