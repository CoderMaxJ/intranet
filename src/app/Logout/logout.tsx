"useclient";
export default function Logout() {
  return (
    <div>
      <button
        className="nav-font"
        data-toggle="modal"
        data-target="#logoutModal"
      
        style={{ boxShadow: 'none', outline: 'none', background: 'none', border: 'none', color: '#ffffff' }}
      >
        Log Out
      </button>
    </div>
  );
}
