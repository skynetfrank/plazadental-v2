export const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      <input
        type="text"
        placeholder="Buscar..."
        id="input-global-filter"
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </span>
  );
};
