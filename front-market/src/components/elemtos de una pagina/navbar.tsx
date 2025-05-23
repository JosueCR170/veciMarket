import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";

 
 const Navbar: React.FC = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar className="custom-header">
          <IonTitle className="custom-title">
            Vec<span style={{ color: "#A8C7FF" }}>i</span>Mark<span style={{ color: "#A8C7FF" }}>e</span>t Lite
          </IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default Navbar;