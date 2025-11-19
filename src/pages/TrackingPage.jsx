import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import "./TrackingPage.css";

export function TrackingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibir el pedido completo
  const order = location.state?.order;

  if (!order) {
    return (
      <>
        <title>FLORIMAX - Estado del Pedido</title>
        <Header />
        <div className="tracking-wrapper">
          <div className="tracking-title">No se recibió información del pedido</div>
          <button className="back-button" onClick={() => navigate("/orders")}>
            ← Volver a mis pedidos
          </button>
        </div>
      </>
    );
  }

  // Pasos basados en tus booleanos
  const steps = [
    { label: "Pedido creado", done: order.pedidoCreado },
    { label: "Pendiente de pago", done: !order.pendientePago },
    { label: "Procesado", done: order.procesado },
    { label: "Enviado", done: order.enviado },
    { label: "Entregado", done: order.entregado },
  ];

  const currentStep = steps.filter(s => s.done).length - 1;

  return (
    <>
      <title>FLORIMAX - Tracking</title>
      <Header />
      <div className="tracking-wrapper">
        <div className="tracking-title">
          Estado del Pedido #{order.id}
        </div>

        <div className="tracking-progress">
          {steps.map((step, index) => (
            <div key={index} className="tracking-step">
              <div className={`step-circle ${index <= currentStep ? "active" : ""}`}>
                {index + 1}
              </div>
              <div className={`step-label ${index <= currentStep ? "active" : ""}`}>
                {step.label}
              </div>
            </div>
          ))}
        </div>

        <button className="back-button" onClick={() => navigate("/orders")}>
          ← Volver a mis pedidos
        </button>
      </div>
    </>
  );
}
