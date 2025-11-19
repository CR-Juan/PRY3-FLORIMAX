import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomBouquetPage } from './pages/CustomBouquetPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EditProfile } from './pages/EditProfile';
import { TrackingPage } from './pages/TrackingPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="custom-bouquet" element={<CustomBouquetPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="tracking" element={<TrackingPage />} />
    </Routes>
  );
}

export default App;